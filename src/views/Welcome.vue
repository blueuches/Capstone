<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-green-100 to-white"
  >

  <header class="p-5 flex items-center justify-between bg-white shadow-md">
    <h1 class="text-2xl md:text-3xl font-extrabold text-emerald-700">🌿 SeniorGo</h1>
    <span class="text-sm text-gray-600 hidden sm:block">Empowering Seniors & Communities</span>
  </header>

  <section class="flex flex-col items-center text-center px-6 py-12 md:py-16 fade-in">
    <h2 class="text-3xl md:text-4xl font-extrabold text-emerald-800 mb-4">Welcome to SeniorGo</h2>
    <p class="text-gray-600 max-w-2xl mb-10">
      A one-stop system for seniors, barangay personnel, and OSCA staff.  
      Please choose your role to access tailored tools and services.
    </p>
  </section>

  <main class="flex-1 flex items-center justify-center px-6">
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full">

      <!-- Senior Citizen -->
      <div class="bg-white rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 p-8 flex flex-col items-center text-center">
        <div class="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M5.121 17.804A9 9 0 1118.364 4.56M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-emerald-700 mb-2">Senior Citizen</h3>
        <p class="text-sm text-gray-600 mb-6">Access your benefits, check program updates, and manage your OSCA ID.</p>
        
        <router-link to="/senior/login">
          <button 
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-lg font-semibold shadow-md">
            Login as Senior
          </button>
        </router-link>
      
      </div>

      <!-- Barangay Personnel -->
      <div class="bg-white rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 p-8 flex flex-col items-center text-center">
        <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M3 7h18M3 12h18M3 17h18M6 7v10M18 7v10M9 7v10M15 7v10" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-blue-700 mb-2">Barangay Personnel</h3>
        <p class="text-sm text-gray-600 mb-6">Manage senior records, validate applications, and submit to OSCA.</p>
        
        <router-link to="/barangay/login">
          <button 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold shadow-md">
          Login as Barangay
          </button>
        </router-link>
      </div>

      <!-- OSCA Personnel -->
      <div class="bg-white rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 p-8 flex flex-col items-center text-center">
        <div class="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M12 3v18m9-9H3" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-purple-700 mb-2">OSCA Personnel</h3>
        <p class="text-sm text-gray-600 mb-6">Oversee senior programs, approve barangay submissions, and monitor services.</p>
        
        <router-link to="/osca/login">
          <button 
            class="w-full bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg font-semibold shadow-md">
          Login as OSCA
          </button>
        </router-link>
        
      </div>

    </div>
  </main>

  <!-- Call to action -->
  <div class="text-center mt-12 mb-8">
    <p class="text-gray-600">👉 Choose your role above to get started.</p>
  </div>

  <!-- Footer -->
  <footer class="bg-white border-t p-4 text-center text-xs text-gray-500">
    © 2025 SeniorGo • All rights reserved
  </footer>
  </div>
</template>

<style>
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-in { animation: fadeInUp 1s ease-in-out; }
</style>
