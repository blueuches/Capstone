<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-white p-6">
    <div class="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center relative">

      <!-- Back -->
      <router-link
        to="/"
        class="absolute top-4 left-4 inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 font-semibold"
        aria-label="Back to Home"
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
      <form class="w-full flex flex-col gap-5" @submit.prevent="handleSignup" novalidate>
        <!-- Full name -->
        <div class="relative">
          <label for="name" class="sr-only">Full name</label>
          <span class="absolute left-4 top-3 text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196zM12 12a4 4 0 100-8 4 4 0 000 8z"/>
            </svg>
          </span>
          <input
            id="name"
            type="text"
            placeholder="Full name"
            v-model.trim="form.name"
            class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
            autocomplete="name"
            required
          />
        </div>

        <!-- Email -->
        <div class="relative">
          <label for="email" class="sr-only">Email</label>
          <span class="absolute left-4 top-3 text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12l-4-4-4 4m8 0l-4 4-4-4" />
            </svg>
          </span>
          <input
            id="email"
            type="email"
            placeholder="Email"
            v-model.trim="form.email"
            class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
            autocomplete="email"
            required
          />
        </div>

        <!-- Barangay -->
        <div class="relative">
          <label for="barangay" class="sr-only">Barangay</label>
          <span class="absolute left-4 top-3 text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C8.134 2 5 5.134 5 9v5l-2 2v1h18v-1l-2-2V9c0-3.866-3.134-7-7-7z" />
            </svg>
          </span>
          <select
            id="barangay"
            v-model="form.barangay_id"
            class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
            required
          >
            <option value="">Select Barangay</option>
            <option v-for="b in barangays" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>

        <!-- Password -->
        <div class="relative">
          <label for="password" class="sr-only">Password</label>
          <span class="absolute left-4 top-3 text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.104 0 2 .896 2 2v1h-4v-1c0-1.104.896-2 2-2zM6 10V8a6 6 0 1112 0v2h1a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1h1z"/>
            </svg>
          </span>
          <input
            id="password"
            :type="showPw ? 'text' : 'password'"
            placeholder="Password (min 8 characters)"
            v-model="form.password"
            class="w-full pl-12 pr-12 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
            autocomplete="new-password"
            required
            minlength="8"
          />
          <button type="button" class="absolute right-3 top-3 text-gray-500 hover:text-gray-700" @click="showPw = !showPw" :aria-pressed="showPw.toString()">
            <span v-if="!showPw">Show</span><span v-else>Hide</span>
          </button>
            <p v-if="form.password" class="mt-1 text-xs" :class="pwStrength.color">
              {{ pwStrength.text }}
            </p>
        </div>

        <!-- Confirm Password -->
        <div class="relative">
          <label for="confirmPassword" class="sr-only">Confirm Password</label>
          <span class="absolute left-4 top-3 text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </span>
          <input
            id="confirmPassword"
            :type="showPw ? 'text' : 'password'"
            placeholder="Confirm Password"
            v-model="form.confirmPassword"
            class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
            autocomplete="new-password"
            required
          />
          <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="mt-1 text-xs text-red-600">Passwords do not match.</p>
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
        <p v-if="successMsg" class="text-emerald-700 text-sm">{{ successMsg }}</p>
      </form>

      <!-- Staff link -->
      <p class="mt-6 text-sm text-gray-600">
        Are you OSCA/Barangay staff? 
        <router-link to="/staff/signup" class="text-emerald-700 font-semibold underline">Sign up as staff</router-link>
      </p>

      <!-- Back to login -->
      <p class="mt-6 text-lg text-gray-700 text-center">
        Already have an account?
        <router-link to="/login">
          <span class="text-emerald-700 font-bold underline">Login here</span>
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase/client'

// ------------ state ------------
const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const showPw = ref(false)

const form = ref({
  name: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  barangay_id: ''
})

const barangays = ref([])

onMounted(async () => {
  const { data, error } = await supabase.from('Barangays').select('*').order('name')
  if (!error) barangays.value = data
})


// ------------ helpers ------------
const phoneHint = computed(() => {
  if (!form.value.phone) return ''
  return 'We will normalize this to +63 format.'
})

function normalizePhone(ph) {
  if (!ph) return null
  // strip spaces & non-digits except leading +
  let s = ph.trim().replace(/[^\d+]/g, '')
  // Handle common PH patterns: 09xxxxxxxxx -> +639xxxxxxxxx; 9xxxxxxxxx -> +639xxxxxxxxx; 639... -> +639...
  if (s.startsWith('+')) return s
  if (s.startsWith('09')) return '+63' + s.slice(1)
  if (s.startsWith('9') && s.length === 10) return '+63' + s
  if (s.startsWith('63')) return '+' + s
  return s // last resort
}

const pwStrength = computed(() => {
  const p = form.value.password || ''
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[a-z]/.test(p)) score++
  if (/\d/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  const levels = [
    { text: 'Too weak', color: 'text-red-600' },
    { text: 'Weak', color: 'text-orange-600' },
    { text: 'Fair', color: 'text-yellow-600' },
    { text: 'Good', color: 'text-green-600' },
    { text: 'Strong', color: 'text-emerald-700' }
  ]
  return levels[Math.min(score, levels.length - 1)]
})

// ------------ main action ------------
async function handleSignup() {
  errorMsg.value = ''
  successMsg.value = ''

  // basic validation
  if (!form.value.name || !form.value.email || !form.value.password) {
    errorMsg.value = 'Please fill out name, email, and password.'
    return
  }
  if (form.value.password.length < 8) {
    errorMsg.value = 'Password must be at least 8 characters.'
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    errorMsg.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  try {
    const normalizedPhone = normalizePhone(form.value.phone)

    // 1) Create auth user (email/password). You can also pass metadata here.
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          full_name: form.value.name,
          phone: normalizedPhone,
          active_role: 'senior',        // useful for guards
          login_pref: normalizedPhone ? 'phone' : 'email'
        }
      }
    })
    if (signUpErr) throw signUpErr

    const user = signUpData?.user
    if (!user) throw new Error('No user returned from sign up.')

    // 2) Upsert into public.Users (1–1 with auth.users)
    // NOTE: requires RLS policy or anon service role privileges.
    const { error: upErr } = await supabase
      .from('Users')
      .upsert({
        user_id: user.id,
        full_name: form.value.name,
        phone: normalizedPhone,
        login_pref: normalizedPhone ? 'phone' : 'email'
      })
    if (upErr) throw upErr

    // 3) Create SeniorCitizens row (lightweight profile). You can add more fields later.
    const { error: scErr } = await supabase
      .from('SeniorCitizens')
      .insert({ user_id: user.id })
    if (scErr) throw scErr

    // 4) 🔹 Call the welcome-announcement RPC here
    const { error: welcomeErr } = await supabase.rpc('seed_welcome_announcement')
    if (welcomeErr) {
      // optional: just log it so signup still succeeds
      console.error('Failed to seed welcome announcement:', welcomeErr)
    }

    // 5) Ensure JWT carries active_role (optional refresh)
    await supabase.auth.updateUser({ data: { active_role: 'senior' } })

    successMsg.value = 'Account created successfully.'
    // Small delay so users can see success state
    setTimeout(() => router.push('/senior/dashboard'), 400)
  } catch (err) {
    // Common causes: RLS blocking inserts into Users/SeniorCitizens.
    errorMsg.value = err?.message || 'Signup failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>