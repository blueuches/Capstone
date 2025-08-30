<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-white p-6"
  >
    <div
      class="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center relative"
    >
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
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Dashboard
      </router-link>

      <!-- Header -->
      <h1 class="text-4xl font-extrabold text-emerald-700 text-center mb-2">Senior Signup</h1>
      <p class="text-gray-600 text-center mb-8 text-lg">Create your account to get started.</p>

      <!-- Form -->
      <form class="w-full flex flex-col gap-6" @submit="handleSignup">
        <!-- Fullname -->
        <div class="relative">
          <span class="absolute left-4 top-3 text-emerald-500">
            <!-- Heroicon: User -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196zM12 12a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
          </span>
          <input
            id="name"
            type="text"
            placeholder="Name"
            v-model="name"
            class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
          />
        </div>

        <!-- Phone -->
        <div class="relative">
          <span class="absolute left-4 top-3 text-emerald-500">
            <!-- Heroicon: Phone -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.684l1.518 4.553a1 1 0 01-.502 1.21l-2.26 1.13a11.042 11.042 0 005.516 5.516l1.13-2.26a1 1 0 011.21-.502l4.553 1.518a1 1 0 01.684.95V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </span>
          <input
            id="email"
            type="text"
            placeholder="Email"
            v-model="email"
            class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
          />
        </div>

        <!-- Password -->
        <div class="relative">
          <span class="absolute left-4 top-3 text-emerald-500">
            <!-- Heroicon: Lock Closed -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 11c1.104 0 2 .896 2 2v1h-4v-1c0-1.104.896-2 2-2zM6 10V8a6 6 0 1112 0v2h1a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1h1z"
              />
            </svg>
          </span>
          <input
            id="password"
            type="password"
            placeholder="Password"
            v-model="password"
            class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
          />
        </div>

        <!-- Confirm Password -->
        <div class="relative">
          <span class="absolute left-4 top-3 text-emerald-500">
            <!-- Heroicon: Check Circle -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            v-model="confirmPassword"
            class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
          />
        </div>

        <!-- Signup Button -->
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 text-xl rounded-xl font-bold shadow-md transition-all"
        >
          Register
        </button>
      </form>

      <!-- Back to login -->
      <p class="mt-8 text-lg text-gray-700 text-center">
        Already have an account? <br />
        <router-link to="/senior/login">
          <p class="text-emerald-700 font-bold underline">Login here</p>
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { supabase } from '../../supabase/client'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const UNKNOWN_BARANGAY_ID = '40c73788-5927-49e0-868a-5c38f3a40874'

// Form fields
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const phone = ref('')

// Handle Signup
const handleSignup = async (e) => {
  e.preventDefault()

  const role = 'senior' // fixed role here (or use localStorage if dynamic)

  if (password.value !== confirmPassword.value) {
    alert("Passwords don't match!")
    return
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })

  if (error) {
    alert('Signup failed: ' + error.message)
    return
  }

  const user = data.user

  // Insert to SeniorCitizens table
  const { error: insertError } = await supabase.from('SeniorCitizens').insert({
    auth_id: user.id,
    name: name.value,
    email: email.value,
    password: password.value,
    barangay_id: UNKNOWN_BARANGAY_ID,
  })

  if (insertError) {
    alert('Signup error: ' + insertError.message)
    return
  }

  alert('Signup successful! Redirecting...')
  router.push('/senior/dashboard')
}
</script>
