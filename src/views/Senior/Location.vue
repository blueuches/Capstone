<template>
  <div class="h-screen overflow-hidden bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <main class="flex-1 px-4 pt-4 overflow-y-auto">
      <!-- Breadcrumb -->
      <RouterLink
        to="/senior/dashboard"
        class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4"
      >
        <component :is="Left" class="w-5 h-5 text-yellow-500" />
        <span class="text-gray-500">Dashboard</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900">Location</span>
      </RouterLink>

      <!-- Title + hint -->
      <div class="mb-3">
        <h1 class="text-lg font-bold text-gray-900">OSCA Location</h1>
        <p class="text-sm text-gray-600">
          Use the map below and follow the guide for multicab/tricycle stops.
        </p>
      </div>

      <!-- Map Card (Zoomable Image) -->
      <section class="bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-200">
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-50">
              <!-- Pin icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-600" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 11c.828 0 1.5-.672 1.5-1.5S12.828 8 12 8s-1.5.672-1.5 1.5S11.172 11 12 11z" />
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 21s8-7.373 8-11.5A8 8 0 1 0 4 9.5C4 13.627 12 21 12 21z" />
              </svg>
            </span>
            <p class="font-semibold text-gray-900">OSCA Butuan Main Office</p>
          </div>
        </div>

        <!-- Zoom container -->
        <div
          ref="viewportRef"
          class="relative w-full h-64 sm:h-72 bg-gray-50 overflow-hidden touch-none select-none"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @wheel.prevent="onWheel"
        >
          <!-- Hint overlay -->
          <div class="absolute top-3 left-3 z-10">
            <span class="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
              Drag to move • Scroll to zoom
            </span>
          </div>

          <img
            ref="imgRef"
            src="/locationmap.png"
            alt="OSCA location map"
            class="absolute top-1/2 left-1/2 max-w-none"
            :style="imgStyle"
            draggable="false"
            @load="onImgLoad"
          />

        </div>
      </section>

      <!-- Quick Info Cards -->
      <section class="mt-4 grid gap-3">
        <!-- Office Details -->
        <div class="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-200">
          <div class="flex items-start gap-3">
            <span class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50">
              <!-- Building icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h1m-1 3h1m-1 3h1m4-6h1m-1 3h1m-1 3h1" />
              </svg>
            </span>

            <div class="min-w-0">
              <h2 class="text-base font-bold text-gray-900">Office Details</h2>
              <p class="text-sm text-gray-700 mt-1">
                J.P. Rosales Avenue, Butuan City
              </p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  Mon–Fri
                </span>
                <span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  8:00 AM – 5:00 PM
                </span>
              </div>

              <div class="mt-3 rounded-xl bg-gray-50 p-3 ring-1 ring-gray-200">
                <p class="text-xs font-semibold text-gray-700 mb-1">Important Stop</p>
                <p class="text-xs text-gray-600 leading-relaxed">
                  Get off the multicab at <span class="font-semibold text-gray-700">INC Church</span> or
                  <span class="font-semibold text-gray-700">DPWH building</span>.
                  There’s a crossing that leads to the office — refer to the map above.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Directions by Area (simple + clear) -->
        <div class="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-200">
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-50">
              <!-- Compass icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-600" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l3 7-3 11-3-11 3-7z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 10h14" />
              </svg>
            </span>
            <h2 class="text-base font-bold text-gray-900">Directions (by area)</h2>
          </div>

          <div class="grid grid-cols-2 gap-3 text-sm text-gray-700">
            <div class="rounded-xl bg-gray-50 p-3 ring-1 ring-gray-200">
              <p class="text-xs font-bold text-gray-900">East</p>
              <p class="text-sm mt-1">Ampayon</p>
            </div>

            <div class="rounded-xl bg-gray-50 p-3 ring-1 ring-gray-200">
              <p class="text-xs font-bold text-gray-900">West</p>
              <p class="text-sm mt-1">Libertad</p>
            </div>

            <div class="rounded-xl bg-gray-50 p-3 ring-1 ring-gray-200">
              <p class="text-xs font-bold text-gray-900">North</p>
              <p class="text-sm mt-1">Obrero, Ong Yiu</p>
            </div>

            <div class="rounded-xl bg-gray-50 p-3 ring-1 ring-gray-200">
              <p class="text-xs font-bold text-gray-900">South</p>
              <p class="text-sm mt-1">San Vicente</p>
            </div>
          </div>
        </div>

        <!-- How to Get There (Routes) -->
        <div class="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-200">
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-50">
              <!-- Route icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-600" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 20l-5.447-2.724A2 2 0 0 1 2 15.382V6.618a2 2 0 0 1 1.553-1.954L9 2m0 18l6-3m-6 3V2m6 15l5.447 2.724A2 2 0 0 0 22 17.382V8.618a2 2 0 0 0-1.553-1.954L15 5m0 12V5m0 12l-6 3" />
              </svg>
            </span>
            <h2 class="text-base font-bold text-gray-900">How to Get There</h2>
          </div>

          <div class="rounded-xl bg-gray-50 p-3 ring-1 ring-gray-200">
            <p class="text-sm text-gray-700 leading-relaxed">
              For multicabs, choose a route that passes <span class="font-semibold text-gray-900">J.P. Rosales</span>.
              Get off at <span class="font-semibold text-gray-900">INC Church</span> or
              <span class="font-semibold text-gray-900">DPWH</span>, then cross toward the OSCA office.
            </p>
          </div>

          <div class="mt-3 space-y-3">
            <!-- Route 5 -->
            <div class="border rounded-xl p-3">
              <p class="text-sm font-bold text-gray-900">Route 5 (via J.P. Rosales)</p>
              <p class="text-xs text-gray-600 mt-1 leading-relaxed">
                Sumilihon → Taguibo → Ampayon → Baan → Plaza → SM Mall → J.P. Rosales → (back)
                City Hall → Langihan → Fort Poyohon → Ong Yiu → Jollibee → Dunkin → Baan → Ampayon → Taguibo
              </p>
            </div>

            <!-- Route 4 -->
            <div class="border rounded-xl p-3">
              <p class="text-sm font-bold text-gray-900">Route 4 (via J.P. Rosales)</p>
              <p class="text-xs text-gray-600 mt-1 leading-relaxed">
                Ampayon → Baan → Plaza → Caltex → SJIT → MMACI → Langihan → City Hall → J.P. Rosales → (back)
                SM Mall → Jollibee → Dunkin → Baan → Ampayon
              </p>
            </div>

            <!-- Route 2 -->
            <div class="border rounded-xl p-3">
              <p class="text-sm font-bold text-gray-900">Route 2 (via J.P. Rosales)</p>
              <p class="text-xs text-gray-600 mt-1 leading-relaxed">
                Jollibee/McDo → Urios → Agusan High → Palawan Pawnshop → SJIT → MAACI → Obrero → Langihan → City Hall
                → J.P. Rosales → (back) Gaisano → Almont Hotel → Samping Avenue → BDC → Libertad
              </p>
            </div>

            <!-- Tricycle note -->
            <div class="rounded-xl bg-yellow-50 p-3 ring-1 ring-yellow-200">
              <p class="text-sm font-semibold text-gray-900">Tricycle</p>
              <p class="text-xs text-gray-700 mt-1">
                If riding a tricycle, tell the driver: <span class="font-semibold">INC Church</span> or <span class="font-semibold">DPWH</span>.
                That’s the closest stop before crossing to OSCA.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import Left from '@/assets/icons/senior/left-arrow.svg'

const open = ref(false)

const viewportRef = ref<HTMLDivElement | null>(null)
const imgRef = ref<HTMLImageElement | null>(null)

// scale refs
const scale = ref(1)
const fitScale = ref(1)
const minScale = ref(1)
const maxScale = ref(4)

// pan refs
const translateX = ref(0)
const translateY = ref(0)

const dragging = ref(false)
let startX = 0
let startY = 0
let startTX = 0
let startTY = 0

const imgStyle = computed(() => {
  return {
    transform: `translate(${translateX.value}px, ${translateY.value}px) translate(-50%, -50%) scale(${scale.value})`,
    transformOrigin: 'center',
    willChange: 'transform'
  }
})

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

/**
 * Fit the whole image inside the viewport (like "contain")
 */
function computeFit() {
  const vp = viewportRef.value
  const img = imgRef.value
  if (!vp || !img) return
  if (!img.naturalWidth || !img.naturalHeight) return

  const { width: vw, height: vh } = vp.getBoundingClientRect()
  const iw = img.naturalWidth
  const ih = img.naturalHeight

  // padding factor so it doesn't kiss the edges
  const padding = 0.96
  const s = Math.min(vw / iw, vh / ih) * padding

  fitScale.value = s
  minScale.value = s               // ✅ cannot zoom out smaller than "fits-all"
  maxScale.value = s * 4           // ✅ allow big zoom in

  // set initial view to show everything
  scale.value = s
  translateX.value = 0
  translateY.value = 0
}

function resetZoom() {
  scale.value = fitScale.value
  translateX.value = 0
  translateY.value = 0
}

function onImgLoad() {
  // wait for DOM layout, then compute fit
  nextTick(() => computeFit())
}

// Drag to pan
function onPointerDown(e: PointerEvent) {
  dragging.value = true
  ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  startX = e.clientX
  startY = e.clientY
  startTX = translateX.value
  startTY = translateY.value
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  translateX.value = startTX + dx
  translateY.value = startTY + dy
}

function onPointerUp() {
  dragging.value = false
}

// Wheel to zoom (around center; stable)
function onWheel(e: WheelEvent) {
  const step = e.deltaY < 0 ? 0.12 : -0.12
  const next = Number((scale.value + step).toFixed(2))
  scale.value = clamp(next, minScale.value, maxScale.value)

  // if user zooms all the way out, recentre
  if (scale.value === minScale.value) {
    translateX.value = 0
    translateY.value = 0
  }
}

function openFullscreen() {
  window.open('/locationmap.png', '_blank')
}

// recompute fit on resize (so it always shows full map on screen changes)
let ro: ResizeObserver | null = null
onMounted(() => {
  if (viewportRef.value) {
    ro = new ResizeObserver(() => computeFit())
    ro.observe(viewportRef.value)
  }
  // in case image already cached and loaded before @load triggers
  computeFit()
})

onBeforeUnmount(() => {
  dragging.value = false
  ro?.disconnect()
})

</script>
