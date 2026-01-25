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

      <main class="flex-1 overflow-y-auto">
        <div class="px-4 sm:px-8 py-6">
          <!-- Header -->
          <div class="mb-5">
            <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900">
              Issuance Type
            </h1>
            <p class="text-sm text-gray-500 mt-1">
              Choose an issuance type to view requirements and proceed.
            </p>
          </div>

          <!-- 2x2 grid like prototype -->
          <div class="grid grid-cols-2 gap-4 max-w-3xl">
            <ApplicationRectangle
              v-for="it in issuanceTypes"
              :key="it.id"
              :id="it.id"
              :name="it.name"
              toName="issuance-info"
              topLabel="OSCA ID"
            />
          </div>

          <!-- Optional: subtle empty state -->
          <div
            v-if="!loading && issuanceTypes.length === 0"
            class="mt-6 text-sm text-gray-500"
          >
            No issuance types found.
          </div>

          <div v-if="loading" class="mt-6 text-sm text-gray-500">
            Loading issuance types…
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/Header.vue'
import ApplicationRectangle from '@/components//Staff/OSCA/ApplicationRectangle.vue'

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

type IssuanceType = { id: string; name: string }

const issuanceTypes = ref<IssuanceType[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('issuance_types')
      .select('id,name')
      .order('name', { ascending: true })

    if (error) throw error

    issuanceTypes.value = (data ?? []).map((x: any) => ({
      id: x.id,
      name: x.name
    }))
  } catch (e) {
    console.error('Failed to load issuance_types:', e)
  } finally {
    loading.value = false
  }
})
</script>
