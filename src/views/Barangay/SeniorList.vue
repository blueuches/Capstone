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
                        {{ a.timeLabel }} • {{ prettyType(a) }}
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
  assignedLabel: string
}

const activities = ref<ActivityItem[]>([])
const loading = ref(false)

/**
 * applications.status is an enum in your schema:
 * draft, submitted, under_review, needs_correction, approved, rejected, released
 */
type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'needs_correction'
  | 'approved'
  | 'rejected'
  | 'released'

type DbProfile = { first_name: string | null; last_name: string | null }

type DbRow = {
  id: string
  created_at: string
  submitted_at: string | null
  status: ApplicationStatus | null
  assigned_osca_id: string | null

  senior: DbProfile | DbProfile[] | null
  issuance: { name: string | null } | { name: string | null }[] | null
  assigned_osca: DbProfile | DbProfile[] | null
}

function pickRel<T>(v: T | T[] | null | undefined): T | null {
  if (!v) return null
  return Array.isArray(v) ? (v.length ? v[0] : null) : v
}

function formatName(p?: { first_name?: string | null; last_name?: string | null } | null) {
  const first = (p?.first_name || '').trim()
  const last = (p?.last_name || '').trim()
  const full = `${first} ${last}`.trim()
  return full || 'Unknown Senior'
}

function formatTimeLabel(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString()
}

function resolveReviewState(status: ApplicationStatus | null, assignedOscoId: string | null): ReviewState {
  // ✅ your note: if not reviewed NOR assigned => "Not reviewed yet"
  // We'll treat only draft/submitted (and no assigned) as not reviewed yet.
  if (!assignedOscoId && (status === 'draft' || status === 'submitted' || status === null)) {
    return 'not_reviewed'
  }
  return 'currently_reviewing'
}

function resolveAssignedLabel(assignedOscoId: string | null, assignedProfile: DbProfile | null) {
  if (!assignedOscoId) return 'Not assigned yet'
  const name = formatName(assignedProfile)
  // if assigned but missing profile fields, still show something stable:
  return name === 'Unknown Senior' ? 'Assigned to: (Unknown OSCA Staff)' : `Assigned to: ${name}`
}

async function fetchApplyingSeniors() {
  const barangayId = (profile as any)?.value?.barangay_id || (profile as any)?.barangay_id

  if (!barangayId) {
    activities.value = []
    return
  }

  loading.value = true
  try {
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
        issuance:issuance_types!applications_issuance_type_id_fkey(name),
        assigned_osca:profiles!applications_assigned_osca_id_fkey(first_name,last_name)
      `
      )
      .eq('barangay_id', barangayId)
      .order('created_at', { ascending: false })
      .limit(200)

    if (error) throw error

    const rows = (data ?? []) as unknown as DbRow[]

    console.log('rows sample:', rows[0])

    const finalMapped: ActivityItem[] = rows.map(r => {
      const seniorOne = pickRel(r.senior)
      const issuanceOne = pickRel(r.issuance)
      const assignedOscoOne = pickRel(r.assigned_osca)


      const seniorName = formatName(seniorOne)
      const issuanceName = (issuanceOne?.name || '').trim() || 'Unknown Issuance'

      const reviewState = resolveReviewState(r.status, r.assigned_osca_id)
      const assignedLabel = resolveAssignedLabel(r.assigned_osca_id, assignedOscoOne)

      return {
        id: r.id,
        // ✅ make sure “Application Unknown” becomes the issuance name
        message: `${seniorName} applied for ${issuanceName}`,
        timeLabel: formatTimeLabel(r.created_at),
        reviewState,
        // ✅ replace “Edited by Staff Divina…”
        assignedLabel,
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



onMounted(() => fetchApplyingSeniors())

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

function prettyType(a: ActivityItem) {
  // ✅ line should be: Assigned label • review label
  const reviewLabel = a.reviewState === 'not_reviewed' ? 'Not reviewed yet' : 'Currently reviewing'
  return `${a.assignedLabel} • ${reviewLabel}`
}

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/barangay/dashboard', icon: DashboardIcon },
  { label: 'List', to: '/barangay/management', icon: BarangaysIcon },
  { label: 'Seniors', to: '/barangay/users', icon: ApplicationIcon },
  { label: 'Message', to: '/barangay/message', icon: ActivityIcon },
  { label: 'Announcement', to: '/barangay/announcement', icon: AnnouncementIcon },
]
</script>