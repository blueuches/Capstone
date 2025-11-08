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
  <div class="flex items-center justify-between mb-2">
    <h2 class="text-2xl font-bold text-emerald-700">Notifications</h2>
    <button
      class="text-sm px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 disabled:opacity-50"
      @click="markAllRead"
      :disabled="loading || !notifications.length"
    >
      Mark all as read
    </button>
  </div>

  <div v-if="loading" class="space-y-3">
    <div class="h-16 bg-emerald-100/40 animate-pulse rounded-xl"></div>
    <div class="h-16 bg-emerald-100/40 animate-pulse rounded-xl"></div>
  </div>

  <p v-else-if="error" class="text-sm text-red-600">{{ error }}</p>

  <p v-else-if="!notifications.length" class="text-sm text-gray-600">
    You have no notifications yet.
  </p>

  <ul v-else class="space-y-3">
    <li
      v-for="n in notifications"
      :key="n.id"
      class="p-4 rounded-lg border-l-4"
      :class="[
        n.is_read ? 'bg-white border-emerald-300' : 'bg-emerald-50 border-emerald-500'
      ]"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="font-semibold text-emerald-900">
            {{ n.announcement?.title ?? 'Announcement' }}
          </div>
          <div class="text-[15px] text-emerald-800 whitespace-pre-line">
            {{ n.announcement?.content ?? '' }}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            {{ formatTimeAgo(n.created_at) }}
            <span v-if="n.announcement?.sender_role" class="text-gray-400">• from {{ n.announcement?.sender_role }}</span>
          </div>
        </div>
        <button
          v-if="!n.is_read"
          class="text-xs px-2 py-1 rounded-lg border border-emerald-300 hover:bg-emerald-100"
          @click="markOneRead(n.id)"
        >
          Mark read
        </button>
      </div>
    </li>
  </ul>
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

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNotifications } from '@/composables/useNotifications'

// avatar
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

const { notifications, unreadCount, loading, error, formatTimeAgo, markOneRead, markAllRead } =
  useNotifications(100)

// Use this computed for your bell badge below
const notifCount = computed(() => unreadCount.value)
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
