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

            <div class="flex items-center justify-between mt-2 ml-3 mr-3 mb-4">
        <!-- Back -->
        <RouterLink
          to="/osca/programs"
          class="inline-flex items-center gap-2
                 text-gray-700 hover:text-[#42ad43]
                 group shrink-0"
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

        <!-- Page title -->
        <div class="min-w-0 text-right">
          <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
            Review [User A]
          </h1>
        </div>
      </div>

      <main class="flex-1 min-h-0 overflow-y-auto">
        <div class="px-4 sm:px-8 py-6">
          <!-- Two-column layout like prototype -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <!-- LEFT: requirements -->
            <section class="lg:col-span-5  min-h-0">
              <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
                <div class="flex items-center justify-between mb-3">
                  <h2 class="text-sm font-extrabold text-gray-900">
                    Submitted Requirements
                  </h2>

                  <span
                    class="text-[11px] font-extrabold px-2 py-1 rounded-full border"
                    :class="statusStyles.border"
                  >
                    <span :class="statusStyles.dot" class="inline-block w-2 h-2 rounded-full mr-2"></span>
                    <span :class="statusStyles.text">{{ applicationStatusLabel }}</span>
                  </span>
                </div>

                <!-- Requirements list (temporary data) -->
                <div class="space-y-3">
                  <div
                    v-for="req in submittedRequirements"
                    :key="req.id"
                    class="border-2 rounded-xl flex items-center justify-between px-3 py-2"
                    :class="req.missing ? 'border-yellow-400 bg-yellow-50/40' : 'border-[#42ad43] bg-white'"
                  >
                    <div class="min-w-0">
                      <p class="text-xs font-extrabold text-gray-900 truncate">
                        {{ req.label }}
                      </p>
                      <p class="text-[11px] text-gray-500 truncate">
                        {{ req.note }}
                      </p>
                    </div>

                    <button
                      class="shrink-0 ml-3 px-3 py-1.5 rounded-lg text-xs font-extrabold border-2 border-[#42ad43] text-[#42ad43] hover:bg-[#42ad43] hover:text-white transition"
                      @click="viewRequirement(req)"
                    >
                      View
                    </button>
                  </div>
                </div>

                <!-- Bottom controls row like prototype -->
                <div class="mt-5 flex items-center gap-2">
                  <div
                    class="px-3 py-2 rounded-xl text-xs font-extrabold border-2"
                    :class="reviewedBadgeClass"
                  >
                    {{ reviewedLabel }}
                  </div>

                  <button
                    class="px-3 py-2 rounded-xl text-xs font-extrabold border-2 border-[#42ad43] text-gray-900 bg-white hover:bg-gray-50 transition"
                    @click="openApproveModal = true"
                  >
                    Approve
                  </button>

                  <RouterLink
                    to="/osca/application/send-update"
                    class="px-3 py-2 rounded-xl text-xs font-extrabold border-2 border-[#42ad43] text-gray-900 bg-white hover:bg-gray-50 transition"
                  >
                    Send Update
                  </RouterLink>
                </div>
              </div>
            </section>

            <!-- RIGHT: Form -->
            <section class="lg:col-span-7">
              <Form
                :fields="formFields"
                :onlySection="'B_OSCA'"
                :reviewerName="staffName"
                :loading="fieldsLoading"
              />
            </section>
          </div>
        </div>
      </main>
    </div>

    <!-- Approve confirmation -->
    <ConfirmationModal
      :open="openApproveModal"
      title="Approve application?"
      message="This will mark the application as approved. You can’t undo this action unless you change it in the database."
      confirmText="Yes, Approve"
      cancelText="Cancel"
      @cancel="openApproveModal = false"
      @confirm="approveApplication"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted  } from 'vue'
import { supabase } from '@/supabase/client'
import { useRoute } from 'vue-router'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/Header.vue'
import Form, { type FormField } from '@/components/Staff/OSCA/Form.vue'
import ConfirmationModal from '@/components/ConfirmModal.vue'
import { useAuth } from '@/composables/useAuth'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

const { profile } = useAuth()

const sidebarCollapsed = ref(false)
const openApproveModal = ref(false)

// TEMP: later replace with DB-backed status
const applicationStatus = ref<'reviewed' | 'pending' | 'needs_update'>('reviewed')

const staffName = computed(() => {
  const p = profile.value as any
  const full = [p?.first_name, p?.last_name].filter(Boolean).join(' ').trim()
  return full || 'Lando Norris'
})

const applicationStatusLabel = computed(() => {
  if (applicationStatus.value === 'reviewed') return 'Reviewed'
  if (applicationStatus.value === 'needs_update') return 'Needs Update'
  return 'Pending'
})

const reviewedLabel = computed(() => applicationStatusLabel.value)

const reviewedBadgeClass = computed(() => {
  if (applicationStatus.value === 'reviewed') return 'bg-yellow-300 border-yellow-400 text-gray-900'
  if (applicationStatus.value === 'needs_update') return 'bg-red-50 border-red-300 text-red-700'
  return 'bg-gray-50 border-gray-200 text-gray-700'
})

const statusStyles = computed(() => {
  if (applicationStatus.value === 'reviewed') {
    return {
      border: 'border-[#42ad43]/30 bg-[#42ad43]/5',
      text: 'text-[#2f8b31]',
      dot: 'bg-[#42ad43]',
    }
  }
  if (applicationStatus.value === 'needs_update') {
    return {
      border: 'border-red-200 bg-red-50',
      text: 'text-red-700',
      dot: 'bg-red-500',
    }
  }
  return {
    border: 'border-gray-200 bg-gray-50',
    text: 'text-gray-700',
    dot: 'bg-gray-400',
  }
})

// TEMP: submitted requirements list
const submittedRequirements = ref([
  {
    id: '1',
    label: 'Duly Accomplished OSCA ID Application Form',
    note: 'Uploaded: 2026-01-20 • PDF',
    missing: false,
  },
  {
    id: '2',
    label: 'Proof of Birthdate',
    note: 'Uploaded: 2026-01-20 • Image',
    missing: false,
  },
  {
    id: '3',
    label: 'Barangay Certificate',
    note: 'Uploaded: 2026-01-20 • PDF',
    missing: false,
  },
])

function viewRequirement(req: any) {
  // TEMP placeholder – later open file viewer / supabase storage URL
  alert(`Temporary view:\n${req.label}\n\n(Connect this to Supabase Storage later.)`)
}

function approveApplication() {
  // TEMP: later do supabase update
  applicationStatus.value = 'reviewed'
  openApproveModal.value = false
  alert('Approved (temporary). Hook this to Supabase update later.')
}

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/osca/dashboard', icon: DashboardIcon },
  { label: 'Barangays', to: '/osca/barangays', icon: BarangaysIcon },
  { label: 'Application', to: '/osca/programs', icon: ApplicationIcon },
  { label: 'Activity', to: '/osca/activity', icon: ActivityIcon },
  { label: 'Announcement', to: '/osca/announcement', icon: AnnouncementIcon },
]

type FieldType = 'text' | 'number' | 'date' | 'checkbox' | 'radio' | 'select' | 'multiselect'

function normalizeFieldType(t: string): FieldType {
  const x = (t || '').toLowerCase()

  if (x === 'text') return 'text'
  if (x === 'number') return 'number'
  if (x === 'date') return 'date'
  if (x === 'checkbox') return 'checkbox'
  if (x === 'radio') return 'radio'
  if (x === 'select') return 'select'
  if (x === 'multiselect') return 'multiselect'

  return 'text'
}


const route = useRoute()

// OPTION A: get form_id from route param like /osca/applicant/:formId
//const formId = computed(() => String(route.params.formId || ''))

// OPTION B: if you don’t have route params yet, hardcode temporarily
const formId = ref('575bf644-e473-464c-aff1-c57b0fbee7a5')

const formFields = ref<FormField[]>([])
const fieldsLoading = ref(false)

async function fetchFormFields() {
  fieldsLoading.value = true
  try {
    // if you don't have formId yet, remove .eq('form_id', formId.value)
    const q = supabase
      .from('form_fields')
      .select('*')
      .eq('section', 'B_OSCA')
      .order('sort_order', { ascending: true })

    // apply form_id filter only if available
    const { data, error } = formId.value
      ? await q.eq('form_id', formId.value)
      : await q

    if (error) throw error
formFields.value = (data || []).map((r: any): FormField => ({
  id: r.id,
  form_id: r.form_id,
  section: r.section,
  label: r.label,
  field_key: r.field_key,
  pdf_field_name: r.pdf_field_name,
  field_type: normalizeFieldType(r.field_type),  // ✅ important
  required: r.required,
  sort_order: r.sort_order,
  options: r.options,
  depends_on: r.depends_on,
  placeholder: r.placeholder,
}))


  } catch (e: any) {
    console.error('fetchFormFields error:', e?.message || e)
    formFields.value = []
  } finally {
    fieldsLoading.value = false
  }
}

onMounted(() => {
  fetchFormFields()
})
</script>
