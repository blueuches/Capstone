<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-white p-6">

  <div class="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center">
    
    <!-- Header -->
    <h1 class="text-4xl font-extrabold text-emerald-700 text-center mb-2">
      OSCA Signup
    </h1>
    <p class="text-gray-600 text-center mb-8 text-lg">
      Create your account to get started.
    </p>

    <!-- Form -->
    <form class="w-full flex flex-col gap-6" onsubmit="return signup(event)">
      <!-- Username -->
      <div class="relative">
        <span class="absolute left-4 top-3 text-emerald-500">
          <!-- Heroicon: User -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196zM12 12a4 4 0 100-8 4 4 0 000 8z"/>
          </svg>
        </span>
        <input
          id="username"
          type="text"
          placeholder="Username"
          class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
        />
      </div>

      <!-- Phone -->
      <div class="relative">
        <span class="absolute left-4 top-3 text-emerald-500">
          <!-- Heroicon: Phone -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.684l1.518 4.553a1 1 0 01-.502 1.21l-2.26 1.13a11.042 11.042 0 005.516 5.516l1.13-2.26a1 1 0 011.21-.502l4.553 1.518a1 1 0 01.684.95V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
        </span>
        <input
          id="phone"
          type="text"
          placeholder="Phone Number"
          class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
        />
      </div>

      <!-- Password -->
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
          class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
        />
      </div>

      <!-- Confirm Password -->
      <div class="relative">
        <span class="absolute left-4 top-3 text-emerald-500">
          <!-- Heroicon: Check Circle -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </span>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
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
        <router-link to="/osca/login">
          <p class="text-emerald-700 font-bold underline">Login here</p> 
        </router-link>
    </p>
  </div>
  </div>
</template>