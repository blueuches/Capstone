import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument } from "https://esm.sh/pdf-lib@1.17.1";

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function toText(v: Json): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(", ");
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function isTruthy(v: any): boolean {
  return v === true || v === "true" || v === 1 || v === "1" || v === "yes";
}

async function listHasFile(
  supabase: any,
  bucket: string,
  folder: string,
  filename: string,
): Promise<boolean> {
  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    search: filename,
    limit: 20,
  });
  if (error) return false;
  return (data ?? []).some((x: any) => x?.name === filename);
}

async function signedUrl(
  supabase: any,
  bucket: string,
  path: string,
  seconds = 60 * 10,
): Promise<string | null> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(
    path,
    seconds,
  );
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceKey) {
      return jsonResponse(
        {
          ok: false,
          error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
        },
        500,
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const payload = await req.json().catch(() => ({}));
    const action: string = payload?.action ?? "generate";
    const form_submission_id: string | undefined = payload?.form_submission_id;

    // role hint used by action="best"
    const roleHint: string = payload?.role ?? "senior"; // "senior" | "osca_staff" | "barangay_staff"
    const maybeFormId: string | undefined = payload?.form_id;

    // ---------------------------
    // Helpers: load submission/app/form template path
    // ---------------------------
    async function loadSubmissionAndApp(submissionId: string) {
      const { data: sub, error: subErr } = await supabase
        .from("form_submissions")
        .select("id, form_id, application_id, created_at")
        .eq("id", submissionId)
        .single();

      if (subErr || !sub) {
        return {
          ok: false,
          status: 404,
          error: "Form submission not found",
          details: subErr?.message ?? null,
        };
      }

      const { data: app, error: appErr } = await supabase
        .from("applications")
        .select("id, senior_id")
        .eq("id", sub.application_id)
        .single();

      if (appErr || !app) {
        return {
          ok: false,
          status: 404,
          error: "Application not found",
          details: appErr?.message ?? null,
        };
      }

      return {
        ok: true,
        sub,
        app,
        seniorId: String(app.senior_id),
        applicationId: String(app.id),
        formId: String(sub.form_id),
      };
    }

    async function resolveTemplatePath(formId?: string) {
      const FALLBACK_BUCKET = "template";
      const FALLBACK_PATH = "OSCAForm-Softcopy-Fillable.pdf";

      if (!formId) {
        return { bucket: FALLBACK_BUCKET, path: FALLBACK_PATH };
      }

      const { data: formRow, error: formErr } = await supabase
        .from("forms")
        .select("id, pdf_template_storage_path")
        .eq("id", formId)
        .maybeSingle();

      if (formErr) {
        // fallback if query fails
        return { bucket: FALLBACK_BUCKET, path: FALLBACK_PATH };
      }

      const p = formRow?.pdf_template_storage_path;
      if (p && typeof p === "string" && p.length > 0) {
        return { bucket: FALLBACK_BUCKET, path: p };
      }

      return { bucket: FALLBACK_BUCKET, path: FALLBACK_PATH };
    }

    // ---------------------------
    // ACTION: template
    // ---------------------------
    if (action === "template") {
      const tpl = await resolveTemplatePath(maybeFormId);
      const url = await signedUrl(supabase, tpl.bucket, tpl.path);

      if (!url) {
        return jsonResponse(
          {
            ok: false,
            error: "Template signed URL failed",
            template: tpl,
          },
          500,
        );
      }

      return jsonResponse({ ok: true, kind: "template", url, template: tpl });
    }

    // All other actions require form_submission_id
    if (!form_submission_id) {
      return jsonResponse({ ok: false, error: "Missing form_submission_id" }, 400);
    }

    const loaded = await loadSubmissionAndApp(form_submission_id);
    if (!loaded.ok) {
      return jsonResponse({ ok: false, ...loaded }, loaded.status);
    }

    const { seniorId, applicationId, formId } = loaded as any;
    const tpl = await resolveTemplatePath(formId);

    const OUT_BUCKET = "pdfs-storage";
    const baseDir = `osca-forms/${seniorId}/${applicationId}`;
    const filename = `osca_form_${form_submission_id}.pdf`;

    // New preferred paths
    const finalPath = `${baseDir}/final/${filename}`;
    const draftPath = `${baseDir}/draft/${filename}`;

    // Legacy support (your existing path)
    const legacyPath = `${baseDir}/${filename}`;

    // ---------------------------
    // ACTION: generated (FINAL exists? else legacy)
    // ---------------------------
    if (action === "generated") {
      const hasFinal = await listHasFile(
        supabase,
        OUT_BUCKET,
        `${baseDir}/final`,
        filename,
      );

      if (hasFinal) {
        const url = await signedUrl(supabase, OUT_BUCKET, finalPath);
        return jsonResponse({ ok: true, exists: true, kind: "final", url });
      }

      const hasLegacy = await listHasFile(supabase, OUT_BUCKET, baseDir, filename);
      if (hasLegacy) {
        const url = await signedUrl(supabase, OUT_BUCKET, legacyPath);
        return jsonResponse({ ok: true, exists: true, kind: "legacy", url });
      }

      return jsonResponse({ ok: true, exists: false });
    }

    // ---------------------------
    // ACTION: draft_generated (DRAFT exists?)
    // ---------------------------
    if (action === "draft_generated") {
      const hasDraft = await listHasFile(
        supabase,
        OUT_BUCKET,
        `${baseDir}/draft`,
        filename,
      );

      if (!hasDraft) return jsonResponse({ ok: true, exists: false });

      const url = await signedUrl(supabase, OUT_BUCKET, draftPath);
      return jsonResponse({ ok: true, exists: true, kind: "draft", url });
    }

    // ---------------------------
    // ACTION: best
    // Senior: final > legacy > draft > template
    // Staff: final > legacy > template  (no draft by default)
    // ---------------------------
    if (action === "best") {
      const hasFinal = await listHasFile(
        supabase,
        OUT_BUCKET,
        `${baseDir}/final`,
        filename,
      );
      if (hasFinal) {
        const url = await signedUrl(supabase, OUT_BUCKET, finalPath);
        if (!url) return jsonResponse({ ok: false, error: "Signed URL failed" }, 500);
        return jsonResponse({ ok: true, kind: "final", url, template: tpl });
      }

      const hasLegacy = await listHasFile(supabase, OUT_BUCKET, baseDir, filename);
      if (hasLegacy) {
        const url = await signedUrl(supabase, OUT_BUCKET, legacyPath);
        if (!url) return jsonResponse({ ok: false, error: "Signed URL failed" }, 500);
        return jsonResponse({ ok: true, kind: "legacy", url, template: tpl });
      }

      if (roleHint === "senior") {
        const hasDraft = await listHasFile(
          supabase,
          OUT_BUCKET,
          `${baseDir}/draft`,
          filename,
        );
        if (hasDraft) {
          const url = await signedUrl(supabase, OUT_BUCKET, draftPath);
          if (!url) return jsonResponse({ ok: false, error: "Signed URL failed" }, 500);
          return jsonResponse({ ok: true, kind: "draft", url, template: tpl });
        }
      }

      const templateUrl = await signedUrl(supabase, tpl.bucket, tpl.path);
      if (!templateUrl) {
        return jsonResponse(
          { ok: false, error: "Template signed URL failed", template: tpl },
          500,
        );
      }

      return jsonResponse({ ok: true, kind: "template", url: templateUrl, template: tpl });
    }

    // ---------------------------
    // Load answers + fields
    // ---------------------------
    const { data: rows, error: rowsErr } = await supabase
      .from("form_answers")
      .select(`
        id,
        value,
        field:form_fields(
          id,
          section,
          field_key,
          field_type,
          pdf_field_name,
          options,
          depends_on
        )
      `)
      .eq("form_submission_id", form_submission_id);

    if (rowsErr) {
      return jsonResponse(
        { ok: false, error: "Failed to load form_answers", details: rowsErr.message },
        500,
      );
    }

    const answersByKey: Record<string, any> = {};
    for (const r of rows ?? []) {
      const f = (r as any).field;
      if (!f?.field_key) continue;
      answersByKey[String(f.field_key)] = (r as any).value;
    }

    function dependsSatisfied(dep: any): boolean {
      if (!dep) return true;

      const key = dep.field_key;
      const op = dep.op;
      const expected = dep.value;
      const actual = answersByKey[key];

      if (op === "=") return actual === expected;

      if (op === "contains") {
        if (Array.isArray(actual)) return actual.map(String).includes(String(expected));
        if (typeof actual === "string") return actual.includes(String(expected));
        return false;
      }

      return true;
    }

    // ---------------------------
    // Download template
    // ---------------------------
    const { data: file, error: dlErr } = await supabase.storage
      .from(tpl.bucket)
      .download(tpl.path);

    if (dlErr || !file) {
      return jsonResponse(
        {
          ok: false,
          error: "Template download failed",
          details: dlErr?.message ?? null,
          template: tpl,
        },
        500,
      );
    }

    const templateBytes = await file.arrayBuffer();

    // ---------------------------
    // Fill & Upload
    // ---------------------------
    async function generatePdf(kind: "draft" | "final") {
      const pdfDoc = await PDFDocument.load(templateBytes);
      const pdfForm = pdfDoc.getForm();

      const filled: string[] = [];
      const skipped: string[] = [];

      function setCheckbox(pdfFieldName: string, checked: boolean) {
        try {
          const cb = pdfForm.getCheckBox(pdfFieldName);
          if (checked) cb.check();
          else cb.uncheck();
          filled.push(pdfFieldName);
        } catch {
          skipped.push(pdfFieldName);
        }
      }

      function setText(pdfFieldName: string, text: string) {
        try {
          const tf = pdfForm.getTextField(pdfFieldName);
          tf.setText(text);
          filled.push(pdfFieldName);
        } catch {
          skipped.push(pdfFieldName);
        }
      }

      for (const r of rows ?? []) {
        const f = (r as any).field;
        if (!f) continue;

        // Draft fills only A_APPLICANT
        if (kind === "draft" && String(f.section) !== "A_APPLICANT") continue;

        // respect depends_on
        if (!dependsSatisfied(f.depends_on)) continue;

        const fieldKey = String(f.field_key || "");
        const fieldType = String(f.field_type || "text").toLowerCase();
        const value = answersByKey[fieldKey];

        // A) Direct pdf field mapping
        if (f.pdf_field_name) {
          const pdfName = String(f.pdf_field_name);

          if (fieldType === "checkbox") {
            setCheckbox(pdfName, isTruthy(value));
          } else {
            setText(pdfName, toText(value as any));
          }
          continue;
        }

        // B) checkbox group mapping via options.pdf_mapping
        const opts = f.options || {};
        const mapping = opts?.pdf_mapping;

        if (mapping?.type === "checkbox_group" && mapping?.checkboxes) {
          const checkboxes: Record<string, string> = mapping.checkboxes;

          if (fieldType === "multiselect") {
            const selected = Array.isArray(value) ? value.map(String) : [];
            for (const [choiceKey, pdfCbName] of Object.entries(checkboxes)) {
              setCheckbox(String(pdfCbName), selected.includes(String(choiceKey)));
            }
            continue;
          }

          const chosen = value === null || value === undefined ? "" : String(value);
          for (const [choiceKey, pdfCbName] of Object.entries(checkboxes)) {
            setCheckbox(String(pdfCbName), String(choiceKey) === chosen);
          }
          continue;
        }
      }

      // Flatten so it becomes a normal PDF (safer for viewing)
      pdfForm.flatten();

      const outBytes = await pdfDoc.save();

      const path = kind === "draft" ? draftPath : finalPath;

      // ✅ IMPORTANT: upsert so OSCA can regenerate anytime
      const { error: upErr } = await supabase.storage
        .from(OUT_BUCKET)
        .upload(path, outBytes, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (upErr) {
        return {
          ok: false,
          error: "Upload failed",
          details: String((upErr as any)?.message ?? upErr ?? "unknown"),
          storage: { bucket: OUT_BUCKET, path },
        };
      }

      const url = await signedUrl(supabase, OUT_BUCKET, path);
      if (!url) {
        return { ok: false, error: "Signed URL failed", storage: { bucket: OUT_BUCKET, path } };
      }

      return {
        ok: true,
        kind,
        url,
        storage: { bucket: OUT_BUCKET, path },
        filled_count: filled.length,
        skipped,
      };
    }

    // ---------------------------
    // ACTION: generate_draft
    // ---------------------------
    if (action === "generate_draft") {
      const res = await generatePdf("draft");
      if (!res.ok) return jsonResponse({ ok: false, ...res }, 500);

      return jsonResponse({
        ok: true,
        ...res,
        meta: {
          senior_id: seniorId,
          application_id: applicationId,
          form_submission_id,
          template: tpl,
        },
      });
    }

    // ---------------------------
    // ACTION: generate (FINAL)
    // ---------------------------
    if (action === "generate") {
      const res = await generatePdf("final");
      if (!res.ok) return jsonResponse({ ok: false, ...res }, 500);

      return jsonResponse({
        ok: true,
        ...res,
        meta: {
          senior_id: seniorId,
          application_id: applicationId,
          form_submission_id,
          template: tpl,
        },
      });
    }

    return jsonResponse({ ok: false, error: `Unknown action: ${action}` }, 400);
  } catch (e: any) {
    console.error(e);
    return jsonResponse(
      {
        ok: false,
        error: "Unhandled exception",
        details: e?.message ?? String(e),
      },
      500,
    );
  }
});
