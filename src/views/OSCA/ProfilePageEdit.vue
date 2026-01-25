<!-- views/Staff/OSCA/EditProfilePage.vue -->
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
          <div class="max-w-2xl mx-auto">
            <!-- Top bar -->
            <div class="flex items-center justify-between mb-4">
              <div>
                <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900">Edit Profile</h1>
                <p class="text-sm text-gray-500 mt-1">Update your personal information.</p>
              </div>

              <RouterLink
                to="/osca/profile"
                class="px-4 py-2 rounded-lg font-bold border border-gray-300 text-gray-700
                       hover:bg-gray-100 active:bg-gray-200 transition"
              >
                Cancel
              </RouterLink>
            </div>

            <!-- Form card -->
            <section class="bg-white rounded-2xl shadow-sm border-4 overflow-hidden"
                     :style="{ borderColor: brand }">
              <div class="px-5 py-4 text-white font-extrabold"
                   :style="{ backgroundColor: brand }">
                Profile Details
              </div>

              <form class="p-5 sm:p-6 space-y-5" @submit.prevent="onSave">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First Name" required>
                    <input v-model="form.first_name" type="text" class="input" placeholder="Enter first name" />
                  </Field>

                  <Field label="Middle Name">
                    <input v-model="form.middle_name" type="text" class="input" placeholder="Enter middle name" />
                  </Field>

                  <Field label="Last Name" required>
                    <input v-model="form.last_name" type="text" class="input" placeholder="Enter last name" />
                  </Field>

                  <Field label="Gender">
                    <select v-model="form.gender" class="input">
                      <option value="">Select…</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </Field>

                  <Field label="Birthdate">
                    <input v-model="form.birthdate" type="date" class="input" />
                  </Field>

                  <Field label="Contact No">
                    <input v-model="form.contact_no" type="tel" class="input" placeholder="09xxxxxxxxx" />
                  </Field>
                </div>

                <!-- Actions -->
                <div class="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    class="px-4 py-2 rounded-lg font-bold border border-gray-300 text-gray-700
                           hover:bg-gray-100 active:bg-gray-200 transition"
                    @click="resetForm"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    class="px-5 py-2 rounded-lg font-extrabold text-white
                           hover:brightness-105 active:brightness-95 transition"
                    :style="{ backgroundColor: brand }"
                    :disabled="saveDisabled"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref } from 'vue'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/Header.vue'
import { useAuth } from '@/composables/useAuth'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

const brand = '#42ad43'
const sidebarCollapsed = ref(false)

const { profile } = useAuth()
const p = computed(() => (profile.value as any) ?? {})

type FormState = {
  first_name: string
  middle_name: string
  last_name: string
  gender: string
  birthdate: string
  contact_no: string
  email: string
}

const form = ref<FormState>({
  first_name: '',
  middle_name: '',
  last_name: '',
  gender: '',
  birthdate: '',
  contact_no: '',
  email: ''
})

function toDateInput(v: any) {
  if (!v) return ''
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return ''
  // YYYY-MM-DD
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function loadFromProfile() {
  const x = p.value
  form.value = {
    first_name: String(x?.first_name ?? ''),
    middle_name: String(x?.middle_name ?? ''),
    last_name: String(x?.last_name ?? ''),
    gender: String(x?.gender ?? ''),
    birthdate: toDateInput(x?.birthdate),
    contact_no: String(x?.contact_no ?? x?.phone ?? x?.mobile_no ?? ''),
    email: String(x?.email ?? '')
  }
}

loadFromProfile()

function resetForm() {
  loadFromProfile()
}

const saveDisabled = computed(() => {
  if (!form.value.first_name.trim()) return true
  if (!form.value.last_name.trim()) return true
  return false
})

function onSave() {
  // Not wired yet
  console.log('SAVE PROFILE (stub):', { ...form.value })
}

/** Tiny local Field component (so we don’t create new files) */
const Field = (props: { label: string; required?: boolean; hint?: string }, ctx: any) => {
  return h('div', {}, [
    h('label', { class: 'block text-sm font-bold text-gray-800 mb-1' }, [
      props.label,
      props.required ? h('span', { class: 'text-red-500 ml-1' }, '*') : null
    ]),
    ctx.slots.default?.(),
    props.hint ? h('p', { class: 'mt-1 text-xs text-gray-500' }, props.hint) : null
  ])
}

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/osca/dashboard', icon: DashboardIcon },
  { label: 'Barangays', to: '/osca/barangays', icon: BarangaysIcon },
  { label: 'Application', to: '/osca/programs', icon: ApplicationIcon },
  { label: 'Activity', to: '/osca/activity', icon: ActivityIcon },
  { label: 'Announcement', to: '/osca/announcement', icon: AnnouncementIcon }
]
</script>

<style scoped>
.input {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgb(209 213 219); /* gray-300 */
  background: white;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
}
.input:focus {
  box-shadow: 0 0 0 3px rgba(66, 173, 67, 0.25);
  border-color: rgba(66, 173, 67, 0.8);
}
textarea.input {
  height: auto;
  padding: 10px 12px;
}
</style>
