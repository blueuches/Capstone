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

      <main class="flex-1 overflow-y-auto">
        <div class="px-4 sm:px-8 py-6">
          <div class="max-w-3xl mx-auto">
            <!-- Title -->
            <div class="text-center mb-4">
              <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900">Search for keywords</h1>

            </div>

            <!-- Search Box + Filters -->
            <div class="flex flex-col items-center gap-3">
              <!-- Search input -->
              <div class="w-full max-w-xl relative">
                <input
                  v-model="query"
                  type="text"
                  placeholder="Type a name, barangay, or staff…"
                  class="w-full h-12 rounded-full border-2 px-5 pr-12 text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#42ad43]/30"
                  :style="{ borderColor: brand }"
                />

                <!-- magnifier -->
                <button
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9
                         rounded-full flex items-center justify-center
                         hover:bg-gray-100 active:bg-gray-200 transition"
                  aria-label="Search"
                  @click="onSearch"
                >
                  <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="#42ad43" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35" />
                    <circle cx="11" cy="11" r="7" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>

              <!-- Filter chips (suggested UX) -->
              <div class="flex flex-wrap justify-center gap-2">
                <button
                  v-for="f in filters"
                  :key="f.value"
                  type="button"
                  class="px-4 py-2 rounded-full text-sm font-bold border transition
                         hover:bg-gray-50 active:bg-gray-100"
                  :class="activeFilter === f.value ? 'text-white' : 'text-gray-700'"
                  :style="activeFilter === f.value
                    ? { backgroundColor: brand, borderColor: brand }
                    : { borderColor: '#d1d5db' }"
                  @click="activeFilter = f.value"
                >
                  {{ f.label }}
                </button>
              </div>
            </div>

            <!-- Results -->
            <div class="mt-5 flex justify-center">
              <div class="w-full max-w-xl">
                <div v-if="filteredResults.length === 0" class="text-center text-sm text-gray-500 py-8">
                  No results yet. Try typing something like <span class="font-semibold">“Ju”</span>.
                </div>

                <div v-else class="space-y-2">
                  <div
                    v-for="r in filteredResults"
                    :key="r.id"
                    class="w-full rounded-md overflow-hidden border"
                    :style="{ borderColor: brand }"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex-1 px-3 py-2 text-white font-semibold text-sm"
                           :style="{ backgroundColor: brand }">
                        <span class="font-extrabold">{{ r.prefix }}</span>
                        <span class="ml-1">{{ r.label }}</span>
                      </div>

                      <RouterLink
                        :to="r.to"
                        class="px-3 py-2 text-sm font-extrabold bg-white
                               border-l hover:bg-gray-50 active:bg-gray-100 transition"
                        :style="{ borderColor: brand, color: brand }"
                      >
                        Go to
                      </RouterLink>
                    </div>
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
import { computed, ref } from 'vue'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/Header.vue'
import { useAuth } from '@/composables/useAuth'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

const brand = '#42ad43'

const { profile } = useAuth()
const sidebarCollapsed = ref(false)

const staffName = computed(() => {
  const p = profile.value as any
  const full = [p?.first_name, p?.last_name].filter(Boolean).join(' ').trim()
  return full || 'Lando Norris'
})

/** Filters (suggested UX) */
type FilterValue = 'all' | 'user' | 'barangay' | 'staff'
const filters: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Users', value: 'user' },
  { label: 'Barangays', value: 'barangay' },
  { label: 'Staff', value: 'staff' }
]
const activeFilter = ref<FilterValue>('all')

/** Search */
const query = ref('Ju')

type SearchResult = {
  id: string
  type: 'user' | 'barangay' | 'staff'
  prefix: string
  label: string
  to: string
}

/** Placeholder results (replace with Supabase later) */
const allResults = ref<SearchResult[]>([
  { id: 'u-1', type: 'user', prefix: 'User:', label: 'Juan Dela Cruz', to: '/osca/applicant-review/u-1' },
  { id: 'b-1', type: 'barangay', prefix: 'Barangay:', label: 'Juan Luna', to: '/osca/barangays/b-1' },
  { id: 's-1', type: 'staff', prefix: 'Staff:', label: 'Juani', to: '/osca/profile' },
  { id: 'u-2', type: 'user', prefix: 'User:', label: 'Julia Santos', to: '/osca/applicant-review/u-2' },
  { id: 'b-2', type: 'barangay', prefix: 'Barangay:', label: 'Jovellar', to: '/osca/barangays/b-2' }
])

const filteredResults = computed(() => {
  const q = query.value.trim().toLowerCase()
  let base = allResults.value

  if (activeFilter.value !== 'all') {
    base = base.filter(r => r.type === activeFilter.value)
  }
  if (!q) return []

  return base.filter(r => `${r.prefix} ${r.label}`.toLowerCase().includes(q)).slice(0, 8)
})

function onSearch() {
  // stub for now (later call Supabase)
  console.log('Search stub:', { query: query.value, filter: activeFilter.value })
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
