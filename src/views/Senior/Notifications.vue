<template>
  <div class="bg-gradient-to-b from-emerald-50 to-white min-h-screen flex flex-col">
    <!-- Sticky Top Bar -->
    <SeniorHeader @toggle-sidebar="toggleSidebar" />

  <SeniorSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

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
    <SeniorNav />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import SeniorNav from '@/components/SeniorNav.vue'
import SeniorHeader from '@/components/SeniorHeader.vue'
import SeniorSidebar from '@/components/SeniorSidebar.vue'

const sidebarOpen = ref(false)
function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }

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
