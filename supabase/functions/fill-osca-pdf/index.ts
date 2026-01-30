// supabase/functions/fill-osca-pdf/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument } from "https://esm.sh/pdf-lib@1.17.1";

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

serve(async (req) => {
  // ✅ CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceKey) {
      return jsonResponse(
        { ok: false, error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
        500,
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // ---------------------------
    // ✅ Parse request payload
    // ---------------------------
    const payload = await req.json().catch(() => ({}));
    const action = payload?.action ?? "generate"; // "template" | "generate" (default)
    const form_submission_id: string | undefined = payload?.form_submission_id;

    // ---------------------------
    // ✅ ACTION: return template signed URL
    // (Use service role so client doesn't need template bucket access)
    // ---------------------------
    if (action === "template") {
      const TEMPLATE_BUCKET = "template";
      const TEMPLATE_PATH = "OSCAForm-Softcopy-Fillable.pdf";

      const { data: signed, error: signErr } = await supabase.storage
        .from(TEMPLATE_BUCKET)
        .createSignedUrl(TEMPLATE_PATH, 60 * 10); // 10 min

      if (signErr || !signed?.signedUrl) {
        console.error(signErr);
        return jsonResponse(
          {
            ok: false,
            error: "Template signed URL failed",
            template: { bucket: TEMPLATE_BUCKET, path: TEMPLATE_PATH },
            details: String((signErr as any)?.message ?? signErr ?? "unknown"),
          },
          500,
        );
      }

      return jsonResponse({
        ok: true,
        url: signed.signedUrl,
        template: { bucket: TEMPLATE_BUCKET, path: TEMPLATE_PATH },
      });
    }

    // ---------------------------
    // ✅ ACTION: generate filled PDF
    // ---------------------------
    if (!form_submission_id) {
      return jsonResponse({ ok: false, error: "Missing form_submission_id" }, 400);
    }

    // 1) Load submission (to get application_id + form_id)
    const { data: sub, error: subErr } = await supabase
      .from("form_submissions")
      .select("id, form_id, application_id, created_at")
      .eq("id", form_submission_id)
      .single();

    if (subErr || !sub) {
      console.error(subErr);
      return jsonResponse({ ok: false, error: "Form submission not found" }, 404);
    }

    // 2) Load application (to get senior_id for storage alignment)
    const { data: app, error: appErr } = await supabase
      .from("applications")
      .select("id, senior_id")
      .eq("id", sub.application_id)
      .single();

    if (appErr || !app) {
      console.error(appErr);
      return jsonResponse({ ok: false, error: "Application not found" }, 404);
    }

    const seniorId = String(app.senior_id);
    const applicationId = String(app.id);

    // 3) Load answers + their field definitions
    const { data: rows, error: rowsErr } = await supabase
      .from("form_answers")
      .select(`
        id,
        value,
        field:form_fields(
          id,
          field_key,
          field_type,
          pdf_field_name,
          options,
          depends_on
        )
      `)
      .eq("form_submission_id", form_submission_id);

    if (rowsErr) {
      console.error(rowsErr);
      return jsonResponse({ ok: false, error: "Failed to load form_answers" }, 500);
    }

    // Build answersByKey: field_key -> value
    const answersByKey: Record<string, any> = {};
    for (const r of rows ?? []) {
      const f = (r as any).field;
      if (!f?.field_key) continue;
      answersByKey[String(f.field_key)] = (r as any).value;
    }

    // depends_on evaluation supports your patterns:
    // - { op:"=", field_key:"x", value:"y" }
    // - { op:"contains", field_key:"x", value:"y" }  // for multiselect arrays
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

      // Unknown op => don't block filling
      return true;
    }

    // 4) Download template PDF from Storage
    // ✅ CONFIRMED: bucket "template", root file "OSCAForm-Softcopy-Fillable.pdf"
    const TEMPLATE_BUCKET = "template";
    const TEMPLATE_PATH = "OSCAForm-Softcopy-Fillable.pdf";

    const { data: file, error: dlErr } = await supabase.storage
      .from(TEMPLATE_BUCKET)
      .download(TEMPLATE_PATH);

    if (dlErr || !file) {
      console.error(dlErr);
      return jsonResponse(
        {
          ok: false,
          error: "Template download failed",
          template: { bucket: TEMPLATE_BUCKET, path: TEMPLATE_PATH },
          details: String((dlErr as any)?.message ?? dlErr ?? "unknown"),
        },
        500,
      );
    }

    const templateBytes = await file.arrayBuffer();

    // 5) Fill PDF
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

      // respect depends_on
      if (!dependsSatisfied(f.depends_on)) continue;

      const fieldKey = String(f.field_key || "");
      const fieldType = String(f.field_type || "text").toLowerCase();
      const value = answersByKey[fieldKey];

      // A) Direct mapping
      if (f.pdf_field_name) {
        const pdfName = String(f.pdf_field_name);

        // Direct checkbox fields (if you ever create them)
        if (fieldType === "checkbox") {
          setCheckbox(pdfName, isTruthy(value));
        } else {
          // text / number / date
          setText(pdfName, toText(value as any));
        }
        continue;
      }

      // B) Your checkbox-group mapping via options.pdf_mapping
      const opts = f.options || {};
      const mapping = opts?.pdf_mapping;

      if (mapping?.type === "checkbox_group" && mapping?.checkboxes) {
        const checkboxes: Record<string, string> = mapping.checkboxes;

        // Multiselect => value should be array of selected keys
        if (fieldType === "multiselect") {
          const selected = Array.isArray(value) ? value.map(String) : [];
          for (const [choiceKey, pdfCbName] of Object.entries(checkboxes)) {
            setCheckbox(String(pdfCbName), selected.includes(String(choiceKey)));
          }
          continue;
        }

        // Radio/select => value is one key (string)
        const chosen = value === null || value === undefined ? "" : String(value);
        for (const [choiceKey, pdfCbName] of Object.entries(checkboxes)) {
          setCheckbox(String(pdfCbName), String(choiceKey) === chosen);
        }
        continue;
      }

      // No direct pdf field and no mapping => skip
    }

    // Flatten => make it non-editable
    pdfForm.flatten();
    const outBytes = await pdfDoc.save();

    // 6) Upload generated PDF to your desired bucket aligned with senior + application
    const OUT_BUCKET = "pdfs-storage";
    const outPath = `osca-forms/${seniorId}/${applicationId}/osca_form_${form_submission_id}.pdf`;

    const { error: upErr } = await supabase.storage
      .from(OUT_BUCKET)
      .upload(outPath, outBytes, { contentType: "application/pdf", upsert: true });

    if (upErr) {
      console.error(upErr);
      return jsonResponse(
        { ok: false, error: "Upload failed", details: String((upErr as any)?.message ?? upErr ?? "unknown") },
        500,
      );
    }

    // 7) Return signed URL for viewing (generated)
    const { data: signed, error: signErr } = await supabase.storage
      .from(OUT_BUCKET)
      .createSignedUrl(outPath, 60 * 10); // 10 minutes

    if (signErr || !signed?.signedUrl) {
      console.error(signErr);
      return jsonResponse(
        { ok: false, error: "Signed URL failed", details: String((signErr as any)?.message ?? signErr ?? "unknown") },
        500,
      );
    }

    return jsonResponse({
      ok: true,
      url: signed.signedUrl,
      storage: { bucket: OUT_BUCKET, path: outPath },
      meta: {
        senior_id: seniorId,
        application_id: applicationId,
        form_submission_id,
        template: { bucket: TEMPLATE_BUCKET, path: TEMPLATE_PATH },
      },
      filled_count: filled.length,
      skipped,
    });
  } catch (e) {
    console.error(e);
    return jsonResponse({ ok: false, error: String(e) }, 500);
  }
});
