<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
     <!-- Sidebar -->
<aside
  class="fixed inset-y-0 left-0 bg-white/95 backdrop-blur shadow-lg flex flex-col justify-between py-6 z-50 transform transition-transform duration-300 w-64 md:relative md:translate-x-0 md:w-64"
  :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
>
  <div>
    <div class="px-4 flex items-center gap-2 mb-6">
      <h4 class="font-extrabold tracking-tight text-emerald-700">SeniorGo</h4>
    </div>

    <nav class="flex flex-col gap-2 w-full items-start px-2" id="nav">
      <!-- Dashboard -->
      <RouterLink
        to="/osca/dashboard"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/osca/dashboard')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Home / Dashboard Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-6v-6H10v6H4a1 1 0 0 1-1-1V9.5z" />
          </svg>
        </span>
        <span class="font-bold text-base">Dashboard</span>
      </RouterLink>

      <!-- View Barangays -->
      <RouterLink
        to="/osca/barangays"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/osca/barangays')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Map / Barangay Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6zM9 7.74v10.52l4 1.33V9.07L9 7.74z" />
          </svg>
        </span>
        <span class="font-bold text-base">View Barangays</span>
      </RouterLink>

      <!-- Review Seniors -->
      <RouterLink
        to="/osca/review"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/osca/review')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Checklist / Review Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 11.5L7.5 10l-1 1 2.5 2.5L17 6.5l-1-1L9 11.5zM4 4h16v2H4V4zm0 4h10v2H4V8zm0 4h6v2H4v-2zm0 4h8v2H4v-2z" />
          </svg>
        </span>
        <span class="font-bold text-base">Review Seniors</span>
      </RouterLink>

      <!-- Applicants -->
      <RouterLink
        to="/osca/applications"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/osca/applications')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Users Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5S5 6.34 5 8s1.34 3 3 3zm8 2c-1.5 0-4.5.75-4.5 2.25V18h9v-2.75C20.5 13.75 17.5 13 16 13zm-8 0c-1.5 0-4.5.75-4.5 2.25V18h9v-2.75C12.5 13.75 9.5 13 8 13z" />
          </svg>
        </span>
        <span class="font-bold text-base">Applicants</span>
      </RouterLink>

      <!-- Post Announcement -->
      <RouterLink
        to="/osca/messaging"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/osca/messaging')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Megaphone / Announcement Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 14V6h2v8H2zm4 2V4l12 5v2l-12 5zm14-3a1 1 0 1 1 0-2a1 1 0 0 1 0 2z" />
          </svg>
        </span>
        <span class="font-bold text-base">Post Announcement</span>
      </RouterLink>

      <!-- Logout -->
      <RouterLink
        to="/logout"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/logout')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Logout Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 13v-2H7V8l-5 4l5 4v-3h9zM20 3H10a1 1 0 0 0-1 1v4h2V5h8v14h-8v-3H9v4a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z" />
          </svg>
        </span>
        <span class="font-bold text-base">Logout</span>
      </RouterLink>
    </nav>
  </div>

  <div class="px-4 text-xs text-gray-500 text-center leading-snug">
    © 2025 <span class="font-semibold text-emerald-700">SeniorGo</span><br />
    Made for Butuan Seniors<br />
    Powered by Barangay &amp; OSCA
  </div>
</aside>

  <!-- Main Content -->
  <main class="flex-1 p-6 md:ml-60">
    
    <!-- Header -->
    <div class="bg-white rounded-3xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
      <h1 class="text-3xl font-extrabold text-emerald-700">OSCA Dashboard</h1>
      <p class="text-gray-600 mt-2 md:mt-0">Welcome, OSCA Personnel</p>
    </div>

    <!-- Stats Section -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="bg-white rounded-xl shadow p-6 text-center hover:shadow-md transition">
        <h2 class="text-emerald-700 text-2xl font-bold">100</h2>
        <p class="text-gray-600 mt-1">Applications Submitted</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6 text-center hover:shadow-md transition">
        <h2 class="text-emerald-700 text-2xl font-bold">40</h2>
        <p class="text-gray-600 mt-1">Registered by Barangay</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6 text-center hover:shadow-md transition">
        <h2 class="text-emerald-700 text-2xl font-bold">25</h2>
        <p class="text-gray-600 mt-1">Pending Validation</p>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="bg-white rounded-3xl shadow p-6">
      <h2 class="text-2xl font-bold text-emerald-700 mb-6">Events & Updates Timeline</h2>

      <div class="space-y-6 border-l-4 border-emerald-400 pl-6">
        
        <!-- Update 1 -->
        <div>
          <h3 class="font-bold text-lg text-emerald-700">Applications Forwarded</h3>
          <p class="text-gray-700">All submitted applications from your barangay have been forwarded to OSCA for review.</p>
          <p class="text-sm text-gray-500 mt-1">Today • 10:30 AM</p>
        </div>

        <!-- Update 2 -->
        <div>
          <h3 class="font-bold text-lg text-emerald-700">Validation Status</h3>
          <p class="text-gray-700">OSCA has validated 8 out of 12 applications. The rest are pending requirements.</p>
          <p class="text-sm text-gray-500 mt-1">Yesterday • 3:15 PM</p>
        </div>

        <!-- Update 3 -->
        <div>
          <h3 class="font-bold text-lg text-emerald-700">System Maintenance</h3>
          <p class="text-gray-700">The SeniorGo system will undergo scheduled maintenance on March 10 at 9:00 AM.</p>
          <p class="text-sm text-gray-500 mt-1">2 days ago • 8:00 AM</p>
        </div>

      </div>
    </section>

  </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const sidebarOpen = ref(false)
const route = useRoute()

// Active nav helper (adds bg + bold + indicator bar)
const navActive = (path) => {
  const isActive = route.path === path
  return isActive
    ? 'bg-emerald-50 text-emerald-900 font-extrabold relative before:content-[\'\'] before:absolute before:-left-1 before:h-6 before:w-1 before:rounded-full before:bg-emerald-500'
    : ''
}
</script>
