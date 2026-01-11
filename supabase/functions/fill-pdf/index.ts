// supabase/functions/fill-pdf/index.ts

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";
import { TEXT_COORDS, OPTION_COORDS } from "./oscaPdfCoords.ts";

interface RequestBody {
  request_id: number;
}

// CORS headers so your Vue app (localhost:5173) can call this function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Helper: parse checkbox / multi-select answers
function parseOptions(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const trimmed = String(raw).trim();
  if (!trimmed) return [];

  // Try JSON array first: '["SSS","GSIS"]'
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.map((v) => String(v));
    }
  } catch {
    // ignore JSON error
  }

  // Fallback: comma-separated string: "SSS, GSIS"
  return trimmed
    .split(",")
    .map((s) => s.trim())
    .filter((s) => !!s);
}

serve(async (req: Request) => {
  // 1. Handle preflight OPTIONS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // 2. Only allow POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { request_id } = (await req.json()) as RequestBody;

    if (!request_id) {
      return new Response(
        JSON.stringify({ error: "request_id is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    // --------------------------------------------------
    // 3. Supabase client (use PROJECT_URL + SERVICE_ROLE_KEY secrets)
    // --------------------------------------------------
    const supabaseUrl = Deno.env.get("PROJECT_URL");
    const supabaseServiceKey = Deno.env.get("SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        "Missing PROJECT_URL or SERVICE_ROLE_KEY environment variables",
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // --------------------------------------------------
    // 4. Fetch RequestAnswers for this request_id
    //    (no join here to avoid stack depth issues)
    // --------------------------------------------------
    const { data: ansRows, error: ansErr } = await supabase
      .from("RequestAnswers")
      .select("field_id, value")
      .eq("request_id", request_id);

    if (ansErr) {
      console.error("Error fetching RequestAnswers:", ansErr);
      throw ansErr;
    }

    const answers = ansRows ?? [];
    if (!answers.length) {
      console.warn("No RequestAnswers found for request_id", request_id);
    }

    // Collect unique field_ids
    const fieldIds = [...new Set(answers.map((r) => r.field_id))];

    // --------------------------------------------------
    // 5. Fetch FormFields metadata (id → label)
    // --------------------------------------------------
    const labelByFieldId = new Map<number, string>();

    if (fieldIds.length) {
      const { data: fieldRows, error: fieldErr } = await supabase
        .from("FormFields")
        .select("id, label")
        .in("id", fieldIds);

      if (fieldErr) {
        console.error("Error fetching FormFields:", fieldErr);
        throw fieldErr;
      }

      for (const f of fieldRows ?? []) {
        labelByFieldId.set(f.id as number, f.label as string);
      }
    }

    // Build label → value map
    const answersByLabel = new Map<string, string>();

    for (const row of answers) {
      const label = labelByFieldId.get(row.field_id as number);
      if (!label) continue;
      const value = row.value ?? "";
      if (!value) continue;
      answersByLabel.set(label, value);
    }

    // --------------------------------------------------
    // 6. Download PDF template from Storage
    //    Bucket: pdf-templates
    //    Path:   templates/osca-application-form-softcopy.pdf
    // --------------------------------------------------
    const { data: templateFile, error: templateError } = await supabase.storage
      .from("pdf-templates")
      .download("templates/osca_id_application_form_complete softcopy.pdf");

    if (templateError || !templateFile) {
      console.error("Error downloading template:", templateError);
      throw templateError ?? new Error("Template file not found");
    }

    const templateBytes = await templateFile.arrayBuffer();

    // --------------------------------------------------
    // 7. Load PDF and draw answers
    // --------------------------------------------------
    const pdfDoc = await PDFDocument.load(templateBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 7a. Text fields
    for (const [label, coord] of Object.entries(TEXT_COORDS)) {
      const value = answersByLabel.get(label);
      if (!value) continue;

      const page = pages[coord.page];
      if (!page) continue;

      page.drawText(value, {
        x: coord.x,
        y: coord.y,
        size: coord.fontSize ?? 10,
        font,
      });
    }

    // 7b. Radio / checkbox fields (draw "✓")
    for (const [label, optionMap] of Object.entries(OPTION_COORDS)) {
      const raw = answersByLabel.get(label);
      if (!raw) continue;

      const selectedOptions = parseOptions(raw);
      if (!selectedOptions.length) continue;

      for (const opt of selectedOptions) {
        const coord = optionMap[opt];
        if (!coord) continue;

        const page = pages[coord.page];
        if (!page) continue;

        page.drawText("✓", {
          x: coord.x,
          y: coord.y,
          size: coord.fontSize ?? 10,
          font,
        });
      }
    }

    const filledBytes = await pdfDoc.save(); // Uint8Array

    // --------------------------------------------------
    // 8. Upload filled PDF to Storage
    //    Bucket: filled-pdfs
    //    Path:   requests/<request_id>/osca-application-<request_id>.pdf
    // --------------------------------------------------
    const outputBucket = "filled-pdfs";
    const outputPath = `requests/${request_id}/osca-application-${request_id}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from(outputBucket)
      .upload(outputPath, filledBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading filled PDF:", uploadError);
      throw uploadError;
    }

    // --------------------------------------------------
    // 9. Get public URL for the filled PDF
    // --------------------------------------------------
    const { data: publicUrlData } = supabase.storage
      .from(outputBucket)
      .getPublicUrl(outputPath);

    const url = publicUrlData.publicUrl;

    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("fill-pdf error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});