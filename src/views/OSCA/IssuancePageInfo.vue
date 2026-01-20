<template>
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <Sidebar
      :collapsed="sidebarCollapsed"
      :navItems="oscaNavItems"
      footerText="OSCA - CSU © 2026"
    />

    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <Header
        :showSearch="false"
        :notificationCount="3"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
      />

      <!-- Back -->
      <RouterLink
        to="/osca/programs"
        class="inline-flex items-center gap-2
              text-gray-700 hover:text-[#42ad43]
              mt-2 ml-3 group w-fit"
      >
        <span
          class="shrink-0 w-7 h-7 rounded-full bg-[#42ad43]
                flex items-center justify-center text-white
                transition group-hover:bg-[#369a3a]"
          aria-hidden="true"
        >
          <svg
            class="w-4 h-4 -rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>

        <span class="text-sm font-semibold">Back</span>
      </RouterLink>

      <!-- Fixed page (no main scroll). We make the "table card" smaller so pagination is visible. -->
      <main class="flex-1 overflow-hidden">
        <div class="h-full px-4 sm:px-8 py-6 flex flex-col gap-3">
          <!-- Compact card so it fits the screen -->
          <section class="w-full">
            <div
              class="bg-white rounded-2xl border-4 border-[#42ad43]
                     overflow-hidden flex flex-col max-h-[520px] w-full"
            >
              <!-- Header -->
              <div class="bg-[#42ad43] text-white px-3 py-2 shrink-0">
                <p class="text-center font-extrabold text-sm tracking-wide">
                  {{ issuanceTypeName }} List of Applicants
                </p>
              </div>

              <!-- Rows (no scroll; card height ensures pagination is visible) -->
              <div class="flex-1 overflow-hidden divide-y divide-gray-100">
                <div
                  v-for="row in pagedRows"
                  :key="row.id"
                  class="flex items-center justify-between gap-2 px-3 py-2"
                >
                  <p class="text-sm font-semibold text-gray-900 truncate">
                    {{ row.primary }}
                  </p>

                  <p class="text-[11px] sm:text-xs text-gray-700 whitespace-nowrap">
                    {{ row.status }}
                  </p>

                  <button
                    type="button"
                    class="shrink-0 bg-[#42ad43] text-white font-bold text-[10px]
                           px-2.5 py-1.5 rounded-md hover:brightness-105 active:brightness-95 transition"
                    @click="onReview(row)"
                  >
                    Review
                  </button>
                </div>

                <div
                  v-if="pagedRows.length === 0"
                  class="px-3 py-6 text-center text-sm text-gray-500"
                >
                  No applicants found.
                </div>
              </div>

              <!-- Pagination always visible -->
              <div class="px-3 py-2 bg-white border-t border-gray-100 shrink-0">
                <Pagination
                  v-model="page"
                  :total-items="rows.length"
                  :page-size="pageSize"
                  @change="page = $event"
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
import { computed, ref, onMounted, watch } from 'vue'
import { supabase } from '@/supabase/client'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/Header.vue'
import Pagination from '@/components/Staff/Pagination.vue'
import { useAuth } from '@/composables/useAuth'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

const { profile } = useAuth()
const sidebarCollapsed = ref(false)

const staffName = computed(() => {
  const p = profile.value as any
  const full = [p?.first_name, p?.last_name].filter(Boolean).join(' ').trim()
  return full || 'Lando Norris'
})

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/osca/dashboard', icon: DashboardIcon },
  { label: 'Barangays', to: '/osca/barangays', icon: BarangaysIcon },
  { label: 'Application', to: '/osca/programs', icon: ApplicationIcon },
  { label: 'Activity', to: '/osca/activity', icon: ActivityIcon },
  { label: 'Announcement', to: '/osca/announcement', icon: AnnouncementIcon }
]

// Route: /osca/programView/:issuanceTypeId (props:true)
const props = defineProps<{ issuanceTypeId: string }>()
const issuanceTypeId = computed(() => props.issuanceTypeId ?? '')

const issuanceTypeName = ref<string>('Loading...')
const loadingIssuanceName = ref(false)

async function fetchIssuanceTypeName(id: string) {
  if (!id) {
    issuanceTypeName.value = 'Unknown Issuance Type'
    return
  }

  loadingIssuanceName.value = true
  try {
    const { data, error } = await supabase
      .from('issuance_types')
      .select('name')
      .eq('id', id)
      .single()

    if (error) throw error
    issuanceTypeName.value = data?.name || 'Unknown Issuance Type'
  } catch (e) {
    console.error('Failed to fetch issuance type name:', e)
    issuanceTypeName.value = 'Unknown Issuance Type'
  } finally {
    loadingIssuanceName.value = false
  }
}

onMounted(() => {
  fetchIssuanceTypeName(issuanceTypeId.value)
})

watch(issuanceTypeId, (newId, oldId) => {
  if (newId && newId !== oldId) fetchIssuanceTypeName(newId)
})

type Row = { id: string; primary: string; status: string }

// Placeholder rows (replace with Supabase later)
const rows = ref<Row[]>([
  { id: 'a1', primary: 'User A from Barangay Ampayon', status: 'Completed' },
  { id: 'a2', primary: 'User B from Barangay Taguibo', status: 'Needs Correction' },
  { id: 'a3', primary: 'User B from Barangay Taguibo', status: 'Draft' },
  { id: 'a4', primary: 'User B from Barangay Taguibo', status: 'Completed' },
  { id: 'a5', primary: 'User B from Barangay Taguibo', status: 'Needs Correction' },
  { id: 'a6', primary: 'User B from Barangay Taguibo', status: 'Completed' },
  { id: 'a7', primary: 'User B from Barangay Taguibo', status: 'Completed' },
  { id: 'a8', primary: 'User C from Barangay Ampayon', status: 'Draft' },
  { id: 'a9', primary: 'User D from Barangay Libertad', status: 'Completed' },
  { id: 'a10', primary: 'User E from Barangay Bayanihan', status: 'Needs Correction' }
])

// Pagination state
const page = ref(1)
// Smaller page size so it fits better inside the compact card
const pageSize = ref(6)

const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return rows.value.slice(start, start + pageSize.value)
})

function onReview(row: Row) {
  console.log('Review Now:', row, 'issuanceTypeId:', issuanceTypeId.value)
  // later: route to review page
}
</script>
