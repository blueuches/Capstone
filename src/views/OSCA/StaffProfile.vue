<!-- views/Staff/OSCA/ProfilePage.vue -->
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
        :showSearch="false"
        :notificationCount="3"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
      />

      <main class="flex-1 overflow-y-auto">
        <div class="px-4 sm:px-8 py-6">
          <div class="w-full flex justify-center">
            <section class="w-full max-w-xl">

              <!-- Avatar -->
              <div class="flex flex-col items-center">
                <div
                  class="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center shadow-sm"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="w-20 h-20 text-gray-500"
                    fill="currentColor"
                  >
                    <path
                      d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2
                         7 4.239 7 7s2.239 5 5 5zm0 2
                         c-4.418 0-8 2.239-8 5v1h16v-1
                         c0-2.761-3.582-5-8-5z"
                    />
                  </svg>
                </div>

                <h2 class="mt-4 text-lg font-extrabold text-gray-900">
                  {{ staffName }}
                </h2>

                <p class="text-sm text-gray-500 mt-0.5">
                  OSCA Staff
                </p>

                <RouterLink
                  :to="`/osca/profile/edit/${id}`"
                  class="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg
                         font-bold text-white hover:brightness-105
                         active:brightness-95 transition"
                  :style="{ backgroundColor: brand }"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.862 3.487a2.1 2.1 0 0 1
                         2.97 2.97L8.25 18.04
                         4 19l.96-4.25
                         11.902-11.263z"
                    />
                  </svg>
                  Edit Profile
                </RouterLink>
              </div>

              <!-- Info Panel -->
              <div
                class="mt-5 rounded-xl shadow-sm border-4 overflow-hidden"
                :style="{ borderColor: brand }"
              >
                <div
                  class="px-5 py-4"
                  :style="{ backgroundColor: brand }"
                >
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-10">

                    <!-- Left -->
                    <div class="space-y-3 text-white font-semibold">
                      <InfoRow label="First Name" :value="p.first_name" />
                      <InfoRow label="Middle Name" :value="p.middle_name" />
                      <InfoRow label="Last Name" :value="p.last_name" />
                      <InfoRow label="Gender" :value="p.gender" />
                    </div>

                    <!-- Right -->
                    <div class="space-y-3 text-white font-semibold">
                      <InfoRow
                        label="Birthdate"
                        :value="formatDate(p.birthdate)"
                      />
                      <InfoRow
                        label="Contact No"
                        :value="p.contact_no ?? p.phone ?? p.mobile_no"
                      />
                      <InfoRow label="Email" :value="p.email" />
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
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '@/supabase/client'

import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/Header.vue'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

/* -------------------------
   Route props
-------------------------- */
const props = defineProps<{ id: string }>()
const id = props.id

/* -------------------------
   State
-------------------------- */
const brand = '#42ad43'
const sidebarCollapsed = ref(false)
const staffProfile = ref<any>(null)
const loading = ref(false)

/* -------------------------
   Fetch profile by ID
-------------------------- */
async function fetchProfileById(profileId: string) {
  loading.value = true

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single()

  loading.value = false

  if (error) {
    console.error('Failed to load profile:', error)
    staffProfile.value = null
    return
  }

  staffProfile.value = data
}

onMounted(() => {
  fetchProfileById(id)
})

watch(
  () => id,
  (newId) => {
    if (newId) fetchProfileById(newId)
  }
)

/* -------------------------
   Computed
-------------------------- */
const p = computed(() => staffProfile.value ?? {})

const staffName = computed(() => {
  const x = p.value
  return [x?.first_name, x?.last_name].filter(Boolean).join(' ') || '—'
})

/* -------------------------
   Helpers
-------------------------- */
function safe(v: any) {
  const s = String(v ?? '').trim()
  return s.length ? s : '—'
}

function formatDate(v: any) {
  if (!v) return '—'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return safe(v)
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
}

/* -------------------------
   Sidebar
-------------------------- */
const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/osca/dashboard', icon: DashboardIcon },
  { label: 'Barangays', to: '/osca/barangays', icon: BarangaysIcon },
  { label: 'Application', to: '/osca/programs', icon: ApplicationIcon },
  { label: 'Activity', to: '/osca/activity', icon: ActivityIcon },
  { label: 'Announcement', to: '/osca/announcement', icon: AnnouncementIcon }
]
</script>

<!-- Small helper component -->
<script lang="ts">
export default {
  components: {
    InfoRow: {
      props: {
        label: String,
        value: [String, Number]
      },
      template: `
        <div class="flex items-baseline justify-between gap-4">
          <span class="font-extrabold">{{ label }}</span>
          <span class="opacity-95 truncate">
            {{ value ?? '—' }}
          </span>
        </div>
      `
    }
  }
}
</script>
