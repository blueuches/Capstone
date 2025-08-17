<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-white p-6">



  <div class="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center">
    
    <!-- Header -->
    <h1 class="text-4xl font-extrabold text-emerald-700 text-center mb-2">
      Senior Login
    </h1>
    <p class="text-gray-600 text-center mb-8 text-lg">
      Welcome! Please sign in to continue.
    </p>

    <!-- Form -->
    <form class="w-full flex flex-col gap-6" @submit="handleLogin">
      <!-- Phonenumber Input -->
      <div class="relative">
        <span class="absolute left-4 top-3 text-emerald-500">
          <!-- Heroicon: User -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196zM12 12a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
        </span>
        <input
          id="phone"
          type="text"
          placeholder="Phone"
          v-model="phone"
          class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
        />
      </div>

      <!-- Password Input -->
      <div class="relative">
        <span class="absolute left-4 top-3 text-emerald-500">
          <!-- Heroicon: Lock Closed -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M12 11c1.104 0 2 .896 2 2v1h-4v-1c0-1.104.896-2 2-2zM6 10V8a6 6 0 1112 0v2h1a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1h1z"/>
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

      <!-- Login Button -->
      <button
        type="submit"
        class="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 text-xl rounded-xl font-bold shadow-md transition-all"
      >
        Login
      </button>
    </form>

    <!-- Register link -->
    <p class="mt-8 text-lg text-gray-700 text-center">
      Don’t have an account? <br />

        <router-link to="/senior/signup">
          <button 
            class="text-emerald-700 font-bold underline">
          Register here
          </button>
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

const email = ref('')
const password = ref('')

// Handle Login
const handleLogin = async (e) => {
  e.preventDefault()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    alert('Login failed: ' + error.message)
    return
  }

  const user = data.user

  const { data: profile, error: profileError } = await supabase
    .from('SeniorCitizens')
    .select('*')
    .eq('auth_id', user.id)
    .single()

  if (profileError) {
    alert('Profile not found: ' + profileError.message)
    return
  }

  alert('Welcome back, ' + profile.name + '!')
  router.push('/senior/dashboard')
}
</script>
