<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-white p-6">
    <div class="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center relative">

      <!-- Back -->
      <router-link
        to="/"
        class="absolute top-4 left-4 inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 font-semibold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </router-link>

      <!-- Header -->
      <h1 class="text-4xl font-extrabold text-emerald-700 text-center mb-2">Sign Up</h1>
      <p class="text-gray-600 text-center mb-8 text-lg">Create your account to get started.</p>

      <!-- Form -->
      <form class="w-full flex flex-col gap-6" @submit="handleSignup">
        <!-- Full name -->
        <div class="relative">
          <span class="absolute left-4 top-3 text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196zM12 12a4 4 0 100-8 4 4 0 000 8z"/>
            </svg>
          </span>
          <input
            id="name"
            type="text"
            placeholder="Full name"
            v-model="name"
            class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
            autocomplete="name"
            required
          />
        </div>

        <!-- Phone (optional but recommended if you’ll use phone onboarding) -->
        <div class="relative">
          <span class="absolute left-4 top-3 text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.684l1.518 4.553a1 1 0 01-.502 1.21l-2.26 1.13a11.042 11.042 0 005.516 5.516l1.13-2.26a1 1 0 011.21-.502l4.553 1.518a1 1 0 01.684.95V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
          </span>
          <input
            id="phone"
            type="tel"
            placeholder="Phone (e.g., +63…)"
            v-model="phone"
            class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
            autocomplete="tel"
          />
        </div>

        <!-- Email -->
        <div class="relative">
          <span class="absolute left-4 top-3 text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12l-4-4-4 4m8 0l-4 4-4-4" />
            </svg>
          </span>
          <input
            id="email"
            type="email"
            placeholder="Email"
            v-model="email"
            class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
            autocomplete="email"
            required
          />
        </div>

        <!-- Password -->
        <div class="relative">
          <span class="absolute left-4 top-3 text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.104 0 2 .896 2 2v1h-4v-1c0-1.104.896-2 2-2zM6 10V8a6 6 0 1112 0v2h1a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1h1z"/>
            </svg>
          </span>
          <input
            id="password"
            type="password"
            placeholder="Password"
            v-model="password"
            class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
            autocomplete="new-password"
            required
          />
        </div>

        <!-- Confirm Password -->
        <div class="relative">
          <span class="absolute left-4 top-3 text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </span>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            v-model="confirmPassword"
            class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
            autocomplete="new-password"
            required
          />
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 text-xl rounded-xl font-bold shadow-md transition-all disabled:opacity-60"
        >
          <span v-if="!loading">Register</span>
          <span v-else>Creating your account…</span>
        </button>

        <p v-if="errorMsg" class="text-red-600 text-sm">{{ errorMsg }}</p>
      </form>

      <!-- Back to login -->
      <p class="mt-8 text-lg text-gray-700 text-center">
        Already have an account? <br />
        <router-link to="/login">
          <span class="text-emerald-700 font-bold underline">Login here</span>
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { supabase } from '@/supabase/client'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const name = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref(null)
const loading = ref(false)

// Maps role to default dashboard (router guard will also handle this)
const DASH = {
  senior: '/senior/dashboard',
  barangay_staff: '/barangay/dashboard',
  osca_staff: '/osca/dashboard',
  admin: '/admin/dashboard'
}

// helper: get role_id for a role code
async function getRoleId(code) {
  const { data, error } = await supabase.from('roles').select('id').eq('code', code).maybeSingle()
  if (error || !data) return null
  return data.id
}

const handleSignup = async (e) => {
  e.preventDefault()
  errorMsg.value = null

  if (!email.value || !password.value || !name.value) {
    errorMsg.value = 'Please fill out name, email, and password.'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = "Passwords don't match."
    return
  }

  loading.value = true

  // 1) Create auth user (email/password)
  const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
    // NOTE: If you switch to phone OTP auth, you’d pass phone here instead.
  })

  if (signUpErr) {
    loading.value = false
    errorMsg.value = 'Signup failed: ' + signUpErr.message
    return
  }
  const user = signUpData.user
  if (!user) {
    loading.value = false
    errorMsg.value = 'Signup failed: no user returned.'
    return
  }

  // 2) Create / upsert profile (1–1 with auth.users)
  await supabase
    .from('profiles')
    .upsert({ user_id: user.id, full_name: name.value, phone: phone.value || null })
    .select()
    .maybeSingle()

  // 3) Assign SENIOR role by default (user_roles)
  const roleId = await getRoleId('senior')
  if (roleId) {
    await supabase
      .from('user_roles')
      .insert({ user_id: user.id, role_id: roleId })
      .then(() => {})
      .catch(() => {})
  }

  // 4) Put active_role in JWT so your RLS policies pass immediately
  await supabase.auth.updateUser({ data: { active_role: 'senior' } })

  // 5) OPTIONAL: if you want to create SeniorCitizens row at signup,
  // you cannot insert directly (RLS blocks inserts). Use a secure RPC instead.
  // Example (only if you add such an RPC server-side):
  // await supabase.rpc('onboard_new_senior_email', { p_phone: phone.value || null })

  loading.value = false
  // Let the router guard fan-out to /senior/dashboard
  router.push('/senior/dashboard')
}
</script>
