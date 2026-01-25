<!-- views/Barangay/SeniorList.vue (or views/OSCA/SeniorList.vue) -->
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
                Barangay
                {{
                  (Array.isArray(profile?.barangays)
                    ? profile?.barangays?.[0]?.name
                    : profile?.barangays?.name) || 'Unknown Barangay'
                }}'s Current Applying Seniors
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
                        {{ a.timeLabel }} • {{ prettyType(a.reviewState) }}
                      </p>
                    </div>

                    <!-- View button removed -->
                  </div>
                </div>

                <!-- Empty state -->
                <div v-if="pagedActivities.length === 0" class="py-10 text-center text-gray-500">
                  No activities found.
                </div>
              </div>

              <!-- Pagination always visible -->
              <div class="mt-3 pt-3 border-t shrink-0">
                <Pagination v-model="page" :total-items="activities.length" :page-size="pageSize" />
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
import Header from '@/components/Staff/BRGY/Header.vue'
import { useAuth } from '@/composables/useAuth'
import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'
import Pagination from '@/components/Staff/Pagination.vue'

// ✅ Change this to your actual Supabase client import
import { supabase } from '@/supabase/client'

const brand = '#42ad43'
const sidebarCollapsed = ref(false)
const { profile } = useAuth()

/** Pagination */
const page = ref(1)
const pageSize = ref(7)

type ReviewState = 'not_reviewed' | 'currently_reviewing'

type ActivityItem = {
  id: string
  message: string
  timeLabel: string
  reviewState: ReviewState
}

const activities = ref<ActivityItem[]>([])
const loading = ref(false)

/**
 * Supabase embedded relations often come back as arrays in TS.
 * We type them as arrays and pick [0].
 */
type DbRow = {
  id: string
  created_at: string
  submitted_at: string | null
  status: string | null
  assigned_osca_id: string | null
  senior: { first_name: string | null; last_name: string | null }[] | null
  issuance: { name: string | null }[] | null
}

function pickOne<T>(v: T[] | null | undefined): T | null {
  return Array.isArray(v) && v.length ? v[0] : null
}

function formatName(p?: { first_name?: string | null; last_name?: string | null } | null) {
  const first = (p?.first_name || '').trim()
  const last = (p?.last_name || '').trim()
  const full = `${first} ${last}`.trim()
  return full || 'Unknown User'
}

function formatTimeLabel(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString()
}

function buildMessageWithIndex(userName: string, issuanceName: string, indexNum?: number) {
  const suffix = typeof indexNum === 'number' ? `.${indexNum}` : ''
  return `${userName} made an Application ${issuanceName}${suffix}`
}

async function fetchApplyingSeniors() {
  const barangayId = (profile as any)?.value?.barangay_id || (profile as any)?.barangay_id

  if (!barangayId) {
    activities.value = []
    return
  }

  loading.value = true
  try {
    // ✅ INCLUDE drafts now (no status/submitted_at filtering)
    const { data, error } = await supabase
      .from('applications')
      .select(
        `
        id,
        created_at,
        submitted_at,
        status,
        assigned_osca_id,
        senior:profiles!applications_senior_id_fkey(first_name,last_name),
        issuance:issuance_types!applications_issuance_type_id_fkey(name)
      `
      )
      .eq('barangay_id', barangayId)
      .order('created_at', { ascending: false })
      .limit(200)

    if (error) throw error

    const rows = (data ?? []) as unknown as DbRow[]

    // Count per (user + issuance) so we can add ".1/.2" only when needed
    const counts = new Map<string, number>()
    for (const r of rows) {
      const seniorOne = pickOne(r.senior)
      const issuanceOne = pickOne(r.issuance)

      const userName = formatName(seniorOne)
      const issuanceName = (issuanceOne?.name || '').trim() || 'Unknown'
      const key = `${userName}||${issuanceName}`

      counts.set(key, (counts.get(key) || 0) + 1)
    }

    // Assign numbering in display order
    const seen = new Map<string, number>()
    const finalMapped: ActivityItem[] = rows.map(r => {
      const seniorOne = pickOne(r.senior)
      const issuanceOne = pickOne(r.issuance)

      const userName = formatName(seniorOne)
      const issuanceName = (issuanceOne?.name || '').trim() || 'Unknown'
      const key = `${userName}||${issuanceName}`

      const idx = (seen.get(key) || 0) + 1
      seen.set(key, idx)

      const total = counts.get(key) || 1
      const msg =
        total > 1
          ? buildMessageWithIndex(userName, issuanceName, idx)
          : `${userName} made an Application ${issuanceName}`

      return {
        id: r.id,
        message: msg,
        timeLabel: formatTimeLabel(r.created_at),
        reviewState: r.assigned_osca_id ? 'currently_reviewing' : 'not_reviewed',
      }
    })

    activities.value = finalMapped
    page.value = 1
  } catch (e) {
    console.error('fetchApplyingSeniors error:', e)
    activities.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchApplyingSeniors()
})

watch(
  () => (profile as any)?.value?.barangay_id,
  () => fetchApplyingSeniors(),
  { immediate: true }
)

const totalPages = computed(() => Math.max(1, Math.ceil(activities.value.length / pageSize.value)))

const pagedActivities = computed(() => {
  const p = Math.min(Math.max(1, page.value), totalPages.value)
  const start = (p - 1) * pageSize.value
  return activities.value.slice(start, start + pageSize.value)
})

function prettyType(state: ReviewState) {
  // per notes:
  // - if no assigned_osca_id => Not Yet Reviewed
  // - else => Currently Reviewing
  switch (state) {
    case 'not_reviewed':
      return 'Edited by Staff Divina • Not Yet Reviewed'
    case 'currently_reviewing':
      return 'Edited by Staff Divina • Currently Reviewing'
    default:
      return 'Edited by Staff Divina'
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
