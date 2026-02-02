<template>
  <div class="h-screen overflow-hidden bg-gray-50 font-poppins flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <main class="flex-1 px-4 pt-4 flex flex-col min-h-0">

      <div class="flex items-center mb-4">
        <!-- Title -->
        <div class="flex-1 pr-3">
          <h1 class="text-lg font-bold text-gray-900 leading-tight">
            Notifications
          </h1>
          <p class="text-xs text-gray-500">
            <span class="font-semibold text-gray-700">{{ unreadCount }}</span> unread • last updated just now
          </p>
        </div>

        <!-- Close -->
        <RouterLink
          to="/senior/dashboard"
          class="ml-auto inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white ring-1 ring-gray-200 shadow-sm hover:bg-gray-50"
          aria-label="Close"
        >
          <component :is="Right" class="h-5 w-5 text-yellow-500" />
        </RouterLink>
      </div>

      <div class="flex gap-2 overflow-x-auto pb-1 mb-3">
        <button
          v-for="t in tabs"
          :key="t"
          type="button"
          @click="activeTab = t"
          class="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ring-1 shadow-sm"
          :class="t === activeTab
            ? 'bg-yellow-50 text-yellow-800 ring-yellow-200'
            : 'bg-white text-gray-700 ring-gray-200 hover:bg-gray-50'"
        >
          {{ t }}
        </button>
      </div>

      <!-- Notification List (placeholder) -->
      <div class="flex-1 overflow-y-auto space-y-4 pb-24 overscroll-contain">

            <ul class="space-y-3">
            <li
              v-for="n in filtered"
              :key="n.id"
              class="bg-white rounded-2xl p-4 shadow-sm ring-1 overflow-hidden"
              :class="n.read_at ? 'ring-gray-200' : 'ring-yellow-200'"
            >

                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex-1 cursor-pointer overflow-hidden" @click="handleClick(n)">
                    <div class="flex items-center gap-2">
                      <span v-if="!n.read_at" class="inline-flex h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
                      <p class="font-bold text-gray-900">{{ n.title }}</p>
                    </div>
                    <p class="text-sm text-gray-700 mt-1 whitespace-pre-line break-words break-all">
                      {{ n.body || '' }}
                    </p>
                    <p class="text-xs text-gray-500 mt-2">
                      {{ timeAgo(n.created_at) }}
                    </p>
                  </div>

                  <button
                    v-if="!n.read_at"
                    type="button"
                    @click="markRead(n.id)"
                    class="shrink-0 text-xs px-3 py-2 rounded-xl bg-gray-50 text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100"
                  >
                    Mark read
                  </button>

                  <span
                    v-else
                    class="shrink-0 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 ring-1 ring-gray-200"
                  >
                    Read
                  </span>
                </div>
              </li>
            </ul>

          <div class="mt-4 bg-white rounded-2xl p-5 ring-1 ring-gray-200 shadow-sm">
            <div class="flex items-start gap-3">
              <div class="h-10 w-10 rounded-xl bg-yellow-50 ring-1 ring-yellow-200 flex items-center justify-center">
                <!-- Bell icon -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-yellow-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 0 1-6 0m6 0H9"
                  />
                </svg>
              </div>

              <div class="min-w-0">
                <p class="font-bold text-gray-900">No notifications</p>
                <p class="text-sm text-gray-600 mt-1">
                </p>
              </div>
            </div>
          </div>

      </div>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import Right from '@/assets/icons/senior/right-arrow.svg'
import { supabase } from '@/supabase/client' // adjust path

const router = useRouter()
const open = ref(false)

type NotifRow = {
  id: string
  type: string
  title: string
  body: string | null
  link: any
  created_at: string
  read_at: string | null
}

const tabs = ['All', 'Updates', 'From OSCA', 'From BRGY']
const activeTab = ref('All')

const notifications = ref<NotifRow[]>([])
const loading = ref(false)

import type { RealtimeChannel } from '@supabase/supabase-js'
let channel: RealtimeChannel | null = null

const unreadCount = computed(() => notifications.value.filter(n => !n.read_at).length)

const filtered = computed(() => {
  if (activeTab.value === 'All') return notifications.value
  if (activeTab.value === 'Updates') {
    return notifications.value.filter(n =>
      ['application_status','application_assigned'].includes(n.type)
    )
  }
  if (activeTab.value === 'From OSCA') {
    return notifications.value.filter(n =>
      n.type.startsWith('osca_') || n.type === 'announcement' || n.type.startsWith('application_')
    )
  }
  if (activeTab.value === 'From BRGY') {
    return notifications.value.filter(n => n.type.startsWith('brgy_'))
  }
  return notifications.value
})

// Announcement modal state
const showModal = ref(false)
const modalTitle = ref('')
const modalBody = ref('')
const modalCreatedAt = ref('')

async function loadNotifications() {
  loading.value = true
  try {
    const { data: auth } = await supabase.auth.getUser()
    const user = auth.user
    if (!user) {
      notifications.value = []
      return
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('id,type,title,body,link,created_at,read_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error
    notifications.value = (data ?? []) as NotifRow[]
  } finally {
    loading.value = false
  }
}

async function markRead(id: string) {
  const idx = notifications.value.findIndex(n => n.id === id)
  if (idx === -1) return
  if (notifications.value[idx].read_at) return

  const now = new Date().toISOString()
  notifications.value[idx].read_at = now

  await supabase
    .from('notifications')
    .update({ read_at: now })
    .eq('id', id)
}

async function openAnnouncement(announcementId: string) {
  const { data, error } = await supabase
    .from('announcements')
    .select('title,body,created_at')
    .eq('id', announcementId)
    .single()

  if (error) throw error

  modalTitle.value = data.title
  modalBody.value = data.body
  modalCreatedAt.value = data.created_at
  showModal.value = true
}

async function handleClick(n: NotifRow) {
  await markRead(n.id)

  const link = n.link || {}
  if (link?.kind === 'modal' && link?.announcement_id) {
    await openAnnouncement(link.announcement_id)
    return
  }

  if (link?.name) {
    await router.push({ name: link.name, params: link.params || {} })
    return
  }

  if (link?.path) {
    await router.push(link.path)
    return
  }
}

function timeAgo(iso: string) {
  const t = new Date(iso).getTime()
  const diff = Date.now() - t
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

async function setupRealtime() {
  const { data: auth } = await supabase.auth.getUser()
  const user = auth.user
  if (!user) return

  // ✅ prevent duplicate subscriptions when navigating back/forth
  if (channel) {
    await supabase.removeChannel(channel)
    channel = null
  }

  channel = supabase
    .channel(`notif_${user.id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      },
      payload => {
        console.log('NEW NOTIF PAYLOAD:', payload)
        notifications.value = [payload.new as NotifRow, ...notifications.value]
      }
    )
    .subscribe(status => {
      console.log('🔔 notif channel status:', status)
    })
}

onMounted(async () => {
  await loadNotifications()
  await setupRealtime()
})

onBeforeUnmount(async () => {
  if (channel) {
    await supabase.removeChannel(channel)
    channel = null
  }
})

</script>
