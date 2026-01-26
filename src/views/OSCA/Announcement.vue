<!-- views/Staff/OSCA/Announcement.vue -->
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

      <main class="flex-1 overflow-hidden">
        <div class="h-full px-4 sm:px-8 py-6 flex flex-col gap-4">
          <!-- Target buttons -->
          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="px-5 py-2 rounded-lg font-extrabold text-white shadow-sm transition
                     hover:brightness-105 active:brightness-95"
              :class="selectedTarget === 'all_seniors' ? 'bg-[#42ad43]' : 'bg-[#42ad43]/85'"
              @click="selectTarget('all_seniors')"
            >
              All Senior Users
            </button>

            <button
              type="button"
              class="px-5 py-2 rounded-lg font-extrabold text-white shadow-sm transition
                     hover:brightness-105 active:brightness-95"
              :class="selectedTarget === 'barangay' ? 'bg-[#42ad43]' : 'bg-[#42ad43]/85'"
              @click="selectTarget('barangay')"
            >
              Specific Barangay
            </button>

            <button
              type="button"
              class="px-5 py-2 rounded-lg font-extrabold text-white shadow-sm transition
                     hover:brightness-105 active:brightness-95"
              :class="selectedTarget === 'all_barangays' ? 'bg-[#42ad43]' : 'bg-[#42ad43]/85'"
              @click="selectTarget('all_barangays')"
            >
              All Barangays
            </button>
          </div>

          <!-- Composer card (prototype-like) -->
          <section class="bg-white rounded-2xl shadow-sm border-4 flex flex-col min-h-0"
                   :style="{ borderColor: brand }">
            <div class="flex-1 min-h-0 p-4 sm:p-6">
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <!-- Green frame -->
                <div class="lg:col-span-10">
                  <div
                    class="border-4 rounded-xl p-4 sm:p-5"
                    :style="{ borderColor: brand, backgroundColor: 'rgba(66,173,67,0.12)' }"
                  >
                    <!-- Target helper row -->
                    <div class="mb-3 flex flex-wrap items-center gap-2">
                      <span class="text-xs font-bold text-gray-700">Target:</span>

                      <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold text-white"
                        :style="{ backgroundColor: brand }"
                      >
                        {{ targetLabel }}
                      </span>

                      <!-- Only show selector when "Specific Barangay" is chosen -->
                      <div v-if="selectedTarget === 'barangay'" class="flex items-center gap-2 ml-auto">
                        <label class="text-xs font-semibold text-gray-700">Choose barangay:</label>
                        <select
                          v-model="selectedBarangayId"
                          class="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-[#42ad43]/40"
                        >
                          <option disabled value="">Select…</option>
                          <option v-for="b in barangayOptions" :key="b.id" :value="b.id">
                            {{ b.name }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <!-- Title -->
                    <div class="mb-3">
                      <input
                        v-model="title"
                        type="text"
                        placeholder="Title"
                        class="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#42ad43]/40"
                      />
                    </div>

                    <!-- Body -->
                    <div>
                      <textarea
                        v-model="body"
                        placeholder="Message Body"
                        rows="6"
                        class="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm resize-none
                               focus:outline-none focus:ring-2 focus:ring-[#42ad43]/40"
                      />
                    </div>

                    <!-- Expiry -->
                    <div class="mt-3 flex flex-wrap items-center gap-3">
                      <label class="text-xs font-semibold text-gray-700">Expires (optional):</label>
                      <input
                        v-model="expiresAt"
                        type="datetime-local"
                        class="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#42ad43]/40"
                      />
                    </div>
                  </div>
                </div>

                <!-- Send button column -->
                <div class="lg:col-span-2 flex lg:items-center justify-end lg:justify-center">
                  <button
                    type="button"
                    class="w-12 h-12 rounded-xl text-white font-extrabold shadow-sm transition
                           hover:brightness-105 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    :style="{ backgroundColor: brand }"
                    :disabled="sendDisabled"
                    @click="onSend"
                    aria-label="Send announcement"
                    title="Send announcement"
                  >
                    &gt;
                  </button>
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
import { computed, onMounted, ref } from 'vue'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/Header.vue'
import { useAuth } from '@/composables/useAuth'
import { supabase } from '@/supabase/client' // ✅ adjust path if yours is different

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

type UiTarget = 'all_seniors' | 'barangay' | 'all_barangays'

const brand = '#42ad43'
const { profile } = useAuth()

const sidebarCollapsed = ref(false)

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/osca/dashboard', icon: DashboardIcon },
  { label: 'Barangays', to: '/osca/barangays', icon: BarangaysIcon },
  { label: 'Application', to: '/osca/programs', icon: ApplicationIcon },
  { label: 'Activity', to: '/osca/activity', icon: ActivityIcon },
  { label: 'Announcement', to: '/osca/announcement', icon: AnnouncementIcon }
]

/** UI state */
const selectedTarget = ref<UiTarget>('all_seniors')
const title = ref('')
const body = ref('')
const expiresAt = ref<string>('')

/** DB barangays */
type BarangayOption = { id: string; name: string }
const barangayOptions = ref<BarangayOption[]>([])
const selectedBarangayId = ref<string>('')

const sending = ref(false)

function selectTarget(t: UiTarget) {
  selectedTarget.value = t
  if (t !== 'barangay') selectedBarangayId.value = ''
}

const targetLabel = computed(() => {
  if (selectedTarget.value === 'all_seniors') return 'All Senior Users'
  if (selectedTarget.value === 'barangay') return 'Specific Barangay'
  return 'All Barangays'
})

const sendDisabled = computed(() => {
  if (sending.value) return true
  if (!title.value.trim()) return true
  if (!body.value.trim()) return true
  if (selectedTarget.value === 'barangay' && !selectedBarangayId.value) return true
  return false
})

function toIsoOrNull(dtLocal: string): string | null {
  if (!dtLocal) return null
  // datetime-local gives "YYYY-MM-DDTHH:mm" (no timezone)
  // Convert to ISO; browser will interpret as local time.
  const d = new Date(dtLocal)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

async function loadBarangays() {
  const { data, error } = await supabase
    .from('barangays')
    .select('id,name')
    .order('name', { ascending: true })

  if (error) {
    console.error('Failed to load barangays:', error.message)
    barangayOptions.value = []
    return
  }

  barangayOptions.value = (data ?? []).map((b) => ({ id: b.id, name: b.name }))
}

async function onSend() {
  if (sendDisabled.value) return

  sending.value = true
  try {
    // created_by must be a profiles.id (auth.users.id)
    const createdBy = (profile.value as any)?.id
    if (!createdBy) throw new Error('Missing profile.id (created_by). Make sure useAuth loads profile.')

    // 1) insert announcement
    const { data: aRow, error: aErr } = await supabase
      .from('announcements')
      .insert({
        created_by: createdBy,
        title: title.value.trim(),
        body: body.value.trim(),
        expires_at: toIsoOrNull(expiresAt.value)
      })
      .select('id')
      .single()

    if (aErr) throw aErr
    const announcementId = aRow.id as string

    // 2) insert announcement_targets based on your rules + schema enum
    if (selectedTarget.value === 'all_seniors') {
      // announcement_target_type = 'all_seniors'
      const { error } = await supabase.from('announcement_targets').insert({
        announcement_id: announcementId,
        target_type: 'all_seniors'
      })
      if (error) throw error
    } else if (selectedTarget.value === 'barangay') {
      const { error } = await supabase.from('announcement_targets').insert({
        announcement_id: announcementId,
        target_type: 'barangay',
        barangay_id: selectedBarangayId.value
      })
      if (error) throw error
    } else if (selectedTarget.value === 'all_barangays') {
      // You said: "all barangays means that all the user that has role barangay will see it"
      // Your role enum uses 'barangay_staff', so use target_type='role' + role='barangay_staff'
      const { error } = await supabase.from('announcement_targets').insert({
        announcement_id: announcementId,
        target_type: 'role',
        role: 'barangay_staff'
      })
      if (error) throw error
    }

    // reset composer
    title.value = ''
    body.value = ''
    expiresAt.value = ''
    if (selectedTarget.value === 'barangay') selectedBarangayId.value = ''

    console.log('Announcement sent:', { announcementId, target: selectedTarget.value })
  } catch (e: any) {
    console.error('Send failed:', e?.message ?? e)
    alert(`Failed to send announcement: ${e?.message ?? 'Unknown error'}`)
  } finally {
    sending.value = false
  }
}

onMounted(() => {
  loadBarangays()
})
</script>
