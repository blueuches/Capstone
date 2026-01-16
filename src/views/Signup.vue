<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/composables/useAuth'

const { signup, loading } = useAuth()

const barangays = ref<{ id: string; name: string }[]>([])
const errorMsg = ref('')

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

  try {
    await signup({
      role: 'senior',
      email: form.value.email,
      password: form.value.password,
      first_name: form.value.first_name,
      middle_name: form.value.middle_name || null,
      last_name: form.value.last_name,
      birthdate: form.value.birthdate,
      gender: form.value.gender,
      contact_no: form.value.contact_no,
      barangay_id: form.value.barangay_id
    })
    // no router.push here; useAuth.signup redirects already
  } catch (err: any) {
    errorMsg.value = err.message
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-white px-4 py-6"
  >
    <div
      class="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center relative"
    >
      <!-- Back -->
      <router-link
        to="/"
        class="absolute top-4 left-4 inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 font-semibold"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </router-link>

      <h1 class="text-4xl font-extrabold text-emerald-700 mb-2">
        Signup
      </h1>
      <p class="text-gray-600 mb-8 text-lg text-center">
        Create your account to continue.
      </p>

      <form
        class="w-full grid grid-cols-1 md:grid-cols-3 gap-5"
        @submit.prevent="handleSignup"
      >
        <!-- Names -->
        <input
          v-model.trim="form.first_name"
          placeholder="First name"
          required
          class="input"
        />
        <input
          v-model.trim="form.middle_name"
          placeholder="Middle name (optional)"
          class="input"
        />
        <input
          v-model.trim="form.last_name"
          placeholder="Last name"
          required
          class="input"
        />

        <!-- Gender / Birthdate -->
        <select v-model="form.gender" required class="input bg-white">
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          v-model="form.birthdate"
          type="date"
          required
          class="input md:col-span-2"
        />

        <!-- Contact / Barangay -->
        <input
          v-model.trim="form.contact_no"
          placeholder="Contact number"
          required
          class="input"
        />

        <select
          v-model="form.barangay_id"
          required
          class="input bg-white md:col-span-2"
        >
          <option value="">Select Barangay</option>
          <option v-for="b in barangays" :key="b.id" :value="b.id">
            {{ b.name }}
          </option>
        </select>

        <!-- Email -->
        <input
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

        <p v-if="passwordMismatch" class="text-red-600 text-sm md:col-span-3">
          Passwords do not match.
        </p>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading || passwordMismatch"
          class="md:col-span-3 w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 text-xl rounded-xl font-bold shadow-md transition-all disabled:opacity-60"
        >
          {{ loading ? 'Creating…' : 'Register' }}
        </button>

        <p v-if="errorMsg" class="text-red-600 text-sm md:col-span-3">
          {{ errorMsg }}
        </p>
      </form>

      <p class="mt-6 text-sm text-gray-600">
        Already have an account?
        <router-link to="/signup-staff" class="text-emerald-700 font-bold underline">
          Login here
        </router-link>
      </p>

      <p class="mt-2 text-sm text-gray-600">
        OSCA or Brgy Staff?
        <router-link to="/signup-staff" class="text-emerald-700 font-bold underline">
          Signup here
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
</style>

