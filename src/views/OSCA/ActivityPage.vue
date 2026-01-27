<!-- views/Staff/OSCA/Activity.vue -->
<template>
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <Sidebar
      :collapsed="sidebarCollapsed"
      :navItems="oscaNavItems"
      footerText="OSCA - CSU © 2026"
    />

    <div class="flex-1 min-w-0 flex flex-col">
      <Header
        :showSearch="false"
        :notificationCount="3"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
      />

      <!-- No page scrolling; keep everything within the screen -->
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
                Applicants Submissions and Updates Notification
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
                    <RouterLink
                      :to="a.to"
                      class="shrink-0 inline-flex items-center justify-center
                             px-3 py-1.5 rounded-md text-sm font-bold text-white
                             hover:brightness-105 active:brightness-95 transition"
                      :style="{ backgroundColor: brand }"
                      @click="markRead(a.id)"
                    >
                      Review Now
                    </RouterLink>
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
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/Header.vue'
import Pagination from '@/components/Staff/Pagination.vue'
import { supabase } from '@/supabase/client' // <-- adjust path if needed

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

const brand = '#42ad43'
const sidebarCollapsed = ref(false)

/** Pagination */
const page = ref(1)
const pageSize = ref(7)
const totalItems = ref(0)
const loading = ref(false)

type ActivityType = 'submitted_file' | 'started_application' | 'sent_form'
type ActivityItem = {
  id: string
  type: ActivityType
  message: string
  timeLabel: string
  isUnread: boolean
  to: string
  happened_at: string
  application_id: string
}

const activities = ref<ActivityItem[]>([])

function timeAgo(input: string) {
  const d = new Date(input)
  const diffMs = Date.now() - d.getTime()
  const sec = Math.floor(diffMs / 1000)
  const min = Math.floor(sec / 60)
  const hr = Math.floor(min / 60)
  const day = Math.floor(hr / 24)

  if (sec < 60) return `${sec}s ago`
  if (min < 60) return `${min}m ago`
  if (hr < 24) return `${hr}h ago`
  return `${day}d ago`
}

/** local unread (optional). If you want persistent unread per OSCA staff,
 * we’ll connect this to notifications table later. */
const unreadSet = ref<Set<string>>(new Set())

function markRead(id: string) {
  unreadSet.value.delete(id)
  const item = activities.value.find(x => x.id === id)
  if (item) item.isUnread = false
}

function prettyType(t: ActivityType) {
  switch (t) {
    case 'submitted_file': return 'Submitted Requirements'
    case 'started_application': return 'Started Application'
    case 'sent_form': return 'Submitted Form'
    default: return 'Activity'
  }
}

const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

const pagedActivities = computed(() => {
  // we already fetch by page; keep template unchanged
  return activities.value
})

async function fetchActivities() {
  loading.value = true
  try {
    const limit = pageSize.value
    const offset = (page.value - 1) * pageSize.value

    const { data, error } = await supabase.rpc('get_osca_activity_feed', {
      p_limit: limit,
      p_offset: offset
    })

    if (error) throw error

    const rows = (data ?? []) as Array<{
      id: string
      type: ActivityType
      message: string
      happened_at: string
      application_id: string
      total_count: number
    }>

    totalItems.value = rows[0]?.total_count ?? 0

    activities.value = rows.map(r => {
      const isUnread = unreadSet.value.has(r.id) || unreadSet.value.size === 0
      // ^ optional: first load mark all unread; you can change behavior easily

      // keep your router link format consistent with your route:
      // { path: '/osca/applicant/:applicationId', name:'ApplicantReview', props:true ... }
      const to = { name: 'ApplicantReview', params: { applicationId: r.application_id } }

      // ensure set contains it if unread
      if (isUnread) unreadSet.value.add(r.id)

      return {
        id: r.id,
        type: r.type,
        message: r.message,
        timeLabel: timeAgo(r.happened_at),
        isUnread,
        to: (to as any),
        happened_at: r.happened_at,
        application_id: r.application_id
      }
    })
  } finally {
    loading.value = false
  }
}

watch([page, pageSize], () => {
  fetchActivities()
})

onMounted(() => {
  fetchActivities()
})

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/osca/dashboard', icon: DashboardIcon },
  { label: 'Barangays', to: '/osca/barangays', icon: BarangaysIcon },
  { label: 'Application', to: '/osca/programs', icon: ApplicationIcon },
  { label: 'Activity', to: '/osca/activity', icon: ActivityIcon },
  { label: 'Announcement', to: '/osca/announcement', icon: AnnouncementIcon }
]
</script>
