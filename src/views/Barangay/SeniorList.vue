<template>
  <!-- Entire page locked; only main content scrolls -->
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <!-- Sidebar (fixed height, not scrollable) -->
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
              Barangay {{ (Array.isArray(profile?.barangays) ? profile?.barangays?.[0]?.name : profile?.barangays?.name) || 'Unknown Barangay' }}'s Current Applying Seniors              </div>
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
                      View
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
import { computed, ref } from 'vue'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/BRGY/Header.vue'
import { useAuth } from '@/composables/useAuth'
import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'
import Pagination from '@/components/Staff/Pagination.vue'

const brand = '#42ad43'
const sidebarCollapsed = ref(false)

const { profile } = useAuth()

/** Pagination */
const page = ref(1)
const pageSize = ref(7)

type ActivityType = 'Staff Divine' | 'Staff Lorena'
type ActivityItem = {
  id: string
  type: ActivityType
  message: string
  timeLabel: string
  isUnread: boolean
  to: string
}

/** TEMP DATA (replace with Supabase later) */
const activities = ref<ActivityItem[]>([
  { id: 'a-001', type: 'Staff Divine', message: 'User A re-submitted Document A', timeLabel: '2 mins ago', isUnread: true, to: '/osca/applicant-review/a-001' },
  { id: 'a-002', type: 'Staff Lorena', message: 'User A submitted Document A', timeLabel: '10 mins ago', isUnread: false, to: '/osca/applicant-review/a-002' },
  { id: 'a-003', type: 'Staff Lorena', message: 'User A submitted Document B', timeLabel: '25 mins ago', isUnread: false, to: '/osca/applicant-review/a-003' },

])

const totalPages = computed(() => Math.max(1, Math.ceil(activities.value.length / pageSize.value)))

const pagedActivities = computed(() => {
  const p = Math.min(Math.max(1, page.value), totalPages.value)
  const start = (p - 1) * pageSize.value
  return activities.value.slice(start, start + pageSize.value)
})

function markRead(id: string) {
  const item = activities.value.find(x => x.id === id)
  if (item) item.isUnread = false
}

function prettyType(t: ActivityType) {
  switch (t) {
    case 'Staff Divine':
      return 'Edited by Staff Divine'
    case 'Staff Lorena':
      return 'Edited by Staff Lorena'
    default:
      return 'Activity'
  }
}


const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/barangay/dashboard', icon: DashboardIcon },
  { label: 'List', to: '/barangay/management', icon: BarangaysIcon },
  { label: 'Seniors', to: '/barangay/users', icon: ApplicationIcon },
  { label: 'Message', to: '/barangay/message', icon: ActivityIcon },
  { label: 'Announcement', to: '/barangay/announcement', icon: AnnouncementIcon },
]
</script>