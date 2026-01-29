<!-- views/Staff/OSCA/Search.vue -->
<template>
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

      <!-- IMPORTANT: keep the page from growing; results scroll inside the box -->
      <main class="flex-1 overflow-hidden">
        <div class="h-full px-4 sm:px-8 py-6">
          <div class="max-w-3xl mx-auto h-full flex flex-col">
            <!-- Title -->
            <div class="text-center mb-4">
              <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900">Search for keywords</h1>
              <p class="text-sm text-gray-500 mt-1">
                Search seniors, barangays, barangay staff, and issuance types.
              </p>
            </div>

            <!-- Search Box + Filters -->
            <div class="flex flex-col items-center gap-3">
              <!-- Search input -->
              <div class="w-full max-w-xl relative">
                <input
                  v-model="query"
                  type="text"
                  placeholder="Type a name, barangay, staff, or issuance…"
                  class="w-full h-12 rounded-full border-2 px-5 pr-12 text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#42ad43]/30"
                  :style="{ borderColor: brand }"
                  @keydown.enter.prevent="runSearch()"
                />

                <!-- magnifier -->
                <button
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9
                         rounded-full flex items-center justify-center
                         hover:bg-gray-100 active:bg-gray-200 transition"
                  aria-label="Search"
                  @click="runSearch()"
                >
                  <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="#42ad43" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35" />
                    <circle cx="11" cy="11" r="7" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>

              <!-- status row -->
              <div class="w-full max-w-xl flex items-center justify-between text-xs text-gray-500">
                <div>
                  <span v-if="loading">Searching…</span>
                  <span v-else-if="error" class="text-red-600 font-semibold">{{ error }}</span>
                  <span v-else>&nbsp;</span>
                </div>
                <div v-if="!loading && totalShown > 0" class="font-semibold">
                  Showing {{ totalShown }} result{{ totalShown > 1 ? 's' : '' }}
                </div>
              </div>
            </div>

            <!-- Results (scrollable container) -->
            <div class="mt-5 flex justify-center flex-1 min-h-0">
              <div class="w-full max-w-xl min-h-0">
                <div
                  class="rounded-lg border bg-white"
                  :style="{ borderColor: '#e5e7eb' }"
                >
                  <!-- header -->
                  <div class="px-4 py-3 border-b flex items-center justify-between">
                    <div class="text-sm font-extrabold text-gray-900">Results</div>
                    <div class="text-xs text-gray-500">
                      Tip: press <span class="font-semibold">Enter</span> to search
                    </div>
                  </div>

                  <!-- body (SCROLL HERE) -->
                  <div class="max-h-[55vh] overflow-y-auto p-2">
                    <div
                      v-if="!query.trim()"
                      class="text-center text-sm text-gray-500 py-10"
                    >
                      Type something to start searching.
                    </div>

                    <div
                      v-else-if="!loading && results.length === 0"
                      class="text-center text-sm text-gray-500 py-10"
                    >
                      No results found for <span class="font-semibold">“{{ query }}”</span>.
                    </div>

                    <div v-else class="space-y-2">
                      <button
                        v-for="r in results"
                        :key="r.key"
                        type="button"
                        class="w-full rounded-md overflow-hidden border text-left
                               hover:shadow-sm hover:bg-gray-50 active:bg-gray-100 transition"
                        :style="{ borderColor: brand }"
                        @click="openResult(r)"
                      >
                        <div class="flex items-center justify-between">
                          <div
                            class="flex-1 px-3 py-2 text-white font-semibold text-sm"
                            :style="{ backgroundColor: brand }"
                          >
                            <span class="font-extrabold">{{ r.prefix }}</span>
                            <span class="ml-1">{{ r.label }}</span>
                          </div>

                          <div
                            class="px-3 py-2 text-sm font-extrabold bg-white border-l"
                            :style="{ borderColor: brand, color: brand }"
                          >
                            Go to
                          </div>
                        </div>

                        <div v-if="r.subLabel" class="px-3 py-2 text-xs text-gray-600 bg-white">
                          {{ r.subLabel }}
                        </div>
                      </button>
                    </div>
                  </div>

                  <!-- footer -->
                  <div class="px-4 py-2 border-t text-xs text-gray-500">
                    Showing up to {{ LIMIT }} per search. Narrow down keywords for more precise results.
                  </div>
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
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/Header.vue'
import { useAuth } from '@/composables/useAuth'

// ✅ Adjust this import to wherever your supabase client is located
import { supabase } from '@/supabase/client'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

const brand = '#42ad43'
const router = useRouter()
const { profile } = useAuth()

const sidebarCollapsed = ref(false)

const staffName = computed(() => {
  const p = profile.value as any
  const full = [p?.first_name, p?.last_name].filter(Boolean).join(' ').trim()
  return full || 'OSCA Staff'
})

/** Filters */
type FilterValue = 'all' | 'user' | 'barangay' | 'issuance'
const filters: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Users', value: 'user' },
  { label: 'Barangays', value: 'barangay' },
  { label: 'Issuance', value: 'issuance' }
]
const activeFilter = ref<FilterValue>('all')

/** Search state */
const query = ref('')
const loading = ref(false)
const error = ref<string>('')

const LIMIT = 25

type ResultType = 'user' | 'barangay' | 'issuance'
type SearchResult = {
  key: string
  type: ResultType
  prefix: string
  label: string
  subLabel?: string
  // payload ids:
  profileId?: string
  barangayId?: string
  issuanceTypeId?: string
}

const results = ref<SearchResult[]>([])
const totalShown = computed(() => results.value.length)

/** Debounce */
let t: number | null = null
function debounceRun() {
  if (t) window.clearTimeout(t)
  t = window.setTimeout(() => runSearch(), 250)
}
onBeforeUnmount(() => {
  if (t) window.clearTimeout(t)
})

watch(query, () => {
  error.value = ''
  debounceRun()
})

/** Helpers */
function fullName(p: any) {
  return [p?.first_name, p?.middle_name, p?.last_name].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
}

/**
 * Core Search:
 * - Users: profiles(role='senior')
 * - Barangays: barangays(name)
 * - Barangay staff: profiles(role='barangay_staff') + barangays(name) (displayed under Barangays filter too)
 * - Issuance: issuance_types(name)
 *
 * Schema refs: profiles, barangays, issuance_types, applications.
 */
async function runSearch() {
  const q = query.value.trim()
  if (!q) {
    results.value = []
    return
  }

  loading.value = true
  error.value = ''

  try {
    const out: SearchResult[] = []

    const doUsers = activeFilter.value === 'all' || activeFilter.value === 'user'
    const doBarangays = activeFilter.value === 'all' || activeFilter.value === 'barangay'
    const doIssuance = activeFilter.value === 'all' || activeFilter.value === 'issuance'

    // 1) Users (seniors)
    if (doUsers) {
      const { data, error: e } = await supabase
        .from('profiles')
        .select('id, first_name, middle_name, last_name, role')
        .eq('role', 'senior')
        .or(
          [
            `first_name.ilike.%${q}%`,
            `middle_name.ilike.%${q}%`,
            `last_name.ilike.%${q}%`
          ].join(',')
        )
        .limit(LIMIT)

      if (e) throw e

      ;(data ?? []).forEach(p => {
        out.push({
          key: `user:${p.id}`,
          type: 'user',
          prefix: 'User:',
          label: fullName(p) || 'Unknown User',
          subLabel: 'Click to open application (if any) or profile',
          profileId: p.id
        })
      })
    }

    // 2) Barangays by name
    if (doBarangays) {
      const { data, error: e } = await supabase
        .from('barangays')
        .select('id, name')
        .ilike('name', `%${q}%`)
        .limit(LIMIT)

      if (e) throw e

      ;(data ?? []).forEach(b => {
        out.push({
          key: `barangay:${b.id}`,
          type: 'barangay',
          prefix: 'Barangay:',
          label: b.name,
          subLabel: 'Click to view barangay details',
          barangayId: b.id
        })
      })

      // 3) Barangay staff by name (shown as Barangay result too)
      // Needs join to barangays to display barangay name.
      const { data: staff, error: se } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, barangay_id, barangays:barangay_id ( id, name )')
        .eq('role', 'barangay_staff')
        .or([`first_name.ilike.%${q}%`, `last_name.ilike.%${q}%`].join(','))
        .limit(LIMIT)

      if (se) throw se

      ;(staff ?? []).forEach(s => {
        const b = (s as any).barangays
        if (!b?.id) return
        out.push({
          key: `barangay_staff:${s.id}`,
          type: 'barangay',
          prefix: 'Barangay:',
          label: b?.name ?? 'Unknown Barangay',
          subLabel: `Staff: ${[s.first_name, s.last_name].filter(Boolean).join(' ')}`.trim(),
          barangayId: b.id
        })
      })
    }

    // 4) Issuance types
    if (doIssuance) {
      const { data, error: e } = await supabase
        .from('issuance_types')
        .select('id, name, active')
        .eq('active', true)
        .ilike('name', `%${q}%`)
        .limit(LIMIT)

      if (e) throw e

      ;(data ?? []).forEach(it => {
        out.push({
          key: `issuance:${it.id}`,
          type: 'issuance',
          prefix: 'Issuance:',
          label: it.name,
          subLabel: 'Click to view issuance/program details',
          issuanceTypeId: it.id
        })
      })
    }

    // De-dupe by key + keep stable order
    const seen = new Set<string>()
    results.value = out.filter(r => (seen.has(r.key) ? false : (seen.add(r.key), true))).slice(0, LIMIT)
  } catch (err: any) {
    console.error(err)
    error.value = err?.message || 'Search failed. Check console for details.'
    results.value = []
  } finally {
    loading.value = false
  }
}

/** Routing rules per your note */
async function openResult(r: SearchResult) {
  if (r.type === 'barangay' && r.barangayId) {
    router.push({ name: 'barangay-info', params: { barangayId: r.barangayId } })
    return
  }

  if (r.type === 'issuance' && r.issuanceTypeId) {
    router.push({ name: 'issuance-info', params: { issuanceTypeId: r.issuanceTypeId } })
    return
  }

  if (r.type === 'user' && r.profileId) {
    // Check if user has ANY application; if yes go to ApplicantReview using applicationId
    const { data, error: e } = await supabase
      .from('applications')
      .select('id, created_at')
      .eq('senior_id', r.profileId)
      .order('created_at', { ascending: false })
      .limit(1)

    if (e) {
      console.error(e)
      // fallback: go to profile page if something goes wrong
      router.push({ name: 'UserProfile', params: { profileId: r.profileId } })
      return
    }

    const app = data?.[0]
    if (app?.id) {
      router.push({ name: 'ApplicantReview', params: { applicationId: app.id } })
    } else {
      router.push({ name: 'UserProfile', params: { profileId: r.profileId } })
    }
  }
}

/** Sidebar nav */
const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/osca/dashboard', icon: DashboardIcon },
  { label: 'Barangays', to: '/osca/barangays', icon: BarangaysIcon },
  { label: 'Application', to: '/osca/programs', icon: ApplicationIcon },
  { label: 'Activity', to: '/osca/activity', icon: ActivityIcon },
  { label: 'Announcement', to: '/osca/announcement', icon: AnnouncementIcon }
]
</script>