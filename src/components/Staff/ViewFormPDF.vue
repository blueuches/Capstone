<template>
  <div v-if="open" class="fixed inset-0 z-50">
    <!-- backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="emit('close')" />

    <!-- modal (near-fullscreen) -->
    <div class="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
      <div
        class="w-[96vw] h-[92vh] sm:w-[95vw] sm:h-[94vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
      >
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
              :disabled="!generatedExists"
              @click="viewGenerated"
            >
              View Generated
            </button>

            <button
              class="px-3 py-2 rounded-xl text-sm font-semibold bg-[#42ad43] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="checking || !formSubmissionId"
              @click="generatePdf"
            >
              {{ generatedExists ? 'Regenerate PDF' : 'Generate PDF' }}
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
          <button
            class="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!pdfUrl"
            @click="zoomOut"
          >
            -
          </button>
          <button
            class="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!pdfUrl"
            @click="zoomIn"
          >
            +
          </button>

          <div class="text-sm text-gray-600 ml-2">Zoom: {{ Math.round(zoom * 100) }}%</div>

          <div class="ml-auto text-xs text-gray-500" v-if="checking">Checking…</div>
          <div class="ml-auto text-xs text-red-600" v-else-if="errorMsg">{{ errorMsg }}</div>
        </div>

        <!-- body -->
        <div class="flex-1 min-h-0 bg-gray-100">
          <div v-if="!pdfUrl" class="h-full flex items-center justify-center text-gray-500">
            No PDF to display
          </div>

          <iframe
            v-else
            :src="pdfUrlWithZoom"
            class="w-full h-full bg-white"
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
const templateUrl = ref('')
const generatedUrl = ref('')
const pdfUrl = ref('')

const zoom = ref(1)

const pdfUrlWithZoom = computed(() => {
  const z = Math.round(zoom.value * 100)
  if (!pdfUrl.value) return ''
  const base = pdfUrl.value.split('#')[0]
  return `${base}#zoom=${z}`
})

function zoomIn() {
  zoom.value = Math.min(2.5, zoom.value + 0.1)
}
function zoomOut() {
  zoom.value = Math.max(0.5, zoom.value - 0.1)
}

function viewGenerated() {
  if (generatedUrl.value) {
    pdfUrl.value = generatedUrl.value
    zoom.value = 1
  }
}

async function loadTemplateSignedUrl() {
  const { data, error } = await supabase.functions.invoke('fill-osca-pdf', {
    body: { action: 'template' },
  })
  if (error) throw error
  if (!data?.url) throw new Error('No template url returned')
  templateUrl.value = data.url
}

async function loadGeneratedIfExists() {
  if (!props.formSubmissionId) return false

  const { data, error } = await supabase.functions.invoke('fill-osca-pdf', {
    body: { action: 'generated', form_submission_id: props.formSubmissionId },
  })
  if (error) throw error

  if (data?.exists && data?.url) {
    generatedExists.value = true
    generatedUrl.value = data.url
    pdfUrl.value = data.url
    return true
  }

  generatedExists.value = false
  generatedUrl.value = ''
  return false
}

async function generatePdf() {
  if (!props.formSubmissionId) return
  errorMsg.value = ''
  checking.value = true

  try {
    const { data, error } = await supabase.functions.invoke('fill-osca-pdf', {
      body: { action: 'generate', form_submission_id: props.formSubmissionId },
    })
    if (error) throw error
    if (!data?.url) throw new Error('Edge function did not return a url')

    generatedExists.value = true
    generatedUrl.value = data.url
    pdfUrl.value = data.url
    zoom.value = 1
} catch (e: any) {
  console.error('Generate error full:', e)

  // ✅ FunctionsHttpError: fetch the actual JSON body returned by the edge function
  const ctx = e?.context
  const body = ctx?.body

  if (body) {
    // body might be string or object
    errorMsg.value =
      typeof body === 'string' ? body : JSON.stringify(body, null, 2)
  } else if (ctx?.status) {
    errorMsg.value = `Edge error (status ${ctx.status}). Check Network tab for response body.`
  } else {
    errorMsg.value = e?.message ?? String(e)
  }
}finally {
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
    // ✅ 1. CHECK GENERATED FIRST
    const { data, error } = await supabase.functions.invoke('fill-osca-pdf', {
      body: {
        action: 'generated',
        form_submission_id: props.formSubmissionId,
      },
    })

    if (error) throw error

    if (data?.exists && data?.url) {
      // ✅ GENERATED PDF FOUND → USE IT
      generatedExists.value = true
      generatedUrl.value = data.url
      pdfUrl.value = data.url
      return
    }

    // ❌ NOT GENERATED → LOAD TEMPLATE
    const tpl = await supabase.functions.invoke('fill-osca-pdf', {
      body: { action: 'template' },
    })

    if (tpl.error) throw tpl.error
    templateUrl.value = tpl.data.url
    pdfUrl.value = tpl.data.url
  } catch (e: any) {
    errorMsg.value = e?.message ?? String(e)
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
