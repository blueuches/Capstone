<template>
  <!-- Entire page locked; only main content scrolls -->
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <!-- Sidebar (fixed height, not scrollable) -->
    <Sidebar
      :collapsed="sidebarCollapsed"
      :navItems="oscaNavItems"
      footerText="OSCA - CSU © 2026"
    />

    <!-- Right side -->
    <div class="flex-1 min-w-0 flex flex-col">
      <Header
        :showSearch="false"
        :notificationCount="3"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
      />

      <!-- Main scroll area -->
      <main class="flex-1 overflow-y-auto">
        <div class="px-4 sm:px-8 py-6">
          <!-- Center area like your prototype -->
          <div class="max-w-5xl mx-auto">
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
              <div class="text-center">
                <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                  Office of
                </h1>
                <h2 class="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                  Senior Citizens Affair
                </h2>

                <p class="mt-6 text-sm sm:text-base text-gray-700">
                  Login Staff:
                  <span class="font-semibold">
                    {{ staffName }}
                  </span>
                </p>

                <!-- Buttons row -->
                <div class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                  <DashboardRectangle label="Review Application" to="/osca/programs" />
                  <DashboardRectangle label="Search for keywords" to="/osca/search" />
                  <DashboardRectangle label="About" to="/osca/about" />
                </div>

                <!-- Small debug / auth info (optional) -->
                <div class="mt-8">
                  <button
                    @click="logout"
                    class="mt-3 inline-flex items-center justify-center px-4 py-2 rounded-xl
                           border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100
                           text-sm font-semibold text-gray-700 transition"
                  >
                    Logout
                  </button>
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
import DashboardRectangle from '@/components/Staff/DashboardRectangle.vue'
import { useAuth } from '@/composables/useAuth'
import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

const { logout, profile } = useAuth()

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
  { label: 'Announcement', to: '/osca/announcement', icon: AnnouncementIcon },
]


</script>