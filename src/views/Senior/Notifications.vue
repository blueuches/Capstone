<template>
  <div class="bg-gradient-to-b from-emerald-50 to-white min-h-screen flex flex-col">
    <!-- Sticky Top Bar -->
    <header
      class="sticky top-0 z-40 bg-emerald-600 text-white shadow-md"
      role="banner"
    >
      <div class="px-4 py-3 flex items-center gap-3">
        <button aria-label="Menu" class="p-2 rounded-full hover:bg-emerald-700/40">
          <!-- hamburger -->
          <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <!-- App title -->
        <h1 class="flex-1 text-lg font-bold text-center -ml-8">SeniorGo</h1>

        <router-link to="/senior/profile" aria-label="Profile" class="shrink-0">
          <img :src="avatarUrl" @error="useInlineAvatar"
               class="w-8 h-8 rounded-full border border-white/70 object-cover" alt="Profile"/>
        </router-link>
      </div>

      <!-- Search row -->
      <div class="px-4 pb-3">
        <label class="relative block">
          <span class="sr-only">Search</span>
          <svg class="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-emerald-900/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle><path d="m21 21-3.5-3.5"></path>
          </svg>
          <input
            type="search"
            placeholder="Search"
            class="w-full rounded-xl pl-10 pr-3 py-2 text-[15px] placeholder:opacity-70
                   bg-white/95 text-emerald-950 ring-1 ring-emerald-200 focus:ring-2 focus:ring-yellow-300 outline-none"
          />
        </label>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto px-4 pb-[88px] pt-3">
          <h2 class="text-2xl font-bold text-emerald-700">Notifications</h2>
          <div class="space-y-3">
            <div class="p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded-lg">
              Your Food Assistance application is
              <span class="font-bold text-yellow-700">Pending</span> at Barangay.
              <div class="text-sm text-gray-500">2 days ago</div>
            </div>
            <div class="p-4 border-l-4 border-green-500 bg-green-50 rounded-lg">
              Your Medical Checkup request has been
              <span class="font-bold text-green-700">Validated</span>.
              <div class="text-sm text-gray-500">5 days ago</div>
            </div>
            <div class="p-4 border-l-4 border-red-500 bg-red-50 rounded-lg">
              Your Livelihood application was <span class="font-bold text-red-700">Declined</span>.
              Please contact your barangay.
              <div class="text-sm text-gray-500">1 week ago</div>
            </div>
          </div>
    </main>

    <!-- Sticky Bottom Tabbar (safe-area aware) -->
    <nav
      class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70
             border-t border-emerald-100 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)]"
      role="navigation"
    >
      <ul class="flex items-center justify-around px-6">
                <li>
          <router-link
            to="/senior/notifications"
            class="relative w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"
            aria-label="Notifications"
          >
            <!-- bell -->
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 5 3 9H3c0-4 3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>
            </svg>
            <span
              v-if="notifCount"
              class="absolute -top-0.5 -right-0.5 text-[10px] leading-none bg-red-500 text-white px-1.5 py-0.5 rounded-full"
            >{{ notifCount }}</span>
          </router-link>
        </li>

        <li>
          <button
            class="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg"
            aria-label="Voice"
          >
            <!-- mic -->
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z"/>
              <path d="M19 11a7 7 0 0 1-14 0"/><path d="M12 18v4"/>
            </svg>
          </button>
        </li>

        <li>
          <router-link
            to="/senior/dashboard"
            class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"
            aria-label="Home"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>

          </router-link>
        </li>

      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

/* avatar with safe inline fallback */
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

/* Quick actions (3 per row) */
const actions = [
  { icon: '📊', label: 'My Application', to: '/senior/id' },
  { icon: '📅', label: 'Programs', to: '/senior/benefits' },
  { icon: '📄', label: 'Requirements', to: '/senior/health' },
  { icon: '📝', label: 'Apply', to: '/senior/form' },
  { icon: '🏠︎', label: 'OSCA Location', to: '/senior/events' },
  { icon: '❓', label: 'Help', to: '/senior/help' },
]

/* Announcements list */
const announcements = [
  {
    title: 'Vaccination Drive',
    subtitle: 'Free flu shots at City Hall tomorrow',
    meta: 'April 10, 2025 • 9AM–3PM',
    to: '/senior/announcements/1'
  },
  {
    title: 'Pension Distribution',
    subtitle: 'Schedule for this month’s pension',
    meta: 'April 15, 2025 • Local treasury',
    to: '/senior/announcements/2'
  }
]

const notifCount = ref(2)
</script>

<style scoped>
/* Make long text nicely clipped without extra height */
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* iOS safe-area (older Safari fallbacks are handled by env()) */
@supports (padding: max(0px)) {
  nav { padding-bottom: max(env(safe-area-inset-bottom), 10px); }
}
</style>
