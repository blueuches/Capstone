<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
const router = useRouter()

const { signup, loading } = useAuth()

const barangays = ref<{ id: string; name: string }[]>([])
const errorMsg = ref('')
const successMsg = ref('')

// NEW: method toggle
const method = ref<'phone' | 'email'>('phone')

// TEMP convenience (NOT secure, just for your manual encoding phase)
const HARDCODED_PASSCODE = 'TEMP-30' // must match TEMP_SIGNUP_PASSCODE secret

const form = ref({
  first_name: '',
  middle_name: '',
  last_name: '',
  birthdate: '',
  gender: '',
  contact_no: '',
  barangay_id: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const passwordMismatch = computed(() =>
  !!(form.value.password && form.value.confirmPassword && form.value.password !== form.value.confirmPassword)
)

/**
 * ✅ Allow PH inputs like:
 *  - 09xxxxxxxxx
 *  - 9xxxxxxxxx
 *  - +639xxxxxxxxx
 *  - 63xxxxxxxxxx
 * and normalize them to E.164: +63xxxxxxxxxx
 */
const normalizePHPhone = (raw: string) => {
  const s = (raw || '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/-/g, '')

  if (!s) return ''

  // already E.164
  if (s.startsWith('+')) return s

  // 09xxxxxxxxx (11 digits)
  if (/^09\d{9}$/.test(s)) return '+63' + s.slice(1)

  // 9xxxxxxxxx (10 digits) - missing leading 0
  if (/^9\d{9}$/.test(s)) return '+63' + s

  // 63xxxxxxxxxx (no plus)
  if (/^63\d{10}$/.test(s)) return '+' + s

  // fallback: return as-is (will fail validation)
  return s
}

const normalizedPhone = computed(() => normalizePHPhone(form.value.contact_no))
const phoneLooksValid = computed(() => /^\+\d{10,15}$/.test(normalizedPhone.value))

onMounted(async () => {
  const { data } = await supabase.from('barangays').select('id, name').order('name')
  barangays.value = data ?? []
})

const resetForm = () => {
  form.value.first_name = ''
  form.value.middle_name = ''
  form.value.last_name = ''
  form.value.birthdate = ''
  form.value.gender = ''
  form.value.contact_no = ''
  form.value.barangay_id = ''
  form.value.email = ''
  form.value.password = ''
  form.value.confirmPassword = ''
}

const handleSignup = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  if (passwordMismatch.value) {
    errorMsg.value = 'Passwords do not match.'
    return
  }

  if (method.value === 'phone') {
    if (!phoneLooksValid.value) {
      errorMsg.value = 'Enter a valid PH mobile number like 09xxxxxxxxx (we will convert it automatically).'
      return
    }
  } else {
    // email mode validation
    if (!form.value.email.trim()) {
      errorMsg.value = 'Email is required.'
      return
    }
  }

  try {
    if (method.value === 'email') {
      // ✅ existing email signup flow
      await signup({
        role: 'senior',
        email: form.value.email.trim(),
        password: form.value.password,
        first_name: form.value.first_name,
        middle_name: form.value.middle_name || null,
        last_name: form.value.last_name,
        birthdate: form.value.birthdate,
        gender: form.value.gender,
        contact_no: form.value.contact_no,
        barangay_id: form.value.barangay_id
      })
      return
    }

    // ✅ Use normalized E.164 for auth + database
    const phoneE164 = normalizedPhone.value

    // ✅ PHONE signup (temporary): create via Edge Function (Admin API)
    const { data, error } = await supabase.functions.invoke('temp-phone-signup', {
      body: {
        phone: phoneE164,
        password: form.value.password,
        profile: {
          first_name: form.value.first_name,
          middle_name: form.value.middle_name || null,
          last_name: form.value.last_name,
          birthdate: form.value.birthdate,
          gender: form.value.gender,
          contact_no: phoneE164, // ✅ store normalized
          barangay_id: form.value.barangay_id
        },
        passcode: HARDCODED_PASSCODE
      }
    })

    if (error) throw error
    if (!data?.ok) throw new Error(data?.error || 'Phone signup failed.')

    // ✅ Auto-login with phone+password (using normalized phone)
    const { error: loginErr } = await supabase.auth.signInWithPassword({
      phone: phoneE164,
      password: form.value.password
    })
    if (loginErr) throw loginErr

    successMsg.value = 'Account created! Logging you in…'
    resetForm()

    await router.push('/senior/dashboard')
  } catch (err: any) {
    errorMsg.value = err?.message || 'Something went wrong.'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9f7ec] via-[#f3fbf5] to-white px-4 py-6">
    <div class="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center relative">
      <!-- Back -->
      <router-link
        to="/"
        class="absolute top-4 left-4 inline-flex items-center gap-2 text-sm text-[#42ad43] hover:text-emerald-800 font-semibold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </router-link>

      <h1 class="text-4xl font-extrabold text-[#42ad43] mb-2">Signup</h1>
      <p class="text-gray-600 mb-8 text-lg text-center">Create your account to continue.</p>

      <form class="w-full grid grid-cols-1 md:grid-cols-3 gap-5" @submit.prevent="handleSignup">
        <!-- ✅ Signup method toggle -->
        <div class="md:col-span-3 flex gap-2">
          <button
            type="button"
            @click="method = 'phone'"
            class="flex-1 py-2 rounded-xl font-semibold border transition"
            :class="method === 'phone' ? 'bg-[#42ad43] text-white border-[#42ad43]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
          >
            Use Phone
          </button>
          <button
            type="button"
            @click="method = 'email'"
            class="flex-1 py-2 rounded-xl font-semibold border transition"
            :class="method === 'email' ? 'bg-[#42ad43] text-white border-[#42ad43]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
          >
            Use Email
          </button>
        </div>

        <!-- Names -->
        <input v-model.trim="form.first_name" placeholder="First name" required class="input" />
        <input v-model.trim="form.middle_name" placeholder="Middle name (optional)" class="input" />
        <input v-model.trim="form.last_name" placeholder="Last name" required class="input" />

        <!-- Gender / Birthdate -->
        <select v-model="form.gender" required class="input bg-white">
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input v-model="form.birthdate" type="date" required class="input md:col-span-2" />

        <!-- Contact / Barangay -->
        <input
          v-model.trim="form.contact_no"
          placeholder="Contact number (09xxxxxxxxx)"
          required
          class="input"
        />

        <select v-model="form.barangay_id" required class="input bg-white md:col-span-2">
          <option value="">Select Barangay</option>
          <option v-for="b in barangays" :key="b.id" :value="b.id">
            {{ b.name }}
          </option>
        </select>

        <!-- ✅ Email (only if email mode) -->
        <input
          v-if="method === 'email'"
          v-model.trim="form.email"
          type="email"
          placeholder="Email"
          required
          class="input md:col-span-3"
        />
        
        <!-- Passwords -->
        <input
          v-model="form.password"
          type="password"
          placeholder="Password (min 8 chars)"
          minlength="8"
          required
          class="input"
        />
        <input
          v-model="form.confirmPassword"
          type="password"
          placeholder="Confirm password"
          required
          class="input md:col-span-2"
        />

        <p v-if="passwordMismatch" class="text-red-600 text-sm md:col-span-3">Passwords do not match.</p>

        <p
          v-if="method === 'phone' && form.contact_no && !phoneLooksValid"
          class="text-red-600 text-sm md:col-span-3"
        >
          Enter a valid PH number like 09xxxxxxxxx.
        </p>

        <!-- (Optional) helpful hint when valid -->
        <p
          v-if="method === 'phone' && phoneLooksValid"
          class="text-gray-500 text-xs md:col-span-3"
        >
          Will be saved as: <span class="font-semibold">{{ normalizedPhone }}</span>
        </p>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading || passwordMismatch"
          class="md:col-span-3 w-full bg-gradient-to-r from-[#42ad43] to-green-500 hover:from-green-500 hover:to-green-600 text-white py-3 text-xl rounded-xl font-bold shadow-md transition-all disabled:opacity-60"
        >
          {{ loading ? 'Creating…' : 'Register' }}
        </button>

        <p v-if="errorMsg" class="text-red-600 text-sm md:col-span-3">{{ errorMsg }}</p>
        <p v-if="successMsg" class="text-emerald-700 text-sm md:col-span-3">{{ successMsg }}</p>
      </form>

      <p class="mt-6 text-sm text-gray-600">
        Already have an account?
        <router-link to="/login" class="text-[#42ad43] font-bold underline">Login here</router-link>
      </p>

      <p class="mt-2 text-sm text-gray-600">
        OSCA or Brgy Staff?
        <router-link to="/signup-staff" class="text-[#42ad43] font-bold underline">Signup here</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full px-4 py-3 text-lg border border-gray-300 rounded-xl
         focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700;
}
</style>
