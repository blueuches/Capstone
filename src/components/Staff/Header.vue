<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
    <!-- Left -->
    <div class="flex items-center gap-3 min-w-0">
      <button
        @click="$emit('toggle-sidebar')"
        class="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition flex items-center justify-center"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <path d="M10 7l-5 5 5 5M19 7l-5 5 5 5" stroke="currentColor" stroke-width="2" />
        </svg>
      </button>

      <div v-if="showSearch" class="hidden sm:block w-[320px] max-w-[45vw]">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" stroke-width="2" />
              <path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" />
            </svg>
          </span>
          <input
            v-model="searchValue"
            type="text"
            placeholder="Search..."
            class="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#42ad43]/30"
            @input="$emit('update:search', searchValue)"
          />
        </div>
      </div>
    </div>

    <!-- Right -->
    <div class="flex items-center gap-2">
      <!-- Notifications -->
      <RouterLink
        :to="notificationTo"
        class="relative w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
            stroke="currentColor"
            stroke-width="2"
          />
          <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="currentColor" stroke-width="2" />
        </svg>

        <!-- Badge -->
        <span
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 min-w-[18px] h-[18px]
                 px-1 rounded-full bg-red-500 text-white text-[11px]
                 font-bold flex items-center justify-center border-2 border-white"
        >
          {{ unreadLabel }}
        </span>
      </RouterLink>

      <!-- Profile -->
      <div class="relative" ref="profileWrap">
        <button
          @click="toggleProfile"
          class="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M20 21a8 8 0 1 0-16 0" stroke="currentColor" stroke-width="2" />
            <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" stroke-width="2" />
          </svg>
        </button>

        <transition>
          <div
            v-if="profileOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border z-50"
          >
            <RouterLink :to="profileTo" class="block px-4 py-3 text-sm hover:bg-gray-50">
              Profile
            </RouterLink>
            <RouterLink :to="aboutTo" class="block px-4 py-3 text-sm hover:bg-gray-50">
              About
            </RouterLink>
            <p class="block px-4 py-3 text-sm text-red hover:bg-gray-50" @click="logout">
              Logout
            </p>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { supabase } from '@/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

const { logout } = useAuth()

/* ───────── props (notificationCount REMOVED) ───────── */
const props = defineProps<{
  showSearch?: boolean
  search?: string
  notificationTo?: string
  profileTo?: string
  aboutTo?: string
}>()

defineEmits<{
  (e: 'toggle-sidebar'): void
  (e: 'update:search', v: string): void
}>()

/* ───────── routes ───────── */
const notificationTo = computed(() => props.notificationTo ?? '/osca/notification')
const profileTo = computed(() => props.profileTo ?? '/osca/profile')
const aboutTo = computed(() => props.aboutTo ?? '/osca/about')

/* ───────── UI state ───────── */
const searchValue = ref(props.search ?? '')
const profileOpen = ref(false)
const profileWrap = ref<HTMLElement | null>(null)

/* ───────── notification count (LIKE BARANGAY) ───────── */
const unreadCount = ref(0)
const unreadLabel = computed(() =>
  unreadCount.value > 99 ? '99+' : String(unreadCount.value)
)

let channel: RealtimeChannel | null = null
let currentUserId: string | null = null

async function refreshUnreadCount() {
  if (!currentUserId) return

  const { count } = await supabase
    .from('notifications')
    .select('id', { head: true, count: 'exact' })
    .eq('user_id', currentUserId)
    .is('read_at', null)

  unreadCount.value = count ?? 0
}

async function setupNotifRealtime() {
  const { data } = await supabase.auth.getUser()
  if (!data.user) return

  currentUserId = data.user.id

  await refreshUnreadCount()

  if (channel) {
    await supabase.removeChannel(channel)
    channel = null
  }

  channel = supabase
    .channel(`osca_notif_${currentUserId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${currentUserId}`
      },
      payload => {
        if (!payload.new.read_at) unreadCount.value += 1
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${currentUserId}`
      },
      payload => {
        const oldRow = payload.old as any
        const newRow = payload.new as any

        if (!oldRow?.read_at && newRow?.read_at) {
          unreadCount.value = Math.max(0, unreadCount.value - 1)
        }
        if (oldRow?.read_at && !newRow?.read_at) {
          unreadCount.value += 1
        }
      }
    )
    .subscribe()
}

/* ───────── profile dropdown ───────── */
function toggleProfile() {
  profileOpen.value = !profileOpen.value
}

function onDocClick(e: MouseEvent) {
  if (!profileOpen.value) return
  if (!profileWrap.value?.contains(e.target as Node)) {
    profileOpen.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', onDocClick)
  await setupNotifRealtime()
})

onBeforeUnmount(async () => {
  document.removeEventListener('click', onDocClick)
  if (channel) {
    await supabase.removeChannel(channel)
    channel = null
  }
})
</script>
