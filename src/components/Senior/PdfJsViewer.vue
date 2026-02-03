<template>
  <div class="h-full w-full flex flex-col bg-white">
    <!-- Toolbar (wraps on small screens) -->
    <div class="px-3 py-3 border-b flex flex-wrap items-center gap-2">
      <!-- Page controls -->
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-2 rounded-xl border text-lg font-bold leading-none"
          @click="prevPage"
          :disabled="page <= 1 || loading"
          aria-label="Previous page"
        >
          ‹
        </button>

        <div class="text-sm font-semibold text-gray-700 whitespace-nowrap">
          Page {{ page }} / {{ numPages || '—' }}
        </div>

        <button
          class="px-3 py-2 rounded-xl border text-lg font-bold leading-none"
          @click="nextPage"
          :disabled="!numPages || page >= numPages || loading"
          aria-label="Next page"
        >
          ›
        </button>
      </div>

      <!-- Zoom controls: move to next line automatically on small widths -->
      <div class="flex items-center gap-2 ml-auto">
        <button
          class="px-3 py-2 rounded-xl border text-lg font-bold leading-none"
          @click="zoomOut"
          :disabled="loading"
          aria-label="Zoom out"
        >
          –
        </button>

        <button
          class="px-3 py-2 rounded-xl border text-lg font-bold leading-none"
          @click="zoomIn"
          :disabled="loading"
          aria-label="Zoom in"
        >
          +
        </button>

        <button
          class="px-3 py-2 rounded-xl border text-sm font-bold whitespace-nowrap"
          @click="fitWidth"
          :disabled="loading"
        >
          Fit
        </button>
      </div>
    </div>

    <!-- Canvas area -->
    <div ref="stageEl" class="flex-1 min-h-0 overflow-auto bg-gray-100 relative">
      <div class="min-h-full flex items-start justify-center p-3">
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <canvas ref="canvasEl" />
        </div>
      </div>

      <!-- Loading overlay -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
        <div class="px-4 py-2 rounded-xl bg-white shadow text-sm font-semibold text-gray-700">
          Loading PDF…
        </div>
      </div>

      <div v-if="errorMsg" class="p-4 text-sm text-red-600">
        {{ errorMsg }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'

// IMPORTANT: set worker (Vite-friendly path)
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url'
;(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfWorker

const props = defineProps<{
  url: string | null
}>()

const canvasEl = ref<HTMLCanvasElement | null>(null)
const stageEl = ref<HTMLDivElement | null>(null)

const loading = ref(false)
const errorMsg = ref('')
const page = ref(1)
const numPages = ref<number | null>(null)
const scale = ref(1) // we will compute fit-width properly

let pdfDoc: any = null
let resizeObs: ResizeObserver | null = null

function clampScale(v: number) {
  return Math.max(0.6, Math.min(3.5, v))
}

async function render() {
  if (!props.url || !canvasEl.value || !pdfDoc) return

  loading.value = true
  errorMsg.value = ''

  try {
    const p = await pdfDoc.getPage(page.value)
    const viewport = p.getViewport({ scale: scale.value })

    const canvas = canvasEl.value
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context unavailable')

    // ✅ DPR scaling for crisp text + correct zoom feel
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.floor(viewport.width * dpr)
    canvas.height = Math.floor(viewport.height * dpr)
    canvas.style.width = `${Math.floor(viewport.width)}px`
    canvas.style.height = `${Math.floor(viewport.height)}px`

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    await p.render({ canvasContext: ctx, viewport }).promise
  } catch (e: any) {
    errorMsg.value = e?.message ?? String(e)
  } finally {
    loading.value = false
  }
}

async function loadPdf() {
  if (!props.url) return

  loading.value = true
  errorMsg.value = ''
  page.value = 1
  numPages.value = null
  pdfDoc = null

  try {
    const task = pdfjsLib.getDocument({
      url: props.url,
      withCredentials: false
    } as any)

    pdfDoc = await task.promise
    numPages.value = pdfDoc.numPages

    // ✅ on load, fit width first (mobile-friendly default)
    await fitWidth()
  } catch (e: any) {
    errorMsg.value = e?.message ?? String(e)
  } finally {
    loading.value = false
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value -= 1
    render()
  }
}
function nextPage() {
  if (numPages.value && page.value < numPages.value) {
    page.value += 1
    render()
  }
}

function zoomIn() {
  scale.value = clampScale(scale.value + 0.2)
  render()
}
function zoomOut() {
  scale.value = clampScale(scale.value - 0.2)
  render()
}

/**
 * ✅ Real fit-to-width:
 * Uses the stage container width and computes the scale based on PDF page width at scale=1.
 */
async function fitWidth() {
  if (!pdfDoc || !stageEl.value) return

  const p = await pdfDoc.getPage(page.value)
  const base = p.getViewport({ scale: 1 })

  // container width minus padding (stage has p-3 -> ~24px each side)
  const containerWidth = stageEl.value.clientWidth
  const usable = Math.max(200, containerWidth - 48)

  const newScale = clampScale(usable / base.width)
  scale.value = newScale

  await render()
}

watch(() => props.url, () => loadPdf(), { immediate: true })

// ✅ Re-fit on resize/orientation change (important for mobile)
watch(
  () => stageEl.value,
  (el) => {
    resizeObs?.disconnect()
    resizeObs = null

    if (!el) return
    resizeObs = new ResizeObserver(() => {
      // only auto-fit if user hasn't zoomed too much? (simple approach: always refit)
      // This keeps it readable when phone rotates
      fitWidth()
    })
    resizeObs.observe(el)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  resizeObs?.disconnect()
  resizeObs = null
  pdfDoc = null
})
</script>
