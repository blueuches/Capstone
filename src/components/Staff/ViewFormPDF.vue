<template>
  <div v-if="open" class="fixed inset-0 z-50">
    <!-- backdrop -->
    <div class="absolute inset-0 bg-black/40" @click="emit('close')" />

    <!-- modal -->
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <!-- header -->
        <div class="px-5 py-4 border-b flex items-center justify-between gap-3">
          <div class="min-w-0">
            <div class="font-bold text-gray-900 truncate">OSCA Form PDF</div>
            <div class="text-xs text-gray-500 truncate">
              {{ generatedExists ? 'Generated PDF available' : 'Template preview (not generated yet)' }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="px-3 py-2 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="checking || !generatedExists"
              @click="viewGenerated"
            >
              View Generated
            </button>

            <button
              class="px-3 py-2 rounded-xl text-sm font-semibold bg-[#42ad43] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="checking || generatedExists || !formSubmissionId"
              @click="generatePdf"
            >
              Generate PDF
            </button>

            <button
              class="px-3 py-2 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50"
              @click="emit('close')"
            >
              Close
            </button>
          </div>
        </div>

        <!-- toolbar -->
        <div class="px-5 py-3 border-b flex items-center gap-2">
          <button class="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                  :disabled="!pdfUrl"
                  @click="zoomOut">-</button>
          <button class="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                  :disabled="!pdfUrl"
                  @click="zoomIn">+</button>
          <div class="text-sm text-gray-600 ml-2">Zoom: {{ Math.round(zoom * 100) }}%</div>

          <div class="ml-auto text-xs text-gray-500" v-if="checking">Checking…</div>
          <div class="ml-auto text-xs text-red-600" v-else-if="errorMsg">{{ errorMsg }}</div>
        </div>

        <!-- body -->
        <div class="flex-1 min-h-0 bg-gray-50">
          <div v-if="!pdfUrl" class="h-full flex items-center justify-center text-gray-500">
            No PDF to display
          </div>

          <!-- iframe viewer -->
          <iframe
            v-else
            :src="pdfUrlWithZoom"
            class="w-full h-full"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { supabase } from '@/supabase/client'

const props = defineProps<{
  open: boolean
  formSubmissionId: string | null
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const checking = ref(false)
const errorMsg = ref('')
const generatedExists = ref(false)

const pdfUrl = ref<string>('') // current displayed url (template or generated)
const templateUrl = ref<string>('')
const generatedUrl = ref<string>('')

const zoom = ref(1)

const pdfUrlWithZoom = computed(() => {
  // many PDF viewers honor #zoom=NN
  const z = Math.round(zoom.value * 100)
  if (!pdfUrl.value) return ''
  // avoid double hashes
  const base = pdfUrl.value.split('#')[0]
  return `${base}#zoom=${z}`
})

function zoomIn() {
  zoom.value = Math.min(2.5, zoom.value + 0.1)
}
function zoomOut() {
  zoom.value = Math.max(0.5, zoom.value - 0.1)
}

async function loadTemplateSignedUrl() {
const { data, error } = await supabase.functions.invoke('fill-osca-pdf', {
  body: { action: 'template' },
})
templateUrl.value = data.url

  if (error) throw error
  if (!data?.url) throw new Error('No template url returned')
  templateUrl.value = data.url
}

async function getSubmissionContext(formSubmissionId: string) {
  // 1) submission -> application_id
  const { data: sub, error: subErr } = await supabase
    .from('form_submissions')
    .select('id, application_id')
    .eq('id', formSubmissionId)
    .single()

  if (subErr) throw subErr
  if (!sub?.application_id) throw new Error('Missing application_id on form_submission')

  // 2) application -> senior_id
  const { data: app, error: appErr } = await supabase
    .from('applications')
    .select('id, senior_id')
    .eq('id', sub.application_id)
    .single()

  if (appErr) throw appErr
  if (!app?.senior_id) throw new Error('Missing senior_id on application')

  return { applicationId: app.id as string, seniorId: app.senior_id as string }
}

function generatedStoragePath(seniorId: string, applicationId: string, formSubmissionId: string) {
  const folder = `osca-forms/${seniorId}/${applicationId}`
  const filename = `osca_form_${formSubmissionId}.pdf`
  return { folder, filename, fullPath: `${folder}/${filename}` }
}

async function checkGeneratedExistsAndSign() {
  if (!props.formSubmissionId) return

  const { applicationId, seniorId } = await getSubmissionContext(props.formSubmissionId)
  const { folder, filename, fullPath } = generatedStoragePath(seniorId, applicationId, props.formSubmissionId)

  // Check existence by listing the folder
  const { data: list, error: listErr } = await supabase.storage
    .from('pdfs-storage')
    .list(folder, { limit: 200 })

  if (listErr) throw listErr

  const exists = (list ?? []).some((f) => f.name === filename)
  generatedExists.value = exists

  if (exists) {
    const { data: signed, error: signErr } = await supabase.storage
      .from('pdfs-storage')
      .createSignedUrl(fullPath, 60 * 10)

    if (signErr) throw signErr
    generatedUrl.value = signed.signedUrl
  } else {
    generatedUrl.value = ''
  }
}

function viewGenerated() {
  if (generatedUrl.value) {
    pdfUrl.value = generatedUrl.value
    zoom.value = 1
  }
}

async function generatePdf() {
  if (!props.formSubmissionId) return
  errorMsg.value = ''
  checking.value = true

  try {
    const { data, error } = await supabase.functions.invoke('fill-osca-pdf', {
      body: { form_submission_id: props.formSubmissionId },
    })

    if (error) throw error
    if (!data?.url) throw new Error('Edge function did not return a url')

    // After generation, mark exists + show generated pdf
    generatedExists.value = true
    generatedUrl.value = data.url
    pdfUrl.value = data.url
    zoom.value = 1
  } catch (e: any) {
    errorMsg.value = e?.message ?? String(e)
  } finally {
    checking.value = false
  }
}

async function initModal() {
  if (!props.open || !props.formSubmissionId) return
  checking.value = true
  errorMsg.value = ''
  generatedExists.value = false
  generatedUrl.value = ''
  templateUrl.value = ''
  pdfUrl.value = ''
  zoom.value = 1

  try {
    // Always load template (fallback)
    await loadTemplateSignedUrl()

    // Check if generated exists; if yes, load it; else show template
    await checkGeneratedExistsAndSign()

    if (generatedExists.value && generatedUrl.value) {
      pdfUrl.value = generatedUrl.value
    } else {
      pdfUrl.value = templateUrl.value
    }
  } catch (e: any) {
    errorMsg.value = e?.message ?? String(e)
    // If template url loaded, still show it
    if (templateUrl.value) pdfUrl.value = templateUrl.value
  } finally {
    checking.value = false
  }
}

watch(
  () => [props.open, props.formSubmissionId],
  () => {
    if (props.open) initModal()
  },
  { immediate: true }
)
</script>
