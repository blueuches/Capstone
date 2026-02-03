<!-- src/views/Senior/RequirementsPageList.vue -->
<template>
  <!-- LOCK the page scroll -->
  <div class="h-screen overflow-hidden bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <!-- main must be flex column and allow children to shrink -->
    <main class="flex-1 px-4 pt-4 flex flex-col min-h-0">
      <!-- Breadcrumb -->
      <RouterLink
        to="/senior/dashboard/myrequirements"
        class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4"
      >
        <component :is="Left" class="w-5 h-5 text-yellow-500" />
        <span class="text-gray-500">Dashboard</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-500">My Requirements</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900">Requirement List</span>
      </RouterLink>

      <!-- Title -->
      <div class="mb-3">
        <h1 class="text-xl font-bold text-gray-900">Requirement List</h1>
        <p class="text-sm text-gray-500">
          View and manage the files you submitted for this application.
        </p>
      </div>

      <!-- Application summary -->
      <div class="mb-4 rounded-3xl bg-white border border-gray-200 p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-bold text-gray-900 mt-1">
              {{ appTitle || 'OSCA ID Issuance' }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Status:
              <span class="font-semibold" :class="statusClass">
                {{ prettyStatus(appStatus) }}
              </span>
            </p>

            <p v-if="headerError" class="text-[11px] text-red-600 mt-1">
              {{ headerError }}
            </p>
          </div>

          <button
            class="px-3 py-2 rounded-2xl text-sm font-semibold bg-gray-50 border border-gray-200 active:scale-[0.99]"
            @click="refreshList"
            :disabled="loading"
          >
            {{ loading ? 'Refreshing…' : 'Refresh' }}
          </button>
        </div>
      </div>

      <!-- ✅ ONLY SCROLLABLE AREA -->
      <div class="flex-1 min-h-0 overflow-y-auto pr-1">
        <!-- We pass the "list item" shape, but store richer data internally -->
        <RequirementList
          :items="requirements"
          @view="onView"
          @edit="onEdit"
          @delete="onDelete"
        />

        <div class="mt-4 text-xs text-gray-500 pb-3">
          Tip: Requirements without a checkmark mean there is no uploaded record yet.
        </div>

        <div v-if="listError" class="mt-2 text-xs text-red-600 pb-3">
          {{ listError }}
        </div>
      </div>
    </main>

    <BottomNav />

    <!-- ✅ VIEW MODAL (preview submitted docs OR "View PDF" for form) -->
    <div v-if="viewOpen" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/40" @click="closeView"></div>

      <div class="absolute inset-0 flex items-end sm:items-center justify-center p-3">
        <div class="w-full sm:max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
          <div
            class="px-5 pt-5 pb-3 border-b border-gray-100 flex items-start justify-between gap-3"
          >
            <div class="min-w-0">
              <h3 class="text-base font-extrabold text-gray-900 truncate">
                {{ viewTitle }}
              </h3>
              <p class="text-xs text-gray-500 mt-1">
                {{ viewLoading ? 'Loading files…' : 'Recent submitted files' }}
              </p>
              <p v-if="viewError" class="text-[11px] text-red-600 mt-1">
                {{ viewError }}
              </p>
            </div>

            <button
              type="button"
              class="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center
                     active:scale-[0.98]"
              @click="closeView"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div class="px-5 py-4 space-y-3 max-h-[60vh] overflow-auto">
            <div v-if="!viewLoading && !viewFiles.length" class="text-sm text-gray-500">
              No uploaded files yet.
            </div>

            <div
              v-for="f in viewFiles"
              :key="f.storage_path"
              class="p-3 rounded-2xl border border-gray-200"
            >
              <p class="text-sm font-semibold text-gray-900 break-words">
                {{ f.file_name || 'File' }}
              </p>

              <div v-if="f.url" class="mt-2">
                <!-- image preview -->
                <img
                  v-if="isImage(f.file_name)"
                  :src="f.url"
                  class="w-full rounded-xl border"
                  alt="preview"
                />

                <div v-else class="mt-2">
                  <button
                    class="w-full rounded-2xl py-3 text-sm font-extrabold bg-[#42ad43] text-white active:scale-[0.99]"
                    @click="
                      f.url === 'EDGE'
                        ? openFormPdfViaEdge(f.storage_path, viewTitle)
                        : openPdf(f.file_name || 'PDF File', f.url)
                    "
                  >
                    View PDF
                  </button>

                  <div v-if="f.url === 'EDGE'" class="mt-2 text-[11px] text-gray-500">
                    This opens your application form preview.
                  </div>
                </div>

                <!-- only show "Open in new tab" for normal signed urls -->
                <a
                  v-if="f.url !== 'EDGE'"
                  :href="f.url"
                  target="_blank"
                  class="mt-2 inline-block text-xs font-bold text-[#42ad43]"
                >
                  Open in new tab
                </a>
              </div>

              <div v-else class="mt-2 text-xs text-gray-500">
                Preview not available.
              </div>
            </div>
          </div>

          <div class="px-5 pb-5">
            <button
              class="w-full rounded-full py-2.5 text-sm font-extrabold bg-gray-100 text-gray-700"
              @click="closeView"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Senior-friendly PDF viewer modal -->
    <ViewPdfModal
      :open="pdfModalOpen"
      :title="pdfModalTitle"
      :url="pdfModalUrl"
      @close="closePdf"
    />

    <!-- ✅ Replace / upload a document requirement -->
    <SelectFile
      v-model="selectOpen"
      :title="selectTitle"
      :subtitle="selectSubtitle"
      :accept="selectAccept"
      :maxSizeMB="selectMaxSizeMB"
      @confirm="onSelectConfirm"
      @cancel="onSelectCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import RequirementList from '@/components/Senior/RequirementList.vue'
import Left from '@/assets/icons/senior/left-arrow.svg'
import { supabase } from '@/supabase/client'
import ViewPdfModal from '@/components/Senior/ViewPdfModal.vue'
import SelectFile from '@/components/SelectFile.vue'

/**
 * ✅ IMPORTANT:
 * RequirementList.vue likely expects this "basic" item shape.
 * So our event handlers accept RequirementListItem.
 * Internally we store a richer version (RequirementRowItem).
 */
type RequirementListItem = {
  id: string
  title: string
  subtitle?: string
  hasRecord: boolean
  recordCount?: number
  updatedAt?: string
}

type RequirementKind = 'form' | 'file'

type RequirementRowItem = RequirementListItem & {
  kind: RequirementKind
  formSubmissionId?: string | null
}

type ViewFile = {
  file_name: string | null
  storage_path: string
  url?: string // signed url OR "EDGE"
}

const DOC_BUCKET = 'documents'

const open = ref(false)
const route = useRoute()
const router = useRouter()
const applicationId = route.params.applicationId as string

const loading = ref(false)
const headerError = ref('')
const listError = ref('')

const appTitle = ref<string>('')
const appStatus = ref<string>('draft')

/** We store full items here (includes kind + formSubmissionId) */
const requirements = ref<RequirementRowItem[]>([])

/** helper: given emitted list item, find the full one */
function getFullItem(item: RequirementListItem): RequirementRowItem | null {
  return requirements.value.find((r) => r.id === item.id) ?? null
}

/** ✅ PDF modal state */
const pdfModalOpen = ref(false)
const pdfModalTitle = ref('')
const pdfModalUrl = ref<string | null>(null)

function openPdf(title: string, url: string) {
  pdfModalTitle.value = title
  pdfModalUrl.value = url
  pdfModalOpen.value = true
}
function closePdf() {
  pdfModalOpen.value = false
  pdfModalTitle.value = ''
  pdfModalUrl.value = null
}

/** ✅ SelectFile modal state (for document requirements) */
const selectOpen = ref(false)
const selectTitle = ref('Upload Document')
const selectSubtitle = ref('Choose a file to replace your previous upload.')
const selectAccept = ref('.pdf,image/*')
const selectMaxSizeMB = ref(10)

const editingRequirement = ref<RequirementRowItem | null>(null)

function openSelectFor(full: RequirementRowItem) {
  editingRequirement.value = full
  selectTitle.value = `Upload: ${full.title}`
  selectSubtitle.value = 'This will upload a new file for this requirement.'
  selectOpen.value = true
}

/** ✅ Open application form PDF via edge function (best: final > draft > template) */
async function openFormPdfViaEdge(formSubmissionId: string, title = 'Application Form') {
  pdfModalTitle.value = title
  pdfModalUrl.value = null
  pdfModalOpen.value = true

  try {
    // 1) Try best first
    const bestRes = await supabase.functions.invoke('fill-osca-pdf', {
      body: {
        action: 'best',
        form_submission_id: formSubmissionId,
        role: 'senior'
      }
    })

    if (bestRes.error) throw bestRes.error
    if (!bestRes.data?.ok) throw new Error(bestRes.data?.error ?? 'Failed to load PDF.')

    // If best returns a generated file, show it
    if (bestRes.data?.url && bestRes.data?.kind !== 'template') {
      pdfModalUrl.value = bestRes.data.url
      return
    }

    // 2) If it's template, generate draft preview (A_APPLICANT only)
    const draftRes = await supabase.functions.invoke('fill-osca-pdf', {
      body: {
        action: 'generate_draft',
        form_submission_id: formSubmissionId
      }
    })

    if (draftRes.error) throw draftRes.error
    if (!draftRes.data?.ok) throw new Error(draftRes.data?.error ?? 'Failed to generate preview.')

    if (!draftRes.data?.url) throw new Error('No PDF URL returned.')
    pdfModalUrl.value = draftRes.data.url
  } catch (e: any) {
    console.error(e)
    viewError.value = e?.message ?? 'Failed to load PDF.'
  }
}

/** Pretty status */
function prettyStatus(s?: string) {
  if (!s) return 'Unknown'
  return s.toString().replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
}

const statusClass = computed(() => {
  const s = (appStatus.value ?? '').toLowerCase()
  if (s === 'approved') return 'text-emerald-700'
  if (s === 'rejected') return 'text-red-600'
  if (s === 'submitted' || s === 'in_review') return 'text-amber-700'
  return 'text-emerald-700'
})

function toKind(requirementKind: string | null | undefined): RequirementKind {
  const k = (requirementKind ?? '').toLowerCase()
  return k === 'form' ? 'form' : 'file'
}

function formatIsoToYmd(iso?: string | null) {
  if (!iso) return ''
  try {
    return new Date(iso).toISOString().slice(0, 10)
  } catch {
    return ''
  }
}

function humanSubtitle(count: number, updated?: string) {
  if (!count) return 'No file yet'
  const dt = updated ? formatIsoToYmd(updated) : ''
  return dt
    ? `Uploaded: ${count} file${count > 1 ? 's' : ''} • Updated: ${dt}`
    : `Uploaded: ${count} file${count > 1 ? 's' : ''}`
}

/** Load application header (issuance name + status) */
async function loadHeader() {
  headerError.value = ''
  const { data, error } = await supabase
    .from('applications')
    .select(
      `
      id,
      status,
      issuance_type:issuance_type_id ( name )
    `
    )
    .eq('id', applicationId)
    .single()

  if (error) throw error

  appTitle.value = (data as any)?.issuance_type?.name ?? ''
  appStatus.value = (data as any)?.status ?? 'draft'
}

/** Load requirement list with checkmarks based on submissions */
async function loadRequirementsFromDb() {
  listError.value = ''
  const { data, error } = await supabase
    .from('application_requirements')
    .select(
      `
      id,
      updated_at,
      issuance_type_requirement:issuance_type_requirement_id (
        sort_order,
        requirement:requirement_id (
          name,
          requirement_kind,
          notes
        )
      ),
      document_submissions ( id, file_name, storage_path, created_at ),
      form_submissions ( id, updated_at )
    `
    )
    .eq('application_id', applicationId)

  if (error) throw error

  const rows = (data ?? []) as any[]
  rows.sort(
    (a, b) =>
      (a?.issuance_type_requirement?.sort_order ?? 0) -
      (b?.issuance_type_requirement?.sort_order ?? 0)
  )

  requirements.value = rows.map((r) => {
    const req = r?.issuance_type_requirement?.requirement
    const title = req?.name ?? 'Requirement'
    const notes = req?.notes ?? undefined
    const kind = toKind(req?.requirement_kind)

    const docs = Array.isArray(r?.document_submissions) ? r.document_submissions : []
    const formSub = r?.form_submissions
    const forms = Array.isArray(formSub) ? formSub : formSub?.id ? [formSub] : []

    const hasRecord = kind === 'form' ? forms.length > 0 : docs.length > 0
    const recordCount = kind === 'form' ? forms.length : docs.length

    // ✅ latest form submission id for edge function
    const latestFormSubmissionId = forms?.[0]?.id ?? null

    const latestDocTime = docs?.[0]?.created_at ?? null
    const latestFormTime = forms?.[0]?.updated_at ?? null
    const updatedAt = latestDocTime || latestFormTime || r?.updated_at || null

    const item: RequirementRowItem = {
      id: r.id,
      title,
      subtitle: hasRecord ? humanSubtitle(recordCount, updatedAt) : notes ?? 'No file yet',
      hasRecord,
      recordCount,
      updatedAt: updatedAt ? formatIsoToYmd(updatedAt) : undefined,
      kind,
      formSubmissionId: latestFormSubmissionId
    }

    return item
  })
}

async function refreshList() {
  loading.value = true
  try {
    await loadHeader()
    await loadRequirementsFromDb()
  } catch (e: any) {
    console.error(e)
    const msg = e?.message ?? 'Failed to refresh.'
    if (!appTitle.value) headerError.value = msg
    else listError.value = msg
  } finally {
    loading.value = false
  }
}

/** VIEW MODAL logic */
const viewOpen = ref(false)
const viewTitle = ref('')
const viewLoading = ref(false)
const viewError = ref('')
const viewFiles = ref<ViewFile[]>([])

/** ✅ SelectFile modal state (for document-type requirements) */
const filePickerOpen = ref(false)
const filePickerTitle = ref('Upload Document')
const filePickerSubtitle = ref('Choose a new file to replace your previous upload.')
const filePickerAccept = ref('.pdf,image/*')
const filePickerMaxSizeMB = ref(10)

function closeFilePicker() {
  filePickerOpen.value = false
  editingRequirement.value = null
}

function closeView() {
  viewOpen.value = false
  viewTitle.value = ''
  viewFiles.value = []
  viewError.value = ''
  viewLoading.value = false
}

function isImage(name?: string | null) {
  const n = (name ?? '').toLowerCase()
  return (
    n.endsWith('.jpg') ||
    n.endsWith('.jpeg') ||
    n.endsWith('.png') ||
    n.endsWith('.webp') ||
    n.endsWith('.gif')
  )
}

/**
 * ✅ Handlers accept RequirementListItem (basic type),
 * then we lookup the richer item (kind/formSubmissionId).
 */
async function onView(item: RequirementListItem) {
  const full = getFullItem(item)
  if (!full) return

  viewOpen.value = true
  viewTitle.value = full.title
  viewLoading.value = true
  viewError.value = ''
  viewFiles.value = []

  try {
    // ✅ FORM requirement: show single "View PDF" that calls edge function
    if (full.kind === 'form') {
      if (!full.formSubmissionId) {
        viewError.value = 'No form submission found yet.'
        return
      }

      viewFiles.value = [
        {
          file_name: `${full.title}.pdf`,
          storage_path: full.formSubmissionId, // store form_submission_id here
          url: 'EDGE'
        }
      ]
      return
    }

    // ✅ FILE requirement: load uploaded documents
    const { data, error } = await supabase
      .from('document_submissions')
      .select('file_name, storage_path, created_at')
      .eq('application_requirement_id', full.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    const base = (data ?? []).map((d: any) => ({
      file_name: d.file_name as string | null,
      storage_path: d.storage_path as string
    }))

    const signed: ViewFile[] = []
    for (const f of base) {
      const { data: signedData, error: signErr } = await supabase.storage
        .from(DOC_BUCKET)
        .createSignedUrl(f.storage_path, 60 * 5)

      if (!signErr && signedData?.signedUrl) signed.push({ ...f, url: signedData.signedUrl })
      else signed.push({ ...f })
    }

    viewFiles.value = signed
  } catch (e: any) {
    console.error(e)
    viewError.value = e?.message ?? 'Failed to load files.'
    viewFiles.value = []
  } finally {
    viewLoading.value = false
  }
}

function onEdit(item: RequirementListItem) {
  const full = getFullItem(item)
  if (!full) return

  // ✅ FORM: go to ApplyPageForm route
  if (full.kind === 'form') {
    // We pass the application_requirement_id as :id.
    router.push({
  name: 'ApplyForm',
  params: { id: full.id },       
  query: { applicationId }        
})

    return
  }

  // ✅ DOCUMENT: open SelectFile modal (replace upload)
  openSelectFor(full)
}

async function onSelectConfirm(files: File[]) {
  const full = editingRequirement.value
  if (!full) return
  const file = files?.[0]
  if (!file) return

  // keep view/list errors separate; show error in list area for now
  listError.value = ''
  loading.value = true

  try {
    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr) throw userErr
    const userId = userRes?.user?.id
    if (!userId) throw new Error('Not signed in.')

    // storage path (avoid ':' from ISO in filenames)
    const ts = new Date().toISOString().replace(/[:.]/g, '-')
    const cleanName = file.name.replace(/\s+/g, '_')
    const storagePath = `${applicationId}/${full.id}/${ts}_${cleanName}`

    // 1) Upload to bucket
    const upRes = await supabase.storage.from(DOC_BUCKET).upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false
    })
    if (upRes.error) throw upRes.error

    // 2) Add a new submission row (keeps history)
    const insRes = await supabase.from('document_submissions').insert({
      application_requirement_id: full.id,
      uploaded_by: userId,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type || null,
      file_size: file.size
    })
    if (insRes.error) throw insRes.error

    // 3) Mark requirement as submitted
    const updRes = await supabase
      .from('application_requirements')
      .update({ status: 'submitted', updated_at: new Date().toISOString() })
      .eq('id', full.id)
    if (updRes.error) throw updRes.error

    // Refresh list UI
    await loadRequirementsFromDb()
  } catch (e: any) {
    console.error(e)
    listError.value = e?.message ?? 'Failed to upload file.'
  } finally {
    loading.value = false
    editingRequirement.value = null
  }
}

function onSelectCancel() {
  editingRequirement.value = null
}

function onDelete(item: RequirementListItem) {
  const full = getFullItem(item)
  if (!full) return
  alert('Delete is not available yet.')
}

onMounted(() => {
  refreshList()
})
</script>
