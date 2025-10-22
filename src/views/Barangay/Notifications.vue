<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <!-- Sidebar -->
    <Sidebar role="brgy" />

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
import Sidebar from '@/components/Sidebar.vue'

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
