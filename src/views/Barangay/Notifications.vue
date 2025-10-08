<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <!-- Sidebar -->
<aside
  class="fixed inset-y-0 left-0 bg-white/95 backdrop-blur shadow-lg flex flex-col justify-between py-6 z-50 transform transition-transform duration-300 w-64 md:relative md:translate-x-0 md:w-64"
  :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
>
  <div>
    <!-- Logo / Header -->
    <div class="px-4 flex items-center gap-2 mb-6">
      <h4 class="font-extrabold tracking-tight text-emerald-700">SeniorGo</h4>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-2 w-full items-start px-2" id="nav">

      <!-- Dashboard -->
      <RouterLink
        to="/barangay/dashboard"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/barangay/dashboard')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Home Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-6v-6H10v6H4a1 1 0 0 1-1-1V9.5z" />
          </svg>
        </span>
        <span class="font-bold text-base">Dashboard</span>
      </RouterLink>

      <!-- View Seniors -->
      <RouterLink
        to="/barangay/senior-queue"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/barangay/senior-queue')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- People Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3s1.34 3 3 3zM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5S5 6.34 5 8s1.34 3 3 3zm8 2c-1.5 0-4.5.75-4.5 2.25V18h9v-2.75C20.5 13.75 17.5 13 16 13zM8 13c-1.5 0-4.5.75-4.5 2.25V18h9v-2.75C12.5 13.75 9.5 13 8 13z"/>
          </svg>
        </span>
        <span class="font-bold text-base">View Seniors</span>
      </RouterLink>

      <!-- Post Announcement -->
      <RouterLink
        to="/barangay/messaging"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/barangay/messaging')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Megaphone Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 14V6h2v8H2zm4 2V4l12 5v2l-12 5zm14-3a1 1 0 1 1 0-2a1 1 0 0 1 0 2z" />
          </svg>
        </span>
        <span class="font-bold text-base">Post Announcement</span>
      </RouterLink>

      <!-- Notifications -->
      <RouterLink
        to="/barangay/notifications"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/barangay/notifications')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Bell Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22a2 2 0 0 0 1.985-1.75H10.015A2 2 0 0 0 12 22zm6-6v-5a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </span>
        <span class="font-bold text-base">Notifications</span>
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

  <!-- Footer -->
  <div class="px-4 text-xs text-gray-500 text-center leading-snug">
    © 2025 <span class="font-semibold text-emerald-700">SeniorGo</span><br />
    Made for Butuan Seniors<br />
    Powered by Barangay &amp; OSCA
  </div>
</aside>


    <!-- Main Content -->
    <main class="flex-1 flex flex-col items-center px-6 py-10">
      <!-- Header -->
      <div class="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-6 mb-6 text-center">
        <h1 class="text-3xl font-extrabold text-emerald-700">Barangay Notifications</h1>
        <p class="text-gray-600 mt-2 text-lg">Updates from OSCA and the system</p>
      </div>

      <!-- Notification List -->
      <div class="w-full max-w-2xl flex flex-col gap-4">
        <div
          v-for="(n, i) in notifications"
          :key="i"
          class="flex items-start gap-4 bg-white rounded-xl shadow p-5 hover:shadow-md hover:bg-emerald-50 transition duration-200"
        >
          <div class="text-emerald-600">
            <svg v-if="n.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else-if="n.type === 'pending'" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>

          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h2 class="font-bold text-xl text-emerald-700">{{ n.title }}</h2>
              <span class="px-3 py-1 text-sm font-semibold rounded-full" :class="badgeClass(n.type)">
                {{ capitalize(n.type) }}
              </span>
            </div>
            <p class="text-gray-700 mt-2">{{ n.message }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ n.time }}</p>
          </div>
        </div>
      </div>

      <!-- Back -->
      <div class="mt-10">
        <RouterLink to="/barangay/dashboard">
          <p class="text-emerald-700 font-bold underline text-lg">← Back to Dashboard</p>
        </RouterLink>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

defineOptions({ name: 'BarangayNotifications' })

// Demo notifications (replace later with Supabase or API data)
const notifications = ref([
  {
    title: 'Applications Sent to OSCA',
    message: 'All applications submitted by your barangay have been forwarded to OSCA for review.',
    time: '1 hour ago',
    type: 'success'
  },
  {
    title: 'OSCA Validation Update',
    message: 'OSCA has validated 8 out of 12 applications from your barangay. Check the list for details.',
    time: 'Today',
    type: 'pending'
  },
  {
    title: 'System Maintenance',
    message: 'The SeniorGo portal will undergo maintenance tomorrow at 9:00 AM. Access may be temporarily unavailable.',
    time: 'Yesterday',
    type: 'alert'
  }
])

const badgeMap = {
  success: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  alert: 'bg-red-100 text-red-700'
}
const badgeClass = (type) => badgeMap[type] ?? badgeMap.alert
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')

const sidebarOpen = ref(false)
const route = useRoute()

const navActive = (path) => {
  const isActive = route.path === path
  return isActive
    ? 'bg-emerald-50 text-emerald-900 font-extrabold relative before:content-[\'\'] before:absolute before:-left-1 before:h-6 before:w-1 before:rounded-full before:bg-emerald-500'
    : ''
}
</script>

<style scoped>
/* Tailwind animation + focus helpers */
@keyframes float-in {
  0% { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.animate-float { animation: float-in .2s ease-out both; }
.focus-ring:focus { outline: none; box-shadow: 0 0 0 3px rgba(16,185,129,.35); }
</style>
