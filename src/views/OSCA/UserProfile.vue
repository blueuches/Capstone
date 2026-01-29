<!-- views/OSCA/UserProfile.vue -->
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

      <!-- Back -->
      <div class="flex items-center justify-between mt-2 ml-3 mr-3 mb-2 shrink-0">
        <RouterLink
          to="/osca/dashboard"
          class="inline-flex items-center gap-2 text-gray-700 hover:text-[#42ad43] group shrink-0"
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
      </div>

      <!-- Main (no page overflow; cards fit; right panel scrolls) -->
      <main class="flex-1 overflow-hidden">
        <div class="px-4 sm:px-8 py-4 h-full">
          <section class="w-full max-w-6xl mx-auto h-full flex flex-col min-h-0">
            <!-- Avatar -->
            <div class="flex flex-col items-center shrink-0">

              <h2 class="mt-3 text-lg font-extrabold text-gray-900">
                {{ displayName }}
              </h2>
              <p class="text-sm text-gray-500 mt-0.5">Senior Applicant</p>
            </div>

            <!-- Loading / Error -->
            <div v-if="loading" class="mt-4 text-center text-gray-500">
              Loading profile…
            </div>

            <div v-else-if="error" class="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {{ error }}
            </div>

            <!-- Content -->
            <div v-else class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
              <!-- LEFT: Profile Info -->
              <div class="rounded-xl shadow-sm border-4 overflow-hidden self-start" :style="{ borderColor: brand }">
                <div class="px-5 py-4" :style="{ backgroundColor: brand }">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-10">
                    <div class="space-y-3 text-white font-semibold">
                      <div class="flex items-baseline justify-between gap-4">
                        <span class="font-extrabold">First Name</span>
                        <span class="opacity-95 truncate">{{ safe(userProfile.first_name) }}</span>
                      </div>

                      <div class="flex items-baseline justify-between gap-4">
                        <span class="font-extrabold">Middle Name</span>
                        <span class="opacity-95 truncate">{{ safe(userProfile.middle_name) }}</span>
                      </div>

                      <div class="flex items-baseline justify-between gap-4">
                        <span class="font-extrabold">Last Name</span>
                        <span class="opacity-95 truncate">{{ safe(userProfile.last_name) }}</span>
                      </div>

                      <div class="flex items-baseline justify-between gap-4">
                        <span class="font-extrabold">Gender</span>
                        <span class="opacity-95 truncate">{{ safe(userProfile.gender) }}</span>
                      </div>
                    </div>

                    <div class="space-y-3 text-white font-semibold">
                      <div class="flex items-baseline justify-between gap-4">
                        <span class="font-extrabold">Birthdate</span>
                        <span class="opacity-95 truncate">{{ formatDate(userProfile.birthdate) }}</span>
                      </div>

                      <div class="flex items-baseline justify-between gap-4">
                        <span class="font-extrabold">Contact No</span>
                        <span class="opacity-95 truncate">{{ safe(userProfile.contact_no) }}</span>
                      </div>

                      <div class="flex items-baseline justify-between gap-4">
                        <span class="font-extrabold">Role</span>
                        <span class="opacity-95 truncate">{{ safe(userProfile.role) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- RIGHT: Applications (internal scroll; no overflow) -->
              <div class="rounded-xl border bg-white shadow-sm overflow-hidden flex flex-col min-h-0">
                <div class="px-4 py-3 border-b bg-gray-50 flex items-center justify-between shrink-0">
                  <h3 class="text-base font-extrabold text-gray-900">Applications</h3>
                  <span class="text-xs font-semibold text-gray-500">{{ applications.length }} total</span>
                </div>

                <div class="p-4 flex-1 min-h-0 overflow-y-auto space-y-3">
                  <div v-if="applications.length === 0" class="rounded-xl border bg-white p-4 text-gray-600">
                    No application yet
                  </div>

                  <div
                    v-else
                    v-for="a in applications"
                    :key="a.id"
                    class="rounded-xl border bg-white p-4 shadow-sm"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <div class="font-extrabold text-gray-900 truncate">
                          {{ a.issuance?.name ?? 'Unknown Issuance' }}
                        </div>
                        <div class="text-sm text-gray-500 mt-0.5">
                          Barangay:
                          <span class="font-semibold text-gray-700">
                            {{ a.barangay?.name ?? '—' }}
                          </span>
                        </div>
                      </div>

                      <div class="shrink-0 text-right">
                        <div
                          class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold"
                          :class="statusPillClass(a.status)"
                        >
                          {{ a.status }}
                        </div>
                      </div>
                    </div>

                    <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div class="text-gray-600">
                        <span class="font-semibold text-gray-800">Created:</span>
                        {{ formatDateTime(a.created_at) }}
                      </div>
                      <div class="text-gray-600">
                        <span class="font-semibold text-gray-800">Submitted:</span>
                        {{ a.submitted_at ? formatDateTime(a.submitted_at) : '—' }}
                      </div>

                      <div class="text-gray-600 sm:col-span-2">
                        <span class="font-semibold text-gray-800">Assigned OSCA:</span>
                        {{ assignedOscaName(a.assigned_osca) }}
                      </div>
                    </div>

                    <div class="mt-3 flex justify-end">
                      <RouterLink
                        :to="{ name: 'ApplicantReview', params: { applicationId: a.id } }"
                        class="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-white
                              hover:brightness-105 active:brightness-95 transition"
                        :style="{ backgroundColor: brand }"
                      >
                        View
                        <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6" />
                        </svg>
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/Header.vue'
import { supabase } from '@/supabase/client'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

const brand = '#42ad43'
const sidebarCollapsed = ref(false)

const route = useRoute()
const profileId = computed(() => String(route.params.profileId ?? '').trim())

const loading = ref(true)
const error = ref<string | null>(null)

type ProfileRow = {
  id: string
  role: string
  barangay_id?: string | null
  first_name: string
  middle_name?: string | null
  last_name: string
  birthdate?: string | null
  gender?: string | null
  contact_no?: string | null
}

type MaybeMany<T> = T | T[] | null

type ApplicationRowFromDB = {
  id: string
  status: string
  created_at: string
  submitted_at: string | null
  issuance: MaybeMany<{ name: string }>
  barangay: MaybeMany<{ name: string }>
  assigned_osca: MaybeMany<{ first_name: string | null; last_name: string | null }>
}

type ApplicationRow = {
  id: string
  status: string
  created_at: string
  submitted_at: string | null
  issuance: { name: string } | null
  barangay: { name: string } | null
  assigned_osca: { first_name: string | null; last_name: string | null } | null
}

function one<T>(v: T | T[] | null | undefined): T | null {
  if (!v) return null
  return Array.isArray(v) ? (v[0] ?? null) : v
}

const userProfile = ref<ProfileRow>({
  id: '',
  role: '',
  first_name: '',
  last_name: ''
})

const applications = ref<ApplicationRow[]>([])

const displayName = computed(() => {
  const x = userProfile.value
  const full = [x?.first_name, x?.last_name].filter(Boolean).join(' ').trim()
  return full || 'Unknown User'
})

function safe(v: any) {
  const s = String(v ?? '').trim()
  return s.length ? s : '—'
}

function formatDate(v: any) {
  if (!v) return '—'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return safe(v)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

function formatDateTime(v: any) {
  if (!v) return '—'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return safe(v)
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function assignedOscaName(o: any) {
  if (!o) return 'Unassigned'
  const full = [o?.first_name, o?.last_name].filter(Boolean).join(' ').trim()
  return full || 'Unassigned'
}

function statusPillClass(status: string) {
  const s = String(status || '').toLowerCase()
  if (s === 'approved' || s === 'released') return 'bg-green-100 text-green-800'
  if (s === 'rejected') return 'bg-red-100 text-red-800'
  if (s === 'needs_correction') return 'bg-amber-100 text-amber-800'
  if (s === 'under_review') return 'bg-blue-100 text-blue-800'
  if (s === 'submitted') return 'bg-purple-100 text-purple-800'
  return 'bg-gray-100 text-gray-800'
}

async function fetchProfileAndApps() {
  loading.value = true
  error.value = null

  try {
    const id = profileId.value
    if (!id) throw new Error('Missing profileId in route.')

    // Profile
    const { data: prof, error: profErr } = await supabase
      .from('profiles')
      .select('id, role, barangay_id, first_name, middle_name, last_name, birthdate, gender, contact_no')
      .eq('id', id)
      .single()

    if (profErr) throw profErr
    userProfile.value = prof as ProfileRow

    // Applications (joined)
    const { data: apps, error: appsErr } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        created_at,
        submitted_at,
        issuance:issuance_types!applications_issuance_type_id_fkey ( name ),
        barangay:barangays!applications_barangay_id_fkey ( name ),
        assigned_osca:profiles!applications_assigned_osca_id_fkey ( first_name, last_name )
      `)
      .eq('senior_id', id)
      .order('created_at', { ascending: false })

    if (appsErr) throw appsErr

    const rows = (apps ?? []) as ApplicationRowFromDB[]

    applications.value = rows.map((r) => ({
      id: r.id,
      status: r.status,
      created_at: r.created_at,
      submitted_at: r.submitted_at,
      issuance: one(r.issuance),
      barangay: one(r.barangay),
      assigned_osca: one(r.assigned_osca)
    }))

    // Debug (optional)
    // console.log('apps raw:', rows)
    // console.log('apps normalized:', applications.value)
  } catch (e: any) {
    error.value = e?.message ?? 'Failed to load user profile.'
    applications.value = []
  } finally {
    loading.value = false
  }
}

// ✅ One watcher handles initial + param changes
watch(
  profileId,
  () => {
    fetchProfileAndApps()
  },
  { immediate: true }
)

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/osca/dashboard', icon: DashboardIcon },
  { label: 'Barangays', to: '/osca/barangays', icon: BarangaysIcon },
  { label: 'Application', to: '/osca/programs', icon: ApplicationIcon },
  { label: 'Activity', to: '/osca/activity', icon: ActivityIcon },
  { label: 'Announcement', to: '/osca/announcement', icon: AnnouncementIcon }
]
</script>
