<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-white px-4 py-6"
  >
    <div
      class="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center relative"
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
        Back to Home
      </router-link>

      <h1 class="text-4xl font-extrabold text-emerald-700 text-center mb-2">Login</h1>
      <p class="text-gray-600 text-center mb-8 text-lg">Welcome! Please log in to continue.</p>

      <form class="w-full flex flex-col gap-6">
        <div class="relative">
          <span class="absolute left-4 top-3 text-emerald-500">
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
            id="email"
            type="email"
            placeholder="Email"
            v-model="email"
            class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
            autocomplete="username"
          />
        </div>

        <div class="relative">
          <span class="absolute left-4 top-3 text-emerald-500">
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
            autocomplete="current-password"
          />
        </div>

        <button
          @click="submit"
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 text-xl rounded-xl font-bold shadow-md transition-all disabled:opacity-60"
        >
          <span v-if="!loading">Login</span>
          <span v-else>Signing in…</span>
        </button>
      </form>

      <p class="mt-6 text-sm text-red-600" v-if="errorMsg">{{ errorMsg }}</p>

      <p class="mt-8 text-lg text-gray-700 text-center">
        Don’t have an account? <br />
        <router-link to="/signup">
          <button class="text-emerald-700 font-bold underline">Register here</button>
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const { login, loading } = useAuth()

const submit = async () => {
  errorMsg.value = ''
  try {
    await login(email.value, password.value)
  } catch (err: any) {
    errorMsg.value = err.message
  }
}
</script>
