<!-- views/Staff/BRGY/SeniorManagement.vue -->
<template>
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <Sidebar
      :collapsed="sidebarCollapsed"
      :navItems="oscaNavItems"
      footerText="Barangay - CSU © 2026"
    />

    <div class="flex-1 min-w-0 flex flex-col">
      <Header
        :showSearch="false"
        :notificationCount="3"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
      />

      <main class="flex-1 overflow-hidden">
        <div class="h-full px-4 sm:px-6 py-4 flex flex-col">
          <section
            class="bg-white rounded-2xl shadow-sm border-4 flex flex-col max-h-[520px] w-full"
            :style="{ borderColor: brand }"
          >
            <!-- Header bar -->
            <div
              class="px-4 sm:px-6 py-2 border-b-4 rounded-t-xl shrink-0"
              :style="{ borderColor: brand }"
            >
              <div class="flex items-center justify-between gap-3">
                <div
                  class="flex-1 text-center font-extrabold text-white py-2 rounded-lg tracking-wide text-sm sm:text-base"
                  :style="{ backgroundColor: brand }"
                >
                  Information Management List
                </div>

                <button
                  type="button"
                  class="shrink-0 inline-flex items-center justify-center
                         px-4 py-2 rounded-lg text-sm font-extrabold text-white
                         hover:brightness-105 active:brightness-95 transition"
                  :style="{ backgroundColor: brand }"
                  @click="createNewList"
                  :disabled="loading || !barangayId"
                >
                  New List
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="px-3 sm:px-4 py-3 flex-1 min-h-0 flex flex-col">
              <div class="flex-1 min-h-0 overflow-y-auto pr-1">
                <div v-if="loading" class="py-10 text-center text-gray-500">
                  Loading lists…
                </div>

                <div v-else class="space-y-2">
                  <div
                    v-for="l in pagedLists"
                    :key="l.id"
                    class="flex items-center gap-3 border-2 rounded-lg px-3 py-2"
                    :style="{ borderColor: brand }"
                  >
                    <div class="min-w-0 flex-1">
                      <p class="text-gray-800 text-sm font-semibold truncate">
                        {{ l.title }}
                      </p>

                      <p class="text-[11px] text-gray-500">
                        Created by: {{ l.createdByName }} •
                        Updated: {{ formatDateTime(l.updated_at) }}
                      </p>

                      <p class="text-[11px] text-gray-400">
                        Created: {{ formatDateTime(l.created_at) }}
                      </p>
                    </div>

                    <RouterLink
                      :to="`/barangay/management/list/${l.id}`"
                      class="shrink-0 inline-flex items-center justify-center
                             px-3 py-1.5 rounded-md text-sm font-bold text-white
                             hover:brightness-105 active:brightness-95 transition"
                      :style="{ backgroundColor: brand }"
                    >
                      View
                    </RouterLink>
                  </div>

                  <div v-if="lists.length === 0" class="py-10 text-center text-gray-500">
                    No lists yet. Create one using <b>New List</b>.
                  </div>
                </div>
              </div>

              <div class="mt-3 pt-3 border-t shrink-0">
                <Pagination
                  v-model="page"
                  :total-items="lists.length"
                  :page-size="pageSize"
                />
              </div>
            </div>
          </section>

          <p v-if="errorMsg" class="mt-2 text-sm text-red-600">
            {{ errorMsg }}
          </p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/BRGY/Header.vue'
import Pagination from '@/components/Staff/Pagination.vue'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

// ✅ Change this import to your actual supabase client file
import { supabase } from '@/supabase/client'

const brand = '#42ad43'
const sidebarCollapsed = ref(false)
const router = useRouter()

const page = ref(1)
const pageSize = ref(7)

const loading = ref(false)
const errorMsg = ref('')

const barangayId = ref<string | null>(null)
const myProfileId = ref<string | null>(null)

type ListRow = {
  id: string
  title: string
  created_at: string
  updated_at: string
  createdByName: string
}

const lists = ref<ListRow[]>([])

const totalPages = computed(() => Math.max(1, Math.ceil(lists.value.length / pageSize.value)))

const pagedLists = computed(() => {
  const p = Math.min(Math.max(1, page.value), totalPages.value)
  const start = (p - 1) * pageSize.value
  return lists.value.slice(start, start + pageSize.value)
})

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

async function fetchMyProfile() {
  const { data: authData, error: authErr } = await supabase.auth.getUser()
  if (authErr) throw authErr
  const uid = authData.user?.id
  if (!uid) throw new Error('No authenticated user found.')

  myProfileId.value = uid

  const { data: prof, error: profErr } = await supabase
    .from('profiles')
    .select('id, barangay_id, role')
    .eq('id', uid)
    .single()

  if (profErr) throw profErr
  barangayId.value = prof.barangay_id
}

async function fetchLists() {
  if (!barangayId.value) return

  loading.value = true
  errorMsg.value = ''
  try {
    // Join creator profile for name display
    const { data, error } = await supabase
      .from('barangay_lists')
      .select(`
        id,
        title,
        created_at,
        updated_at,
        created_by,
        profiles:created_by ( first_name, middle_name, last_name )
      `)
      .eq('barangay_id', barangayId.value)
      .order('updated_at', { ascending: false })

    if (error) throw error

    lists.value = (data ?? []).map((r: any) => {
      const p = r.profiles
      const name = p
        ? [p.first_name, p.middle_name, p.last_name].filter(Boolean).join(' ')
        : 'Unknown'
      return {
        id: r.id,
        title: r.title,
        created_at: r.created_at,
        updated_at: r.updated_at,
        createdByName: name
      }
    })
  } catch (e: any) {
    errorMsg.value = e?.message ?? 'Failed to load lists.'
  } finally {
    loading.value = false
  }
}

function defaultSheet() {
  return {
    columns: [
      { id: 'name', label: 'Name', type: 'text' },
      { id: 'contact', label: 'Contact', type: 'text' }
    ],
    rows: []
  }
}

async function createNewList() {
  if (!barangayId.value || !myProfileId.value) return
  const title = window.prompt('Enter list title:', 'New List')
  if (!title) return

  try {
    loading.value = true
    const { data, error } = await supabase
      .from('barangay_lists')
      .insert({
        title,
        sheet: defaultSheet(),
        created_by: myProfileId.value,
        barangay_id: barangayId.value
      })
      .select('id')
      .single()

    if (error) throw error
    await router.push(`/barangay/management/list/${data.id}`)
  } catch (e: any) {
    errorMsg.value = e?.message ?? 'Failed to create list.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await fetchMyProfile()
    await fetchLists()
  } catch (e: any) {
    errorMsg.value = e?.message ?? 'Failed to initialize.'
  }
})

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/barangay/dashboard', icon: DashboardIcon },
  { label: 'List', to: '/barangay/management', icon: BarangaysIcon },
  { label: 'Seniors', to: '/barangay/users', icon: ApplicationIcon },
  { label: 'Message', to: '/barangay/message', icon: ActivityIcon },
  { label: 'Announcement', to: '/barangay/announcement', icon: AnnouncementIcon }
]
</script>
