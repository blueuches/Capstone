<template>
  <!-- Entire page locked; only main content scrolls -->
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <!-- Sidebar (fixed height, not scrollable) -->
    <Sidebar
      :collapsed="sidebarCollapsed"
      :navItems="oscaNavItems"
      footerText="OSCA - CSU © 2026"
    />

    <!-- Right side -->
    <div class="flex-1 min-w-0 flex flex-col">
      <Header
        :showSearch="false"
        :notificationCount="3"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
      />

      <main class="flex-1 overflow-hidden">
        <div class="h-full px-4 sm:px-6 py-4 flex flex-col">
          <!-- Card (intentionally smaller) -->
          <section
            class="bg-white rounded-2xl shadow-sm border-4 flex flex-col max-h-[520px] w-full"
            :style="{ borderColor: brand }"
          >
            <!-- Header bar -->
            <div
              class="px-4 sm:px-6 py-2 border-b-4 rounded-t-xl shrink-0"
              :style="{ borderColor: brand }"
            >
              <div
                class="w-full text-center font-extrabold text-white py-2 rounded-lg tracking-wide text-sm sm:text-base"
                :style="{ backgroundColor: brand }"
              >
                General Notification
              </div>
            </div>

            <!-- Content -->
            <div class="px-3 sm:px-4 py-3 flex-1 min-h-0 flex flex-col">
              <!-- Rows area -->
              <div class="flex-1 min-h-0 overflow-y-auto pr-1">
                <div class="space-y-2">
                  <div
                    v-for="a in pagedActivities"
                    :key="a.id"
                    class="flex items-center gap-3 border-2 rounded-lg px-3 py-2"
                    :style="{ borderColor: brand }"
                  >
                    <!-- status dot -->
                    <span
                      class="w-2.5 h-2.5 rounded-full shrink-0"
                      :class="a.isUnread ? 'opacity-100' : 'opacity-0'"
                      :style="{ backgroundColor: '#f4d000' }"
                      aria-hidden="true"
                      title="Unread"
                    />

                    <!-- message -->
                    <div class="min-w-0 flex-1">
                      <p class="text-gray-800 text-sm font-semibold truncate">
                        {{ a.message }}
                      </p>
                      <p class="text-[11px] text-gray-500">
                        {{ a.timeLabel }} • {{ prettyType(a.type) }}
                      </p>
                    </div>

                    <!-- action -->
                    <button
                      type="button"
                      class="shrink-0 inline-flex items-center justify-center
                            px-3 py-1.5 rounded-md text-sm font-bold text-white
                            hover:brightness-105 active:brightness-95 transition"
                      :style="{ backgroundColor: brand }"
                      @click="handleView(a)"
                    >
                      View
                    </button>

                  </div>
                </div>

                <!-- Empty state -->
                <div v-if="pagedActivities.length === 0" class="py-10 text-center text-gray-500">
                  No activities found.
                </div>
              </div>

              <!-- Pagination always visible -->
              <div class="mt-3 pt-3 border-t shrink-0">
                <Pagination
                  v-model="page"
                  :total-items="activities.length"
                  :page-size="pageSize"
                />
              </div>
            </div>
          </section>

          <!-- Announcement Modal -->
          <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div class="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden">
              <div class="px-5 py-4 text-white font-extrabold" :style="{ backgroundColor: brand }">
                {{ modalTitle }}
              </div>
              <div class="px-5 py-4">
                <p class="text-sm text-gray-700 whitespace-pre-line">{{ modalBody }}</p>
                <p class="text-xs text-gray-500 mt-3">Posted: {{ timeAgo(modalCreatedAt) }}</p>
                <div class="mt-4 flex justify-end">
                  <button
                    class="px-4 py-2 rounded-lg text-white font-bold"
                    :style="{ backgroundColor: brand }"
                    @click="showModal = false"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/BRGY/Header.vue'
import Pagination from '@/components/Staff/Pagination.vue' 
import { supabase } from '@/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

const router = useRouter()
const brand = '#42ad43'
const sidebarCollapsed = ref(false)

/** Pagination */
const page = ref(1)
const pageSize = ref(7)

type NotifType = 'brgy_message' | 'brgy_announcement' | string
type NotifRow = {
  id: string
  type: NotifType
  title: string
  body: string | null
  link: any
  created_at: string
  read_at: string | null
}

type ActivityItem = {
  id: string
  type: NotifType
  message: string
  timeLabel: string
  isUnread: boolean
  to: string // for RouterLink, but we will override behavior for modal
  link: any
}

const activities = ref<ActivityItem[]>([])
const loading = ref(false)

// Modal (announcement)
const showModal = ref(false)
const modalTitle = ref('')
const modalBody = ref('')
const modalCreatedAt = ref('')

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

function prettyType(t: NotifType) {
  if (t === 'brgy_message') return 'Message'
  if (t === 'brgy_announcement') return 'Announcement'
  return 'Notification'
}

async function loadNotifications() {
  loading.value = true
  try {
    const { data: auth } = await supabase.auth.getUser()
    const user = auth.user
    if (!user) {
      activities.value = []
      return
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('id,type,title,body,link,created_at,read_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(200)

    if (error) throw error

    const rows = (data ?? []) as NotifRow[]

    activities.value = rows.map(r => ({
      id: r.id,
      type: r.type,
      message: r.title + (r.body ? ` — ${r.body}` : ''),
      timeLabel: timeAgo(r.created_at),
      isUnread: !r.read_at,
      to: r.link?.path || '/barangay/message', // default
      link: r.link
    }))
  } finally {
    loading.value = false
  }
}

async function markRead(id: string) {
  const idx = activities.value.findIndex(x => x.id === id)
  if (idx === -1) return
  if (!activities.value[idx].isUnread) return

  activities.value[idx].isUnread = false

  const now = new Date().toISOString()
  await supabase.from('notifications').update({ read_at: now }).eq('id', id)
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

async function handleView(a: ActivityItem) {
  await markRead(a.id)

  const link = a.link || {}

  // Announcement modal
  if (link?.kind === 'modal' && link?.announcement_id) {
    await openAnnouncement(link.announcement_id)
    return
  }

  // Message route
  if (link?.path) {
    await router.push(link.path)
    return
  }

  // fallback
  await router.push('/barangay/message')
}

const totalPages = computed(() => Math.max(1, Math.ceil(activities.value.length / pageSize.value)))

const pagedActivities = computed(() => {
  const p = Math.min(Math.max(1, page.value), totalPages.value)
  const start = (p - 1) * pageSize.value
  return activities.value.slice(start, start + pageSize.value)
})

// Realtime
let channel: RealtimeChannel | null = null

async function setupRealtime() {
  const { data: auth } = await supabase.auth.getUser()
  const user = auth.user
  if (!user) return

  if (channel) {
    await supabase.removeChannel(channel)
    channel = null
  }

  channel = supabase
    .channel(`brgy_notif_${user.id}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
      payload => {
        const n = payload.new as NotifRow
        activities.value = [
          {
            id: n.id,
            type: n.type,
            message: n.title + (n.body ? ` — ${n.body}` : ''),
            timeLabel: timeAgo(n.created_at),
            isUnread: !n.read_at,
            to: n.link?.path || '/barangay/message',
            link: n.link
          },
          ...activities.value
        ]
      }
    )
    .subscribe()
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

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/barangay/dashboard', icon: DashboardIcon },
  { label: 'List', to: '/barangay/management', icon: BarangaysIcon },
  { label: 'Seniors', to: '/barangay/users', icon: ApplicationIcon },
  { label: 'Message', to: '/barangay/message', icon: ActivityIcon },
  { label: 'Announcement', to: '/barangay/announcement', icon: AnnouncementIcon }
]
</script>
