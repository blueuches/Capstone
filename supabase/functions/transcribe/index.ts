// supabase/functions/transcribe/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return new Response("Missing audio file", { status: 400 })
    }

    const whisperRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: formData,
    })

    const data = await whisperRes.text()
    return new Response(data, {
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error(err)
    return new Response("Error processing audio", { status: 500 })
  }
})
