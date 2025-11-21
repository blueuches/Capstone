// supabase/functions/fill-pdf/index.ts

import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";
import { OSCA_PDF_COORDS } from "./oscaPdfCoords.ts";

interface RequestBody {
  request_id: number;
}

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { request_id } = (await req.json()) as RequestBody;

    if (!request_id) {
      return new Response(
        JSON.stringify({ error: "request_id is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ------------------------------------------------------------
    // 1. FETCH ANSWERS FOR THIS REQUEST
    // ------------------------------------------------------------
    // ⚠️ IMPORTANT:
    // You must shape this query so that you end up with
    // a map like { [field_key: string]: string } where field_key
    // matches keys in OSCA_PDF_COORDS (e.g. "first_name", "age", etc.)
    //
    // Example A: if RequestAnswers has field_key directly:
    //
    //   .select("field_key, value")
    //
    // Example B: if RequestAnswers joins FormFields:
    //
    //   .select("value, FormFields(field_key)")
    //
    // Adjust as needed to match your actual schema.
    // ------------------------------------------------------------

    const { data: answersRows, error: answersError } = await supabase
      .from("RequestAnswers")
      .select("field_key, value") // adjust this to your schema
      .eq("request_id", request_id);

    if (answersError) {
      console.error("Error fetching RequestAnswers:", answersError);
      throw answersError;
    }

    // Build: field_key -> answer value
    const answersByKey = new Map<string, string>();

    for (const row of answersRows ?? []) {
      const key = (row as any).field_key as string | undefined;
      const value = (row as any).value as string | null;
      if (!key) continue;
      answersByKey.set(key, value ?? "");
    }

    // ------------------------------------------------------------
    // 2. DOWNLOAD PDF TEMPLATE FROM STORAGE
    // ------------------------------------------------------------
    // Bucket: pdf-templates
    // File: osca-application-form-softcopy.pdf (as you described)
    // ------------------------------------------------------------

    const { data: templateFile, error: templateError } = await supabase.storage
      .from("pdf-templates")
      .download("osca-application-form-softcopy.pdf");

    if (templateError || !templateFile) {
      console.error("Error downloading template:", templateError);
      throw templateError ?? new Error("Template file not found");
    }

    const templateBytes = await templateFile.arrayBuffer();

    // ------------------------------------------------------------
    // 3. LOAD PDF, DRAW TEXT AT COORDINATES
    // ------------------------------------------------------------

    const pdfDoc = await PDFDocument.load(templateBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // We loop through all coords and see if we have an answer for that key.
    for (const [fieldKey, coord] of Object.entries(OSCA_PDF_COORDS)) {
      const value = answersByKey.get(fieldKey);
      if (!value) continue; // skip if no answer for this field

      const page = pages[coord.page];
      if (!page) continue;

      page.drawText(value, {
        x: coord.x,
        y: coord.y,
        size: coord.fontSize ?? 10,
        font,
      });
    }

    const filledBytes = await pdfDoc.save();

    // ------------------------------------------------------------
    // 4. UPLOAD FILLED PDF TO STORAGE
    // ------------------------------------------------------------
    // Bucket suggestion: "filled-pdfs" (create this bucket in Supabase)
    // Path: "requests/<request_id>/osca-application-<request_id>.pdf"
    // ------------------------------------------------------------

    const outputBucket = "filled-pdfs"; // adjust if you use a different bucket
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

    // Get public URL (or you can generate a signed URL if you want it private)
    const { data: publicUrlData } = supabase.storage
      .from(outputBucket)
      .getPublicUrl(outputPath);

    const publicUrl = publicUrlData.publicUrl;

    // ------------------------------------------------------------
    // 5. RETURN URL
    // ------------------------------------------------------------

    return new Response(JSON.stringify({ url: publicUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("fill-pdf error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
