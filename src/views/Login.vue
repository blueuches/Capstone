<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9f7ec] via-[#f3fbf5] to-white px-4 py-6"
  >
    <div
      class="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center relative"
    >
      <router-link
        to="/"
        class="absolute top-4 left-4 inline-flex items-center gap-2 text-sm text-[#42ad43] hover:text-emerald-800 font-semibold"
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

      <h1 class="text-4xl font-extrabold text-[#42ad43] text-center mb-2">Login</h1>
      <p class="text-gray-600 text-center mb-8 text-lg">Welcome! Please log in to continue.</p>

      <!-- ✅ Method toggle -->
      <div class="w-full flex gap-2 mb-6">
        <button
          type="button"
          @click="method = 'phone'"
          class="flex-1 py-2 rounded-xl font-semibold border transition"
          :class="method === 'phone'
            ? 'bg-[#42ad43] text-white border-[#42ad43]'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
        >
          Use Phone
        </button>
        <button
          type="button"
          @click="method = 'email'"
          class="flex-1 py-2 rounded-xl font-semibold border transition"
          :class="method === 'email'
            ? 'bg-[#42ad43] text-white border-[#42ad43]'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
        >
          Use Email
        </button>
      </div>

      <form class="w-full flex flex-col gap-6" @submit.prevent="submit">
        <!-- ✅ Email/Phone input -->
        <div class="relative">
          <span class="absolute left-4 top-3 text-[#42ad43]">
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
            v-if="method === 'email'"
            id="email"
            type="email"
            placeholder="Email"
            v-model="email"
            class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
            autocomplete="username"
          />

          <input
            v-else
            id="phone"
            type="tel"
            placeholder="Phone (09xxxxxxxxx)"
            v-model="phone"
            class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
            autocomplete="username"
          />
        </div>

        <!-- Password -->
        <div class="relative">
          <span class="absolute left-4 top-3 text-[#42ad43]">
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

        <!-- ✅ Phone validation -->
        <p v-if="method === 'phone' && phone && !phoneLooksValid" class="text-red-600 text-sm">
          Enter a valid PH number like 09xxxxxxxxx.
        </p>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading || (method === 'phone' && !!phone && !phoneLooksValid)"
          class="w-full bg-gradient-to-r from-[#42ad43] to-green-500 hover:from-green-500 hover:to-green-600 text-white py-3 text-xl rounded-xl font-bold shadow-md transition-all disabled:opacity-60"
        >
          <span v-if="!loading">Login</span>
          <span v-else>Signing in…</span>
        </button>
      </form>

      <p class="mt-6 text-sm text-red-600" v-if="errorMsg">{{ errorMsg }}</p>

      <p class="mt-8 text-lg text-gray-700 text-center">
        Don’t have an account? <br />
        <router-link to="/signup">
          <button class="text-[#42ad43] font-bold underline">Register here</button>
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const method = ref<'phone' | 'email'>('phone')

const email = ref('')
const phone = ref('')
const password = ref('')
const errorMsg = ref('')

const { login, loginWithPhone, loading } = useAuth()

// ✅ same normalizer as signup
const normalizePHPhone = (raw: string) => {
  const s = (raw || '').trim().replace(/\s+/g, '').replace(/-/g, '')
  if (!s) return ''
  if (s.startsWith('+')) return s
  if (/^09\d{9}$/.test(s)) return '+63' + s.slice(1)
  if (/^9\d{9}$/.test(s)) return '+63' + s
  if (/^63\d{10}$/.test(s)) return '+' + s
  return s
}

const normalizedPhone = computed(() => normalizePHPhone(phone.value))
const phoneLooksValid = computed(() => /^\+\d{10,15}$/.test(normalizedPhone.value))

const submit = async () => {
  errorMsg.value = ''
  try {
    if (method.value === 'email') {
      await login(email.value.trim(), password.value)
      return
    }

    if (!phoneLooksValid.value) {
      errorMsg.value = 'Enter a valid PH number like 09xxxxxxxxx.'
      return
    }

    await loginWithPhone(normalizedPhone.value, password.value)
  } catch (err: any) {
    errorMsg.value = err?.message || 'Login failed.'
  }
}
</script>
