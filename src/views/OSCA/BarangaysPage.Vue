<template>
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <!-- Sidebar -->
    <Sidebar
      :collapsed="sidebarCollapsed"
      :navItems="oscaNavItems"
      footerText="OSCA - CSU © 2026"
    />

    <div class="flex-1 min-w-0 flex flex-col">
      <Header
        :showSearch="true"
        :notificationCount="3"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
      />

      <main class="flex-1 overflow-y-auto">
        <div class="px-4 sm:px-8 py-6">
          <div class="flex items-end justify-between gap-3 mb-5">
            <div>
              <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900">Barangays</h1>
              <p class="text-sm text-gray-500 mt-1">
                Select a barangay to view its records and related requests.
              </p>
            </div>

            <div class="hidden sm:flex items-center gap-2 text-sm">
              <span class="text-gray-500">Total:</span>
              <span class="font-bold text-gray-900">{{ totalItems }}</span>
            </div>
          </div>

          <!-- Grid (matches your prototype vibe) -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <BarangayRectangle
              v-for="b in pagedBarangays"
              :key="b.id"
              :id="b.id"
              :name="b.name"
              toName="barangay-info"
            />
          </div>

          <!-- Pagination -->
          <div class="mt-8">
            <Pagination
              v-model="page"
              :total-items="totalItems"
              :page-size="pageSize"
              :max-buttons="5"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/Header.vue'

import BarangayRectangle from '@/components/Staff/OSCA/BarangayRectangle.vue'
import Pagination from '@/components/Staff/Pagination.vue'

import { supabase } from '@/supabase/client'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

const sidebarCollapsed = ref(false)

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/osca/dashboard', icon: DashboardIcon },
  { label: 'Barangays', to: '/osca/barangays', icon: BarangaysIcon },
  { label: 'Application', to: '/osca/programs', icon: ApplicationIcon },
  { label: 'Activity', to: '/osca/activity', icon: ActivityIcon },
  { label: 'Announcement', to: '/osca/announcement', icon: AnnouncementIcon }
]

type Barangay = { id: string; name: string }

const barangays = ref<Barangay[]>([])
const page = ref(1)
const pageSize = ref(16) // your prototype looks like 4x4 = 16 tiles/page

const totalItems = computed(() => barangays.value.length)

const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

const pagedBarangays = computed(() => {
  // keep page in bounds (important when data loads / filters later)
  if (page.value > totalPages.value) page.value = totalPages.value
  if (page.value < 1) page.value = 1

  const start = (page.value - 1) * pageSize.value
  return barangays.value.slice(start, start + pageSize.value)
})

onMounted(async () => {
  const { data, error } = await supabase
    .from('barangays')
    .select('id,name')
    .order('name', { ascending: true })

  if (error) {
    console.error('Supabase error:', error)
    return
  }

  barangays.value = (data ?? []).map((x: any) => ({
    id: x.id,
    name: x.name
  }))
})

</script>
