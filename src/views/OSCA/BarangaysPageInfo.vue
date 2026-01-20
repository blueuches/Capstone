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

      <!-- Back -->
      <RouterLink
        to="/osca/barangays"
        class="inline-flex items-center gap-2
              text-gray-700 hover:text-[#42ad43]
              mt-2 ml-3 group w-fit"
      >
        <span
          class="shrink-0 w-7 h-7 rounded-full bg-[#42ad43]
                flex items-center justify-center text-white
                transition group-hover:brightness-105"
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

      <main class="flex-1 overflow-y-auto">
        <div class="px-4 sm:px-8 py-6">
          <!-- Top row: Barangay name + Send Message -->
          <div class="flex items-center justify-between gap-4 mb-5">
            <div class="min-w-0">
              <h1 class="text-lg sm:text-2xl font-extrabold text-gray-900 truncate">
                Barangay {{ barangayName }}
              </h1>
            </div>

            <!-- Send Message link (adjust route name if you already have one) -->
            <RouterLink
              :to="`/osca/barangay/message/${barangayId}`"
              class="text-sm font-bold text-gray-900 hover:text-[#42ad43]
                     underline underline-offset-4"
            >
              Send Message &gt;
            </RouterLink>
          </div>

          <!-- Cards (3 columns on wide screens, stack on mobile) -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!-- 1) Seniors Applying -->
            <BarangayInfoCard
              title="Seniors Applying"
              :barangayId="barangayId"
              :roles="['senior']"
              :pageSize="10"
              emptyText="No records yet"
              rowToName="ApplicantReview"
              rowParamKey="seniorId"
              :debug="true"
            />

            <!-- 2) All Users -->
            <BarangayInfoCard
              title="All Users"
              :barangayId="barangayId"
              :roles="['senior']" 
              :pageSize="10"
              emptyText="No records yet"
              rowToName="ApplicantReview"
              rowParamKey="seniorId"
              :debug="true"
            />

            <!-- 3) Staff -->
            <BarangayInfoCard
              title="Staff"
              :barangayId="barangayId"
              :roles="['barangay_staff']"
              :pageSize="10"
              emptyText="No records yet"
              rowToName="BRGYProfile"
              rowParamKey="staffId"
              :debug="true"
            />
          </div>

          <!-- Note:
               Replace the rowToName + param keys above with YOUR actual route names.
               I put placeholders so the arrows really route somewhere once you align them.
          -->
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/Header.vue'
import BarangayInfoCard from '@/components/Staff/OSCA/BarangayInfoCard.vue'

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

const route = useRoute()
const barangayId = computed(() => String(route.params.barangayId || ''))

const barangayName = ref('')

onMounted(async () => {
  if (!barangayId.value) return

  // get barangay name by id
  const { data, error } = await supabase
    .from('barangays')
    .select('name')
    .eq('id', barangayId.value)
    .single()

  if (error) {
    console.error('Failed to load barangay name:', error)
    barangayName.value = barangayId.value // fallback
    return
  }

  barangayName.value = data?.name ?? barangayId.value
})
</script>
