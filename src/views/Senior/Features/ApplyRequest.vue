<!-- src/pages/ApplyRequest.vue -->
<template>
  <div class="senior-font-root min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
    <!-- 🔹 Top Header -->
    <SeniorHeader @toggle-sidebar="toggleSidebar" />

  <SeniorSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- 🔹 Main Content -->
    <main class="flex-1 w-full max-w-4xl mx-auto p-4 space-y-6">
      <!-- Program Overview -->
      <section class="bg-white rounded-2xl shadow p-5 ring-1 ring-emerald-100">
        <h2 class="text-2xl font-bold text-emerald-800 mb-2">
          {{ program?.name || program?.title }}
        </h2>
        <p class="text-gray-700 text-sm leading-relaxed">{{ program?.description }}</p>
      </section>

      <!-- Process Section -->
      <section
        v-if="program?.process"
        class="bg-white rounded-2xl shadow p-5 ring-1 ring-emerald-100"
      >
        <h3 class="text-lg font-semibold text-emerald-800 mb-3">📋 Process</h3>
        <div class="space-y-4">
          <div
            v-for="(step, i) in (program?.process || '').split('\\n').filter(Boolean)"
            :key="i"
            class="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100"
          >
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold"
            >
              {{ i + 1 }}
            </div>
            <p class="text-sm text-gray-800 leading-snug flex-1">{{ step }}</p>
          </div>
        </div>
      </section>

      <!-- Requirements Section -->
      <section class="bg-white rounded-2xl shadow p-5 ring-1 ring-emerald-100">
        <div class="flex items-center justify-between flex-wrap gap-2 mb-3">
          <h3 class="text-lg font-semibold text-emerald-800">🗂️ Requirements</h3>
          <span v-if="requestId" class="text-xs text-gray-500">Request #{{ requestId }}</span>
        </div>

        <div v-if="loading" class="text-sm text-gray-600">Loading…</div>
        <div v-else-if="!program?.requirements?.length" class="text-sm text-gray-500">
          No specific requirements listed for this program.
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          <div
            v-for="(req, i) in program.requirements"
            :key="i"
            class="flex flex-col justify-between bg-emerald-50 border border-emerald-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div>
              <p class="font-semibold text-emerald-900 mb-1">{{ req }}</p>
              <p class="text-sm" v-if="uploads[req]">✅ File uploaded</p>
              <p class="text-sm text-red-700" v-else>⚠️ No file yet</p>
            </div>

            <div class="mt-3 flex flex-wrap gap-2">
              <button
                v-if="uploads[req]"
                class="flex-1 px-3 py-1 rounded-lg bg-gray-100 text-sm"
                @click="openFile(uploads[req], req)"
              >
                Open
              </button>

              <label
                class="flex-1 px-3 py-1 rounded-lg bg-emerald-600 text-white text-sm text-center cursor-pointer"
              >
                <input
                  type="file"
                  class="hidden"
                  :disabled="busyKind === req"
                  @change="(e: any) => onUpload(req, e.target.files?.[0])"
                />
                {{ busyKind === req ? 'Uploading…' : uploads[req] ? 'Replace' : 'Upload' }}
              </label>

              <!-- Continue to Form if requirement is the Application Form -->
              <button
                v-if="req.toLowerCase().includes('application form')"
                @click="continueToForm"
                class="w-full mt-2 px-3 py-2 rounded-lg bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition"
                :disabled="loading || !(variantId ? program?.program_id : programId)"
              >
                Fill out Form
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Navigation Component -->
      <SeniorNav :show-back="true" :show-next="false" class="mt-6" />
      <p class="sr-only" aria-live="polite">{{ ariaHint }}</p>

      <FilePreviewModal
        :open="previewOpen"
        :url="previewUrl || undefined"
        :label="previewLabel"
        :type="previewType"
        :loading="previewLoading"
        :error="previewError"
        @close="previewOpen = false"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabase/client'
import SeniorHeader from '@/components/SeniorHeader.vue'
import SeniorNav from '@/components/SeniorNav.vue'
import SeniorSidebar from '@/components/SeniorSidebar.vue'
import FilePreviewModal from '@/components/FilePreviewModal.vue'
import { useTTS } from '@/composables/useTTS'
import useUnifiedTTS from '@/composables/useUnifiedTTS'

const route = useRoute()
const router = useRouter()
const programId = Number(route.params.programId)

const loading = ref(true)
const program = ref<any>(null)
const requestId = ref<number | null>(null)
const uploads = ref<Record<string, any>>({}) // track uploaded files per requirement
const busyKind = ref<string | null>(null)
const ariaHint = ref('')
const variantId = Number(route.params.variantId || 0)

const sidebarOpen = ref(false)
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

const previewOpen = ref(false)
const previewUrl = ref<string | null>(null)
const previewType = ref<'image' | 'pdf' | 'other'>('other')
const previewLabel = ref<string>('')
const previewLoading = ref(false)
const previewError = ref<string | undefined>()

onMounted(init)

const { speak } = useTTS()

onMounted(() => {
  // Short delay to avoid interrupting other page audio
  setTimeout(() => {
    speak(
      "Diri mag-pasa ug ma nga rekwayerments para maka-aplay. Paki-basa ko sa proseso og tuploka lang ang 'Upload' kung mag-pasa naka sa imo ma nga papeles.",
    )
  }, 1500)
})

async function init() {
  loading.value = true

  // Load program or variant (unchanged)
  if (variantId) {
    const { data: v, error: vErr } = await supabase
      .from('ProgramVariants')
      .select('id, name, description, process, requirements, program_id')
      .eq('id', variantId)
      .single()
    if (vErr) {
      alert('Failed to load variant')
      loading.value = false
      return
    }
    program.value = v
  } else {
    const { data: p, error: pErr } = await supabase
      .from('Programs')
      .select('id, name, description, process, requirements')
      .eq('id', programId)
      .single()
    if (pErr) {
      alert('Failed to load program')
      loading.value = false
      return
    }
    program.value = p
  }

  // Get or create draft request (unchanged)
  const { data: reqId, error } = await supabase.rpc('ensure_draft_request', {
    p_program_id: programId,
  })
  if (error) {
    alert(error.message)
    loading.value = false
    return
  }
  requestId.value = reqId

  // 🔹 NEW: hydrate uploads from DB (so buttons show "Open" not "Upload")
  await loadUploadsForRequest()

  loading.value = false
}

/* -------- Storage helpers (fixed) -------- */

function slugify(s: string) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // spaces & symbols → dashes
    .replace(/^-+|-+$/g, '')
}

function buildStoragePath(filename: string, label: string) {
  // Keep keys inside the bucket neat & safe: requests/{requestId}/...
  const base = `requests/${requestId.value}`
  const safeLabel = slugify(label)
  const safeName = (filename || 'file').replace(/[^\w.\-]+/g, '_') // allow only word chars, dot, dash, underscore
  return `${base}/${safeLabel}_${Date.now()}_${safeName}`
}

async function openFile(path: string, label?: string) {
  previewOpen.value = true
  previewLoading.value = true
  previewError.value = undefined
  previewLabel.value = label || ''

  try {
    // Public bucket path → public URL
    const { data } = supabase.storage.from('requirements').getPublicUrl(path)
    const url = data.publicUrl

    previewType.value = detectTypeFromPath(path)
    previewUrl.value = url
  } catch (err: any) {
    previewError.value = err?.message || String(err)
  } finally {
    previewLoading.value = false
  }
}

/* -------- Upload flow (fixed) -------- */

async function onUpload(reqLabel: string, file?: File) {
  if (!file || !requestId.value) return
  busyKind.value = reqLabel

  try {
    // 1) Upload to Storage with a clean, predictable key
    const fullPath = buildStoragePath(file.name, reqLabel)
    const { error: upErr } = await supabase.storage
      .from('requirements') // bucket name only
      .upload(fullPath, file, { upsert: true })
    if (upErr) throw upErr

    // 2) Map label to enum kind (now catches "2x2 / picture / pic")
    const enumKind = mapDocKind(reqLabel)

    // 3) Current user (UUID) — matches RequestDocuments.uploaded_by → Users(user_id)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // 4) Update the seeded row by label
    const { data: upd, error: saveErr } = await supabase
      .from('RequestDocuments')
      .update({
        kind: enumKind,
        file_path: fullPath,
        uploaded_by: user?.id,
      })
      .eq('request_id', requestId.value)
      .eq('label', reqLabel)
      .select('id') // lets us detect "0 rows updated"

    if (saveErr) throw saveErr

    // 5) If no seeded row matched the label, INSERT a new one (requires RLS insert policy)
    if (!upd || upd.length === 0) {
      const { error: insErr } = await supabase.from('RequestDocuments').insert({
        request_id: requestId.value,
        kind: enumKind,
        file_path: fullPath,
        uploaded_by: user?.id,
        label: reqLabel,
      })
      if (insErr) throw insErr
    }

    // 6) Local UI state + TTS hint
    uploads.value[reqLabel] = fullPath
    speak(`${reqLabel} kay na-upload na.`)
  } catch (e: any) {
    alert(e.message || String(e))
  } finally {
    busyKind.value = null
  }
}

/* -------- Navigation -------- */

function continueToForm() {
  // If this page was opened via a ProgramVariant, use its parent program_id
  const pid = variantId
    ? Number(program.value?.program_id) // variant → parent program
    : Number(programId) // base program

  if (!Number.isFinite(pid)) {
    alert('Program not ready yet. Please try again in a moment.')
    return
  }

  router.push({ name: 'form-page', params: { programId: pid } })
}

/* -------- Accessibility: simple web TTS -------- */

/* -------- Label → enum mapping (expanded for 2x2 / picture / pic) -------- */

function mapDocKind(
  label: string,
):
  | 'id_photo'
  | 'selfie'
  | 'birth_cert'
  | 'marriage_cert'
  | 'death_cert'
  | 'barangay_cert'
  | 'medical_cert'
  | 'proof_of_addr'
  | 'others' {
  const s = (label || '').toLowerCase()

  if (s.includes('barangay') && s.includes('cert')) return 'barangay_cert'
  if (s.includes('registered death') || s.includes('death cert')) return 'death_cert'

  if (s.includes('proof of relationship')) return 'marriage_cert'
  if (s.includes('marriage cert')) return 'marriage_cert'
  if (s.includes('birth cert')) return 'birth_cert'

  if (
    s.includes('proof of address') ||
    s.includes('residence') ||
    s.includes('utility bill') ||
    s.includes('billing')
  )
    return 'proof_of_addr'

  if (s.includes('medical cert') || s.includes('medical certificate')) return 'medical_cert'

  // catch common ID photo wording
  if (
    s.includes('2x2') ||
    s.includes('2 by 2') ||
    s.includes('id pic') ||
    s.includes('id picture') ||
    (s.includes('id') && s.includes('photo'))
  )
    return 'id_photo'

  if (s.includes('selfie')) return 'selfie'

  // OSCA ID / referral / SPA / CSWD etc. not in enum → others
  return 'others'
}

function normLabel(s: string) {
  return (s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ') // collapse spaces
    .trim()
    .replace(/[^a-z0-9]/g, '') // strip punctuation
}

async function loadUploadsForRequest() {
  if (!requestId.value) return

  // Fetch existing docs for this request
  const { data: docs, error } = await supabase
    .from('RequestDocuments')
    .select('label, file_path')
    .eq('request_id', requestId.value)

  if (error) {
    console.error('loadUploadsForRequest error:', error.message)
    return
  }

  // Build a lookup by normalized label for quick matching
  const byNormLabel = new Map<string, string>()
  for (const d of docs || []) {
    if (d?.file_path && d.file_path !== '') {
      byNormLabel.set(normLabel(d.label || ''), d.file_path)
    }
  }

  // Reconcile program requirements with saved docs (by normalized label)
  const reqs: string[] = program.value?.requirements || []
  const newUploads: Record<string, string> = {}
  for (const req of reqs) {
    const hit = byNormLabel.get(normLabel(req))
    if (hit) newUploads[req] = hit
  }
  uploads.value = newUploads // reactive update
}

function detectTypeFromPath(path: string): 'image' | 'pdf' | 'other' {
  const ext = (path.split('.').pop() || '').toLowerCase()
  const images = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'heic', 'heif']
  if (images.includes(ext)) return 'image'
  if (ext === 'pdf') return 'pdf'
  return 'other'
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}

/* Responsive spacing and layout */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

header.sticky {
  position: sticky;
  top: 0;
  z-index: 50;
}

/* Allow main content to scroll normally */
main {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
}
</style>
