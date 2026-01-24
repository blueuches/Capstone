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
            v-if="issuanceTypeId"
            :to="{ name: 'issuance-info', params: { issuanceTypeId } }"
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
            Review {{ seniorFullName ? `[${seniorFullName}]` : '' }}
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
                      v-for="req in pagedSubmittedRequirements"
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

                <!-- Pagination for Submitted Requirements (prevents overflow) -->
                <div class="mt-4">
                  <Pagination
                    v-model="reqPage"
                    :total-items="submittedRequirements.length"
                    :page-size="reqPageSize"
                    @change="reqPage = $event"
                  />
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
                    :to="`/osca/applicant/message/${applicationId}`"
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
import { computed, ref, onMounted } from 'vue'
import { supabase } from '@/supabase/client'
import { useRoute } from 'vue-router'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/Header.vue'
import Form, { type FormField } from '@/components/Staff/OSCA/Form.vue'
import Pagination from '@/components/Staff/Pagination.vue'
import ConfirmationModal from '@/components/ConfirmModal.vue'
import { useAuth } from '@/composables/useAuth'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

/**
 * NOTE:
 * - LEFT side now uses real DB data:
 *   applications + application_requirements + (document_submissions | form_submissions)
 * - RIGHT side Form fetching stays the same as your current code.
 */

const { profile } = useAuth()
const route = useRoute()

const sidebarCollapsed = ref(false)
const openApproveModal = ref(false)

// ---------- ROUTE PARAM (application id) ----------
// Preferred route: /osca/applicant/:applicationId
// Fallback if your router is still /osca/applicant/:seniorId
const applicationId = computed(() => String(route.params.applicationId || route.params.seniorId || ''))

// ---------- HEADER / BACK CONTEXT ----------
const issuanceTypeId = ref<string>('') // for back button (issuance-info)
const seniorFullName = ref<string>('') // for "Review [Name]" title

// DB status (from applications.status)
const dbApplicationStatus = ref<string>('draft')

// Map DB status → your 3 UI badges (so design stays same)
const applicationStatus = computed<'reviewed' | 'pending' | 'needs_update'>(() => {
  const s = (dbApplicationStatus.value || '').toLowerCase()
  if (s === 'needs_correction' || s === 'rejected') return 'needs_update'
  if (s === 'approved' || s === 'released') return 'reviewed'
  return 'pending'
})

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

// ---------- REQUIREMENTS (REAL) ----------
type ReqUI = {
  id: string // application_requirements.id
  label: string
  note: string
  missing: boolean
  kind: 'document' | 'form' | 'info_only'
  doc?: {
    storage_path: string
    file_name: string
    mime_type?: string | null
    created_at: string
  } | null
  form?: {
    id: string
    status: string
    created_at: string
  } | null
}

// ---- Submitted Requirements Pagination ----
const reqPage = ref(1)
const reqPageSize = ref(2) // adjust if you want 5/6 etc.

const pagedSubmittedRequirements = computed(() => {
  const start = (reqPage.value - 1) * reqPageSize.value
  return submittedRequirements.value.slice(start, start + reqPageSize.value)
})

const submittedRequirements = ref<ReqUI[]>([])

function formatDate(iso: string) {
  try {
    return new Date(iso).toISOString().slice(0, 10)
  } catch {
    return iso
  }
}

async function fetchApplicantHeaderAndIssuance() {
  if (!applicationId.value) return

  try {
    const { data, error } = await supabase
      .from('applications')
      .select(
        `
        id,
        status,
        issuance_type_id,
        senior:profiles!applications_senior_id_fkey(first_name, last_name)
      `
      )
      .eq('id', applicationId.value)
      .single()

    if (error) throw error

    dbApplicationStatus.value = data?.status || 'draft'
    issuanceTypeId.value = data?.issuance_type_id || ''

    const fn = (data as any)?.senior?.first_name || ''
    const ln = (data as any)?.senior?.last_name || ''
    seniorFullName.value = [fn, ln].filter(Boolean).join(' ').trim()
  } catch (e) {
    console.error('fetchApplicantHeaderAndIssuance error:', e)
    dbApplicationStatus.value = 'draft'
    issuanceTypeId.value = ''
    seniorFullName.value = ''
  }
}

async function fetchSubmittedRequirements() {
  if (!applicationId.value) {
    submittedRequirements.value = []
    return
  }

  try {
    const { data, error } = await supabase
      .from('application_requirements')
      .select(
        `
        id,
        status,
        remarks,
        created_at,
        issuance_type_requirement:issuance_type_requirements(
          id,
          sort_order,
          requirement:requirements(
            id,
            name,
            requirement_kind,
            notes
          )
        ),
        document_submissions(
          id,
          storage_path,
          file_name,
          mime_type,
          created_at
        ),
        form_submissions(
          id,
          status,
          created_at
        )
      `
      )
      .eq('application_id', applicationId.value)

    if (error) throw error

    const sorted = (data || [])
      .slice()
      .sort((a: any, b: any) => {
        const sa = a?.issuance_type_requirement?.sort_order ?? 0
        const sb = b?.issuance_type_requirement?.sort_order ?? 0
        return sa - sb
      })

    submittedRequirements.value = sorted.map((r: any) => {
      const req = r?.issuance_type_requirement?.requirement
      const label = req?.name || 'Unnamed Requirement'
      const kind = (req?.requirement_kind || 'info_only') as ReqUI['kind']

      const doc = r?.document_submissions?.[0] ?? null
      const form = r?.form_submissions?.[0] ?? null

      let note = ''
      let missing = false

      if (kind === 'document') {
        if (doc) {
          note = `Uploaded: ${formatDate(doc.created_at)} • ${doc.file_name || (doc.mime_type ?? 'File')}`
          missing = false
        } else {
          note = 'Not yet uploaded'
          missing = true
        }
      } else if (kind === 'form') {
        if (form) {
          note = `Form: ${String(form.status).toUpperCase()} • ${formatDate(form.created_at)}`
          missing = false
        } else {
          note = 'Not yet submitted'
          missing = true
        }
      } else {
        note = req?.notes ? String(req.notes) : 'Info only'
        missing = false
      }

      // Keep missing when application_requirement is pending and no submission exists
      const arStatus = String(r?.status || '').toLowerCase()
      if ((kind === 'document' || kind === 'form') && arStatus === 'pending') {
        missing = missing || (!doc && !form)
      }

      return {
        id: r.id,
        label,
        note,
        missing,
        kind,
        doc: doc
          ? {
              storage_path: doc.storage_path,
              file_name: doc.file_name,
              mime_type: doc.mime_type,
              created_at: doc.created_at,
            }
          : null,
        form: form
          ? {
              id: form.id,
              status: form.status,
              created_at: form.created_at,
            }
          : null,
      } as ReqUI
    })
  } catch (e) {
    console.error('fetchSubmittedRequirements error:', e)
    submittedRequirements.value = []
  }
}

reqPage.value = 1

function viewRequirement(req: ReqUI) {
  // Still simple for now; later you can generate signed URL for doc files
  if (req.kind === 'document') {
    if (!req.doc?.storage_path) {
      alert(`No document uploaded yet for:\n${req.label}`)
      return
    }
    alert(
      `Document submission:\n${req.label}\n\nFile: ${req.doc.file_name}\nPath: ${req.doc.storage_path}\n\nNext: open via signed URL from Supabase Storage.`
    )
    return
  }

  if (req.kind === 'form') {
    if (!req.form?.id) {
      alert(`No form submission yet for:\n${req.label}`)
      return
    }
    alert(
      `Form submission:\n${req.label}\n\nForm Submission ID: ${req.form.id}\nStatus: ${req.form.status}\n\nNext: load answers using form_submission_id.`
    )
    return
  }

  alert(`${req.label}\n\n${req.note}`)
}

function approveApplication() {
  // DON'T TOUCH per your note; leaving your placeholder behavior
  openApproveModal.value = false
  alert('Approved (temporary). Hook this to Supabase update later.')
}

// ---------- NAV ----------
const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/osca/dashboard', icon: DashboardIcon },
  { label: 'Barangays', to: '/osca/barangays', icon: BarangaysIcon },
  { label: 'Application', to: '/osca/programs', icon: ApplicationIcon },
  { label: 'Activity', to: '/osca/activity', icon: ActivityIcon },
  { label: 'Announcement', to: '/osca/announcement', icon: AnnouncementIcon },
]

// ---------- RIGHT SIDE FORM (UNCHANGED) ----------
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

// OPTION B: if you don’t have route params yet, hardcode temporarily
const formId = ref('575bf644-e473-464c-aff1-c57b0fbee7a5')

const formFields = ref<FormField[]>([])
const fieldsLoading = ref(false)

async function fetchFormFields() {
  fieldsLoading.value = true
  try {
    const q = supabase
      .from('form_fields')
      .select('*')
      .eq('section', 'B_OSCA')
      .order('sort_order', { ascending: true })

    const { data, error } = formId.value ? await q.eq('form_id', formId.value) : await q
    if (error) throw error

    formFields.value = (data || []).map((r: any): FormField => ({
      id: r.id,
      form_id: r.form_id,
      section: r.section,
      label: r.label,
      field_key: r.field_key,
      pdf_field_name: r.pdf_field_name,
      field_type: normalizeFieldType(r.field_type),
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

onMounted(async () => {
  // Right side stays
  fetchFormFields()

  // Left side now real
  await fetchApplicantHeaderAndIssuance()
  await fetchSubmittedRequirements()
})

// ✅ Expose these for template usage (you will bind in template):
// - applicationId (for Send Update link)
// - issuanceTypeId (for back button to issuance-info)
// - seniorFullName (for title)
</script>
