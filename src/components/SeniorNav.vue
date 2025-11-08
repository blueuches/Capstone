<template>
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
          @click="$emit('mic')"
          :class="[ 'relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg',
                    micActive ? 'bg-emerald-500 text-white ring-4 ring-emerald-300 animate-pulse-glow'
                              : 'bg-emerald-600 text-white']"
          aria-label="Voice"
        >
          <span v-if="micActive" class="absolute inset-0 rounded-full bg-emerald-400 opacity-30 animate-ping"></span>
          <svg viewBox="0 0 24 24" class="w-6 h-6 relative z-10" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z" />
            <path d="M19 11a7 7 0 0 1-14 0" />
            <path d="M12 18v4" />
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
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNotifications } from '@/composables/useNotifications'

/** Live unread count from Supabase (updates in real time) */
const { unreadCount } = useNotifications(100)
const notifCount = computed(() => unreadCount.value)

/** Mic UI state (unchanged) */
const micActive = ref(false)
</script>

<style scoped>
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
  50% { box-shadow: 0 0 15px 5px rgba(16, 185, 129, 0.6); }
}
.animate-pulse-glow { animation: pulseGlow 1.5s infinite ease-in-out; }
</style>
