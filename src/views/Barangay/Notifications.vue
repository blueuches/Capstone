<!-- BarangayNotifications.vue -->
<template>
 <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 bg-white shadow-lg flex flex-col py-6 z-50 transform transition-transform duration-300',
        sidebarOpen ? 'translate-x-0 w-60' : '-translate-x-full w-60',
        'md:relative md:translate-x-0 md:w-60'
      ]"
    >
      <h4 class="font-bold text-emerald-700 mb-8 px-4">SeniorGo</h4>

      <nav class="flex flex-col gap-6 w-full items-start px-4">
        <!-- Home -->
        <router-link
          to="/barangay/dashboard"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 9.75L12 3l9 6.75V21a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 21V9.75z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 22V12h6v10" />
          </svg>
          <span class="font-bold text-lg">Home</span>
        </router-link>

        <!-- Messaging -->
        <router-link
          to="/barangay/messaging"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.83L3 20l1.29-2.58A7.79 7.79 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span class="font-bold text-lg">Post</span>
        </router-link>

        <!-- Notifications -->
        <router-link
          to="/barangay/notifications"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 17h5l-1.405-1.405C18.21 14.79 18 14.418 18 14V11a6 6 0 00-12 0v3c0 .418-.21.79-.595 1.595L4 17h5m6 0v1a3 3 0 11-6 0v-1" />
          </svg>
          <span class="font-bold text-lg">Notifications</span>
        </router-link>

        <!-- Applications -->
        <router-link
          to="/barangay/senior-queue"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 17h6m-6-4h6m-6-4h6m-7 9h8a2 2 0 002-2V5a2 2 0 00-2-2h-8a2 2 0 00-2 2v14z" />
          </svg>
          <span class="font-bold text-lg">Applications</span>
        </router-link>

        <!-- Logout -->
        <router-link
          to="/logout"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          <span class="font-bold text-lg">Logout</span>
        </router-link>
      </nav>
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
          <!-- Icon by type -->
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

          <!-- Content -->
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h2 class="font-bold text-xl text-emerald-700">{{ n.title }}</h2>
              <span
                class="px-3 py-1 text-sm font-semibold rounded-full"
                :class="badgeClass(n.type)"
              >
                {{ capitalize(n.type) }}
              </span>
            </div>
            <p class="text-gray-700 mt-2">{{ n.message }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ n.time }}</p>
          </div>
        </div>
      </div>

      <!-- Back to Dashboard -->
      <div class="mt-10">
        <router-link to="/barangay/dashboard">
          <p class="text-emerald-700 font-bold underline text-lg">← Back to Dashboard</p>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
defineOptions({ name: 'BarangayNotifications' })

/**
 * DYNAMIC: replace this array with props or fetched data later.
 * e.g., defineProps<{ notifications: NotificationItem[] }>()
 */
const notifications = [
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
]

// Small helpers for classes / labels
const badgeMap = {
  success: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  alert:   'bg-red-100 text-red-700'
}
const badgeClass = (type) => badgeMap[type] ?? badgeMap.alert
const capitalize = (s) => (s?.charAt(0).toUpperCase() + s?.slice(1)) || ''
</script>

<style scoped>
/* Optional utility groups from your original file; safe to keep if used elsewhere */
.tab { @apply h-9 px-4 rounded-full text-sm text-slate-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F4C81]; min-width: 64px; }
.tab-active { @apply bg-white text-[#0F4C81] font-medium shadow; }
.card { @apply w-full flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:shadow-md transition-shadow; }
.card.unread { @apply bg-[#F7FAFC] border-sky-200; }
.icon { @apply h-9 w-9 shrink-0 grid place-items-center rounded-full text-sm font-semibold; }
.title { @apply text-sm font-semibold text-[#0B1320] truncate; }
.snippet { @apply text-xs text-slate-600 truncate; }
.time { @apply mt-1 text-[11px] text-slate-500; }
.dot { @apply h-3 w-3 rounded-full bg-red-500 shrink-0 self-start mt-1; }
</style>
