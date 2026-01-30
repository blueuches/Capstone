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
            Review {{ seniorFullName ? `${seniorFullName}` : '' }}
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

                    <!-- Buttons -->
                    <div class="shrink-0 ml-3 flex items-center gap-2">
                      <!-- Default View -->
                      <button
                        class="px-3 py-1.5 rounded-lg text-xs font-extrabold border-2 border-[#42ad43] text-[#42ad43] hover:bg-[#42ad43] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="viewRequirement(req)"
                        :disabled="req.kind === 'form' && !req.form?.id"
                        :title="req.kind === 'form' && !req.form?.id ? 'No form submission yet' : 'View'"
                      >
                        View
                      </button>

                      <!-- View PDF (only for FORM requirements) -->
                      <button
                        v-if="req.kind === 'form'"
                        class="px-3 py-1.5 rounded-lg text-xs font-extrabold border-2 border-gray-300 text-gray-800 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="openFormPDF(req)"
                        :disabled="!req.form?.id"
                        :title="!req.form?.id ? 'No form submission yet' : 'View PDF'"
                      >
                        View PDF
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Pagination for Submitted Requirements -->
                <div class="mt-4">
                  <Pagination
                    v-model="reqPage"
                    :total-items="submittedRequirements.length"
                    :page-size="reqPageSize"
                    @change="reqPage = $event"
                  />
                </div>

                <!-- Bottom controls row -->
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
                :formSubmissionId="activeFormSubmissionId"
                :applicationRequirementId="activeFormRequirementId"
                :currentUserId="(profile as any)?.id"
                :lockOnSubmit="false"
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

    <!-- Document viewer -->
    <ViewDocument
      :open="openDocModal"
      :title="docModalPayload?.title"
      :storagePath="docModalPayload?.storagePath"
      :fileName="docModalPayload?.fileName"
      :mimeType="docModalPayload?.mimeType"
      bucketFallback="documents"
      @close="openDocModal = false"
    />

    <!-- Form answers -->
    <ViewForm
      :open="openFormModal"
      :title="formModalPayload?.title"
      :formSubmissionId="formModalPayload?.formSubmissionId"
      @close="openFormModal = false"
    />

    <!-- ✅ Form PDF viewer -->
<ViewFormPDF
  :open="openFormPDFModal"
  :title="formPDFPayload?.title"
  :formSubmissionId="formPDFPayload?.formSubmissionId ?? null"
  @close="openFormPDFModal = false"
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

import ViewDocument from '@/components/Staff/ViewDocument.vue'
import ViewForm from '@/components/Staff/ViewForm.vue'
import ViewFormPDF from '@/components/Staff/ViewFormPDF.vue'

const { profile } = useAuth()
const route = useRoute()

const sidebarCollapsed = ref(false)
const openApproveModal = ref(false)

const applicationId = computed(() => String(route.params.applicationId || route.params.seniorId || ''))

// ---------- HEADER / BACK CONTEXT ----------
const issuanceTypeId = ref<string>('') // for back button (issuance-info)
const seniorFullName = ref<string>('') // for "Review [Name]" title

// DB status (from applications.status)
const dbApplicationStatus = ref<string>('draft')

// Map DB status → your 3 UI badges
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

const openDocModal = ref(false)
const openFormModal = ref(false)

const docModalPayload = ref<{
  title: string
  storagePath: string
  fileName?: string | null
  mimeType?: string | null
} | null>(null)

const formModalPayload = ref<{
  title: string
  formSubmissionId: string
} | null>(null)

const activeFormSubmissionId = ref<string>('')
const activeFormId = ref<string>('')
const activeFormRequirementId = ref<string>('') // application_requirements.id of the form req

// ✅ PDF modal state
const openFormPDFModal = ref(false)
const formPDFPayload = ref<{ title: string; formSubmissionId: string } | null>(null)

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
    form_id?: string
  } | null
}

// ---- Submitted Requirements Pagination ----
const reqPage = ref(1)
const reqPageSize = ref(2)

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
        doc_submissions:document_submissions(
          id,
          storage_path,
          file_name,
          mime_type,
          created_at
        ),
        form_submission:form_submissions(
          id,
          status,
          created_at,
          form_id
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

      const docEmbed = r?.doc_submissions
      const doc = Array.isArray(docEmbed) ? (docEmbed[0] ?? null) : (docEmbed ?? null)

      const formEmbed = r?.form_submission
      const form = Array.isArray(formEmbed) ? (formEmbed[0] ?? null) : (formEmbed ?? null)

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
              form_id: form.form_id,
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
  if (req.kind === 'document') {
    if (!req.doc?.storage_path) {
      alert(`No document uploaded yet for:\n${req.label}`)
      return
    }

    docModalPayload.value = {
      title: req.label,
      storagePath: req.doc.storage_path,
      fileName: req.doc.file_name,
      mimeType: req.doc.mime_type ?? null,
    }
    openDocModal.value = true
    return
  }

  if (req.kind === 'form') {
    if (!req.form?.id) {
      alert(`No form submission yet for:\n${req.label}`)
      return
    }

    formModalPayload.value = {
      title: req.label,
      formSubmissionId: req.form.id,
    }
    openFormModal.value = true
    return
  }

  alert(`${req.label}\n\n${req.note}`)
}

// ✅ NEW: Open Form PDF modal
function openFormPDF(req: ReqUI) {
  if (req.kind !== 'form') return
  if (!req.form?.id) {
    alert(`No form submission yet for:\n${req.label}`)
    return
  }

  formPDFPayload.value = {
    title: req.label,
    formSubmissionId: req.form.id,
  }
  openFormPDFModal.value = true
}

function approveApplication() {
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

const formId = ref('575bf644-e473-464c-aff1-c57b0fbee7a5')

const formFields = ref<FormField[]>([])
const fieldsLoading = ref(false)

async function fetchFormFields(formId?: string) {
  const id = formId || activeFormId.value
  if (!id) {
    formFields.value = []
    return
  }

  fieldsLoading.value = true
  try {
    const { data, error } = await supabase
      .from('form_fields')
      .select('*')
      .eq('form_id', id)
      .order('sort_order', { ascending: true })

    if (error) throw error
    formFields.value = data || []
  } catch (e) {
    console.error('fetchFormFields error:', e)
    formFields.value = []
  } finally {
    fieldsLoading.value = false
  }
}

onMounted(async () => {
  await fetchApplicantHeaderAndIssuance()
  await fetchSubmittedRequirements()

  const firstFormReq = submittedRequirements.value.find(r => r.kind === 'form' && r.form?.id)
  if (firstFormReq?.form?.id) {
    activeFormSubmissionId.value = firstFormReq.form.id
    activeFormId.value = (firstFormReq.form as any).form_id || ''
    activeFormRequirementId.value = firstFormReq.id
    await fetchFormFields(activeFormId.value)
  } else {
    formFields.value = []
  }
})
</script>
