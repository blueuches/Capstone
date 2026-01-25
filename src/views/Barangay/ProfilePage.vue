<!-- views/Staff/OSCA/ProfilePage.vue -->
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
          <!-- Center container -->
          <div class="w-full flex justify-center">
            <section class="w-full max-w-xl">
              <!-- Avatar + label -->
              <div class="flex flex-col items-center">
                <div class="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
                  <!-- simple user icon -->
                  <svg viewBox="0 0 24 24" class="w-20 h-20 text-gray-500" fill="currentColor" aria-hidden="true">
                    <path
                      d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                    />
                  </svg>
                </div>

                <h2 class="mt-4 text-lg font-extrabold text-gray-900">{{ staffName }}</h2>
                <p class="text-sm text-gray-500 mt-0.5">
                  Barangay {{ profile?.barangays?.name }} Staff
                </p>

                              <RouterLink
                to="/barangay/profile/edit"
                class="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white
                      hover:brightness-105 active:brightness-95 transition"
                :style="{ backgroundColor: brand }"
              >
                <!-- pencil icon -->
                <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.862 3.487a2.1 2.1 0 0 1 2.97 2.97L8.25 18.04 4 19l.96-4.25L16.862 3.487z" />
                </svg>
                Edit Profile
              </RouterLink>
              </div>

              <!-- Green info panel (prototype-like) -->
              <div
                class="mt-5 rounded-xl shadow-sm border-4 overflow-hidden"
                :style="{ borderColor: brand }"
              >
                <div class="px-5 py-4" :style="{ backgroundColor: brand }">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-10">
                    <!-- Left column -->
                    <div class="space-y-3 text-white font-semibold">
                      <div class="flex items-baseline justify-between gap-4">
                        <span class="font-extrabold">First Name</span>
                        <span class="opacity-95 truncate">{{ safe(p.first_name) }}</span>
                      </div>

                      <div class="flex items-baseline justify-between gap-4">
                        <span class="font-extrabold">Middle Name</span>
                        <span class="opacity-95 truncate">{{ safe(p.middle_name) }}</span>
                      </div>

                      <div class="flex items-baseline justify-between gap-4">
                        <span class="font-extrabold">Last Name</span>
                        <span class="opacity-95 truncate">{{ safe(p.last_name) }}</span>
                      </div>

                      <div class="flex items-baseline justify-between gap-4">
                        <span class="font-extrabold">Gender</span>
                        <span class="opacity-95 truncate">{{ safe(p.gender) }}</span>
                      </div>
                    </div>

                    <!-- Right column -->
                    <div class="space-y-3 text-white font-semibold">
                      <div class="flex items-baseline justify-between gap-4">
                        <span class="font-extrabold">Birthdate</span>
                        <span class="opacity-95 truncate">{{ formatDate(p.birthdate) }}</span>
                      </div>

                      <div class="flex items-baseline justify-between gap-4">
                        <span class="font-extrabold">Contact No</span>
                        <span class="opacity-95 truncate">{{ safe(p.contact_no ?? p.phone ?? p.mobile_no) }}</span>
                      </div>

                      <div class="flex items-baseline justify-between gap-4">
                        <span class="font-extrabold">Email</span>
                        <span class="opacity-95 truncate">{{ safe(p.email) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </section>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/BRGY/Header.vue'
import { useAuth } from '@/composables/useAuth'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

const brand = '#42ad43'

const { profile } = useAuth()
const sidebarCollapsed = ref(false)

const p = computed(() => (profile.value as any) ?? {})

const staffName = computed(() => {
  const x = p.value
  const full = [x?.first_name, x?.last_name].filter(Boolean).join(' ').trim()
  return full || 'Lando Norris'
})

function safe(v: any) {
  const s = String(v ?? '').trim()
  return s.length ? s : '—'
}

function formatDate(v: any) {
  if (!v) return '—'
  // accept ISO string/date-like
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return safe(v)
  // format: MMM DD, YYYY
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/barangay/dashboard', icon: DashboardIcon },
  { label: 'List', to: '/barangay/management', icon: BarangaysIcon },
  { label: 'Seniors', to: '/barangay/users', icon: ApplicationIcon },
  { label: 'Message', to: '/barangay/message', icon: ActivityIcon },
  { label: 'Announcement', to: '/barangay/announcement', icon: AnnouncementIcon },
]
</script>
