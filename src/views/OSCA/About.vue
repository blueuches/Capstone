<!-- views/Staff/OSCA/About.vue -->
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
          <div class="max-w-5xl mx-auto">
            <!-- Title -->
            <div class="text-center mb-6">
              <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900">About</h1>
            </div>

            <!-- Side-by-side cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- OSCA Info -->
              <button
                type="button"
                class="w-full rounded-2xl shadow-sm border-4 overflow-hidden group text-left"
                :style="{ borderColor: brand }"
              >
                <div
                  class="h-28 sm:h-32 flex items-center justify-center"
                  :style="{ backgroundColor: brand }"
                >
                  <div class="text-center">
                    <div class="text-white font-extrabold text-xl sm:text-2xl tracking-wide">
                      OSCA Info
                    </div>
                    <div class="text-white/90 text-xs sm:text-sm mt-1">
                      Mission • Services • Mandate
                    </div>
                  </div>
                </div>

                <div class="px-5 sm:px-6 py-4 bg-white">
                  <p class="text-sm text-gray-600 leading-relaxed">
                    The Office of Senior Citizens Affairs (OSCA) supports senior citizens through
                    registration, ID issuance, and coordination of benefits and services in the community.
                  </p>
                </div>
              </button>

              <!-- CSU - SeniorGo -->
              <button
                type="button"
                class="w-full rounded-2xl shadow-sm border-4 overflow-hidden group text-left"
                :style="{ borderColor: brand }"
              >
                <div
                  class="h-28 sm:h-32 flex items-center justify-center"
                  :style="{ backgroundColor: brand }"
                >
                  <div class="text-center">
                    <div class="text-white font-extrabold text-xl sm:text-2xl tracking-wide">
                      CSU - SeniorGo
                    </div>
                    <div class="text-white/90 text-xs sm:text-sm mt-1">
                      Platform • Purpose • Developers
                    </div>
                  </div>
                </div>

                <div class="px-5 sm:px-6 py-4 bg-white">
                  <p class="text-sm text-gray-600 leading-relaxed">
                    SeniorGo is a digital platform developed with CSU to improve how seniors and staff manage
                    applications, announcements, and service requests—designed for faster processing and clearer tracking.
                  </p>
                </div>
              </button>
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

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/osca/dashboard', icon: DashboardIcon },
  { label: 'Barangays', to: '/osca/barangays', icon: BarangaysIcon },
  { label: 'Application', to: '/osca/programs', icon: ApplicationIcon },
  { label: 'Activity', to: '/osca/activity', icon: ActivityIcon },
  { label: 'Announcement', to: '/osca/announcement', icon: AnnouncementIcon }
]
</script>
