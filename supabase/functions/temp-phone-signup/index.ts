import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // You can lock this to http://localhost:5173 later
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

serve(async (req) => {
  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const admin = createClient(supabaseUrl, serviceRole)

    const body = await req.json()
    const { phone, password, profile, passcode } = body

    // ✅ TEMP gate (recommended)
    const expected = Deno.env.get("TEMP_SIGNUP_PASSCODE") ?? ""
    if (expected && passcode !== expected) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid passcode" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    if (!phone || !password) {
      return new Response(JSON.stringify({ ok: false, error: "Missing phone/password" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    // 1) Create Auth user (phone + password), mark phone confirmed
    const { data, error } = await admin.auth.admin.createUser({
      phone,
      password,
      phone_confirm: true,
      user_metadata: { role: "senior" }
    })

    if (error) {
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    const userId = data.user?.id
    if (!userId) {
      return new Response(JSON.stringify({ ok: false, error: "No user id returned" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    // 2) Upsert profile
    const { error: profileErr } = await admin.from("profiles").upsert({
      id: userId,
      role: "senior",
      first_name: profile?.first_name ?? null,
      middle_name: profile?.middle_name ?? null,
      last_name: profile?.last_name ?? null,
      birthdate: profile?.birthdate ?? null,
      gender: profile?.gender ?? null,
      contact_no: profile?.contact_no ?? phone,
      barangay_id: profile?.barangay_id ?? null
    })

    if (profileErr) {
      return new Response(JSON.stringify({ ok: false, error: profileErr.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    return new Response(JSON.stringify({ ok: true, user_id: userId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }
})
