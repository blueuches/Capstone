import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument } from "https://esm.sh/pdf-lib@1.17.1";

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const supabase = createClient(supabaseUrl, serviceKey);

    // Example input: { "request_id": 123 }
    const { request_id } = await req.json();

    // 1) Pull data from Postgres
    const { data, error } = await supabase
      .from("Request")
      .select("*")
      .eq("id", request_id)
      .single();

    if (error || !data) {
      return new Response("Record not found", { status: 404 });
    }

    // 2) Download your PDF template from Storage
    const templatePath = "templates/osca_form.pdf";
    const { data: file, error: dlErr } = await supabase
      .storage
      .from("pdf")
      .download(templatePath);

    if (dlErr || !file) {
      return new Response("Template download failed", { status: 500 });
    }

    const templateBytes = await file.arrayBuffer();

    // 3) Fill fields
    const pdfDoc = await PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();

    // IMPORTANT: use your actual field names from the PDF:
    form.getTextField("full_name").setText(data.full_name ?? "");
    form.getTextField("address").setText(data.address ?? "");
    // form.getCheckBox("is_senior").check();

    // Optional: flatten so fields become normal text (non-editable)
    form.flatten(); // flatten behavior documented by pdf-lib :contentReference[oaicite:3]{index=3}

    const outBytes = await pdfDoc.save();

    // 4) Upload finished PDF back to Storage
    const outPath = `generated/request_${request_id}.pdf`;
    const { error: upErr } = await supabase.storage
      .from("pdf")
      .upload(outPath, outBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (upErr) {
      return new Response("Upload failed", { status: 500 });
    }

    // If your bucket is public:
    const { data: pub } = supabase.storage.from("pdf").getPublicUrl(outPath);

    return new Response(JSON.stringify({ path: outPath, url: pub.publicUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(String(e), { status: 500 });
  }
});
