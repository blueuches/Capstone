<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/composables/useAuth'

const { signup, loading } = useAuth()

const STAFF_KEYS = {
  osca_staff: 'OSCA2026k3yc0de',
  barangay_staff: 'BRGY2026k3yc0de'
} as const


const barangays = ref<{ id: string; name: string }[]>([])
const errorMsg = ref('')

const form = ref({
  role: 'osca_staff' as 'osca_staff' | 'barangay_staff',
  key_code: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  contact_no: '',
  birthdate: '',
  gender: '',
  barangay_id: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const needsBarangay = computed(() => form.value.role === 'barangay_staff')
const passwordMismatch = computed(() =>
  !!(form.value.password && form.value.confirmPassword && form.value.password !== form.value.confirmPassword)
)

onMounted(async () => {
  const { data } = await supabase.from('barangays').select('id, name').order('name')
  barangays.value = data ?? []
})

const handleSignup = async () => {
  errorMsg.value = ''

  if (passwordMismatch.value) {
    errorMsg.value = 'Passwords do not match.'
    return
  }

  const expectedKey = STAFF_KEYS[form.value.role]

  if (form.value.key_code.trim() !== expectedKey) {
    errorMsg.value = 'Invalid staff key code. Signup is not allowed.'
    return // 🚫 ABSOLUTE BLOCK
  }

  try {
    await signup({
      role: form.value.role,
      email: form.value.email,
      password: form.value.password,
      first_name: form.value.first_name,
      middle_name: form.value.middle_name || null,
      last_name: form.value.last_name,
      birthdate: form.value.birthdate,
      gender: form.value.gender,
      contact_no: form.value.contact_no || null,
      barangay_id: needsBarangay.value ? form.value.barangay_id : null
    })
  } catch (err: any) {
    errorMsg.value = err.message
  }
}

// ✅ Birthdate picker (same behavior as Senior signup)
const birthInput = ref<HTMLInputElement | null>(null)

const openBirthPicker = () => {
  const el = birthInput.value
  if (!el) return

  // Chrome/Edge support
  ;(el as HTMLInputElement & { showPicker?: () => void }).showPicker?.()

  // fallback
  el.focus()
  el.click()
}

const birthdateDisplay = computed(() => {
  if (!form.value.birthdate) return ''
  const [y, m, d] = form.value.birthdate.split('-')
  if (!y || !m || !d) return form.value.birthdate
  return `${m}/${d}/${y}`
})

</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9f7ec] via-[#f3fbf5] to-white p-6">
    <div class="w-full max-w-xl bg-white rounded-3xl shadow-xl p-8 sm:p-10 relative">

      <!-- Back -->
      <router-link
        to="/"
        class="absolute top-4 left-4 inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 font-semibold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Home
      </router-link>

      <h1 class="text-3xl sm:text-4xl font-extrabold text-[#42ad43] text-center mb-2">
        Sign Up (Staff)
      </h1>
      <p class="text-gray-600 text-center mb-6">
        Create your staff account for OSCA or Barangay access.
      </p>

      <form class="grid grid-cols-1 gap-5" @submit.prevent="handleSignup">
        <!-- Staff Type -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">
            Staff Type
          </label>
          <select
            v-model="form.role"
            required
            class="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl
                   focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700 bg-white"
          >
            <option value="osca_staff">OSCA Staff</option>
            <option value="barangay_staff">Barangay Staff</option>
          </select>
        </div>

        <!-- Barangay (only if barangay staff) -->
        <div v-if="needsBarangay">
          <label class="block text-sm font-semibold text-gray-700 mb-1">
            Barangay
          </label>
          <select
            v-model="form.barangay_id"
            required
            class="input bg-white"
          >
            <option value="">Select Barangay</option>
            <option v-for="b in barangays" :key="b.id" :value="b.id">
              {{ b.name }}
            </option>
          </select>
        </div>

        <!-- Names -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            v-model.trim="form.first_name"
            placeholder="First name"
            required
            class="input"
          />
          <input
            v-model.trim="form.middle_name"
            placeholder="Middle name"
            class="input"
          />
          <input
            v-model.trim="form.last_name"
            placeholder="Last name"
            required
            class="input"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select v-model="form.gender" required class="input bg-white">
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
<!-- ✅ Birthdate (whole field clickable) -->
<div class="relative cursor-pointer" @click="openBirthPicker">
  <!-- display only -->
  <input
    :value="birthdateDisplay"
    placeholder="Birthdate"
    readonly
    class="input pr-12 birthdate-display"
  />

  <!-- real date input (kept for anchoring) -->
  <input
    ref="birthInput"
    v-model="form.birthdate"
    type="date"
    class="date-overlay-anchor"
    aria-label="Birthdate"
    tabindex="-1"
  />

  <!-- chevron icon (visual only) -->
  <span class="birthdate-icon">
    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fill-rule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"
        clip-rule="evenodd"
      />
    </svg>
  </span>
</div>

          <input
            v-model.trim="form.contact_no"
            placeholder="Contact No"
            class="input"
          />
        </div>

        <!-- Staff Key Code -->
<div>
  <label class="block text-sm font-semibold text-gray-700 mb-1">
    Staff Key Code
  </label>
  <input
    v-model.trim="form.key_code"
    type="password"
    required
    placeholder="Enter staff key code"
    class="input"
  />
  <p class="text-xs text-gray-500 mt-1">
    This key is required to register as {{ form.role === 'osca_staff' ? 'OSCA' : 'Barangay' }} staff.
  </p>
</div>


        <!-- Email -->
        <div>
          <input
            v-model.trim="form.email"
            type="email"
            placeholder="Email"
            required
            class="input"
          />
        </div>

        <!-- Passwords -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            class="input"
          />
        </div>

        <p v-if="passwordMismatch" class="text-xs text-red-600">
          Passwords do not match.
        </p>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading || passwordMismatch"
          class="w-full bg-gradient-to-r from-[#42ad43] to-green-500 hover:from-green-500 hover:to-green-600
                 text-white py-3 text-xl rounded-xl font-bold
                 shadow-md transition-all disabled:opacity-60"
        >
          {{ loading ? 'Creating…' : 'Register as Staff' }}
        </button>

        <p v-if="errorMsg" class="text-red-600 text-sm">
          {{ errorMsg }}
        </p>
      </form>

      <p class="mt-6 text-sm text-gray-600">
        Already have an account?
        <router-link to="/signup" class="text-[#42ad43]  font-semibold underline">
          Login here
        </router-link>
      </p>
      <!-- Footer links -->
      <p class="mt-2 text-sm text-gray-600">
        Are you a senior citizen?
        <router-link to="/signup" class="text-[#42ad43]  font-semibold underline">
          Sign up here
        </router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full px-4 py-3 text-lg border border-gray-300 rounded-xl
         focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700;
}

/* display input should not steal clicks */
.birthdate-display {
  @apply pointer-events-none;
}

/* keep the real date input in the same spot (for correct picker anchoring),
   but wrapper click opens it */
.date-overlay-anchor {
  @apply absolute inset-0 w-full h-full opacity-0;
  pointer-events: none;
}

.birthdate-icon {
  @apply pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400;
}

</style>
