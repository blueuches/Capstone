<template>
  <div class="bg-gradient-to-b from-emerald-50 to-white min-h-screen">
    <!-- Header -->
    <header class="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 class="text-xl sm:text-2xl font-bold">Senior Dashboard</h1>

        <div class="flex items-center gap-3">
          <router-link to="/senior/profile">
          <img
            :src="avatarUrl"
            @error="useInlineAvatar"
            class="w-12 h-12 rounded-full border-2 border-white shadow object-cover"
            alt="Profile"
          />
          </router-link>
          <div class="leading-tight">
            <p class="font-semibold">
              Welcome, <span class="text-yellow-200">Junafe Miot Marban</span>
            </p>
            <p class="text-xs sm:text-sm opacity-90">81 years old · P-5 Barangay 6, De Oro</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      <!-- Quick Stats -->
      <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div class="bg-white shadow rounded-xl p-4 flex items-center gap-4">
          <div class="w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full text-xl">📦</div>
          <div>
            <p class="text-xs sm:text-sm text-gray-500">Active Programs</p>
            <p class="text-lg sm:text-xl font-semibold text-emerald-700">3</p>
          </div>
        </div>
        <div class="bg-white shadow rounded-xl p-4 flex items-center gap-4">
          <div class="w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full text-xl">🗓️</div>
          <div>
            <p class="text-xs sm:text-sm text-gray-500">Upcoming Events</p>
            <p class="text-lg sm:text-xl font-semibold text-emerald-700">2</p>
          </div>
        </div>
        <div class="bg-white shadow rounded-xl p-4 flex items-center gap-4">
          <div class="w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full text-xl">✅</div>
          <div>
            <p class="text-xs sm:text-sm text-gray-500">Applications Approved</p>
            <p class="text-lg sm:text-xl font-semibold text-emerald-700">5</p>
          </div>
        </div>
      </section>

      <!-- Available Programs -->
      <section>
        <h2 class="text-lg sm:text-xl font-bold text-emerald-700 mb-4">Available Programs</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div class="bg-white rounded-xl shadow p-5 hover:shadow-lg transition flex flex-col">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full">💰</div>
              <h3 class="font-semibold text-emerald-700">Senior Citizen Benefits</h3>
            </div>
            <p class="text-sm text-gray-600 flex-1">Monthly stipend for indigent senior citizens.</p>
              <router-link to="/senior/form" class="mt-4 w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm">Apply</router-link>
          </div>

          <div class="bg-white rounded-xl shadow p-5 hover:shadow-lg transition flex flex-col">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full">🎉</div>
              <h3 class="font-semibold text-emerald-700">Centenarian Benefits</h3>
            </div>
            <p class="text-sm text-gray-600 flex-1">Recognition and cash gift for those reaching 100 years old.</p>
            <router-link to="/senior/form2" class="mt-4 w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm">Apply</router-link>
          </div>

          <div class="bg-white rounded-xl shadow p-5 hover:shadow-lg transition flex flex-col">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full">🏥</div>
              <h3 class="font-semibold text-emerald-700">Medical Assistance</h3>
            </div>
            <p class="text-sm text-gray-600 flex-1">Support for hospitalization and essential medicines.</p>
            <button class="mt-4 w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm">Apply</button>
          </div>
        </div>
      </section>

      <!-- OSCA Updates Timeline -->
      <section>
        <h2 class="text-lg sm:text-xl font-bold text-emerald-700 mb-4 sm:mb-6">OSCA Updates</h2>
        <div class="relative ml-5 sm:ml-6 space-y-8">
          <!-- vertical line -->
          <div class="absolute left-0 top-1 bottom-0 w-1 bg-emerald-500/80 rounded"></div>

          <div class="ml-6">
            <div class="absolute -left-3 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white">📢</div>
            <h3 class="font-semibold text-emerald-700">Free Health Check-up</h3>
            <time class="block text-xs text-gray-500">Feb 15, 2025</time>
            <p class="text-sm text-gray-600 mt-1">All senior citizens are invited for a free health check-up at the City Hall covered court.</p>
          </div>

          <div class="ml-6">
            <div class="absolute -left-3 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white">💸</div>
            <h3 class="font-semibold text-emerald-700">Pension Distribution</h3>
            <time class="block text-xs text-gray-500">Mar 1, 2025</time>
            <p class="text-sm text-gray-600 mt-1">Qualified seniors may claim their pension at the OSCA office starting 9:00 AM.</p>
          </div>

          <div class="ml-6">
            <div class="absolute -left-3 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white">🤝</div>
            <h3 class="font-semibold text-emerald-700">OSCA General Assembly</h3>
            <time class="block text-xs text-gray-500">Apr 10, 2025</time>
            <p class="text-sm text-gray-600 mt-1">Assembly for all registered seniors to discuss upcoming benefits and activities.</p>
          </div>
        </div>
      </section>

      <!-- My Applications -->
      <section>
        <h2 class="text-lg sm:text-xl font-bold text-emerald-700 mb-4">My Applications</h2>

        <!-- Scrollable table on small screens -->
        <div class="bg-white shadow rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm text-left">
              <thead class="bg-emerald-100 text-emerald-700">
                <tr>
                  <th class="px-4 py-2">Program</th>
                  <th class="px-4 py-2">Date Applied</th>
                  <th class="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b last:border-0">
                  <td class="px-4 py-2">Social Pension</td>
                  <td class="px-4 py-2">Jan 5, 2025</td>
                  <td class="px-4 py-2"><span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Pending</span></td>
                </tr>
                <tr class="border-b last:border-0">
                  <td class="px-4 py-2">Medical Assistance</td>
                  <td class="px-4 py-2">Dec 20, 2024</td>
                  <td class="px-4 py-2"><span class="bg-green-100 text-green-700 px-2 py-1 rounded">Approved</span></td>
                </tr>
                <tr>
                  <td class="px-4 py-2">Centenarian Gift</td>
                  <td class="px-4 py-2">Nov 10, 2024</td>
                  <td class="px-4 py-2"><span class="bg-red-100 text-red-700 px-2 py-1 rounded">Declined</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mobile-friendly cards (shown below md for readability) -->
        <div class="md:hidden mt-4 space-y-3">
          <div class="bg-white rounded-xl shadow p-4">
            <div class="flex items-center justify-between">
              <p class="font-semibold text-emerald-700">Social Pension</p>
              <span class="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs">Pending</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">Applied: Jan 5, 2025</p>
          </div>
          <div class="bg-white rounded-xl shadow p-4">
            <div class="flex items-center justify-between">
              <p class="font-semibold text-emerald-700">Medical Assistance</p>
              <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">Approved</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">Applied: Dec 20, 2024</p>
          </div>
          <div class="bg-white rounded-xl shadow p-4">
            <div class="flex items-center justify-between">
              <p class="font-semibold text-emerald-700">Centenarian Gift</p>
              <span class="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">Declined</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">Applied: Nov 10, 2024</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

/* Simple, safe avatar with inline fallback (no network dependency) */
const avatarUrl = ref('https://via.placeholder.com/60')
function useInlineAvatar() {
  avatarUrl.value =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
      <rect width="100%" height="100%" fill="#ecfdf5"/>
      <circle cx="30" cy="22" r="12" fill="#10b981" fill-opacity="0.5"/>
      <rect x="14" y="38" width="32" height="14" rx="7" fill="#10b981" fill-opacity="0.35"/>
    </svg>`)
}
</script>

<style scoped>
/* Tiny polish so timeline line stays aligned on very narrow screens */
@media (max-width: 360px) {
  .ml-5 { margin-left: 1rem !important; }
}
</style>
