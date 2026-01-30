<template>
  <div v-if="open" class="fixed inset-0 z-[70] pointer-events-none">
    <!-- Floating panel -->
    <div
      ref="panelRef"
      class="pointer-events-auto fixed w-[92vw] sm:w-[520px] max-w-[520px] bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
      :style="{ top: `${pos.y}px`, left: `${pos.x}px` }"
    >
      <!-- Header (drag handle) -->
      <div
        class="px-4 py-3 border-b flex items-center justify-between bg-white cursor-move select-none"
        @mousedown="startDrag"
        @touchstart.prevent="startDragTouch"
      >
        <div class="min-w-0">
          <p class="text-sm font-extrabold text-gray-900 truncate">
            {{ title || 'Form Answers' }}
          </p>
          <p class="text-[11px] text-gray-500 truncate">
            {{ statusLabel }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1.5 rounded-xl text-xs font-extrabold border-2 border-gray-200 hover:bg-gray-50"
            @click="reload"
            title="Reload"
          >
            Reload
          </button>

          <button
            class="w-9 h-9 rounded-2xl border-2 border-gray-200 hover:bg-gray-50 flex items-center justify-center"
            @click="emit('close')"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-4 max-h-[70vh] overflow-auto bg-gray-50">
        <div v-if="loading" class="text-sm font-semibold text-gray-600">
          Loading answers…
        </div>

        <div v-else-if="errorMsg" class="bg-white border border-red-200 rounded-2xl p-4">
          <p class="text-sm font-extrabold text-red-700 mb-1">Couldn’t load answers</p>
          <p class="text-xs text-gray-600">{{ errorMsg }}</p>
        </div>

        <div v-else>
          <div v-if="answers.length === 0" class="bg-white border rounded-2xl p-4">
            <p class="text-sm font-extrabold text-gray-900 mb-1">No answers found</p>
            <p class="text-xs text-gray-600">
              If this submission is a draft, it may not have stored answers yet.
            </p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="a in answers"
              :key="a.field_id"
              class="bg-white border border-gray-200 rounded-2xl p-3"
            >
              <p class="text-xs font-extrabold text-gray-900">
                {{ a.label }}
                <span v-if="a.required" class="text-red-500">*</span>
              </p>

              <div class="text-sm text-gray-900 whitespace-pre-wrap break-words">
                <template v-if="a.display_value">
                  {{ a.display_value }}
                </template>
                <template v-else>
                  <span class="text-gray-400 italic">No answer</span>
                </template>
              </div>
<!-- 
              <div v-if="a.answered_at" class="mt-2 text-[11px] text-gray-500">
                Answered: {{ formatDateTime(a.answered_at) }}
              </div> -->
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 border-t bg-white">
        <p class="text-[11px] text-gray-500 truncate">
          Form Submission ID: {{ formSubmissionId || '—' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { supabase } from '@/supabase/client'

type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'multiselect'

type AnswerRow = {
  field_id: string
  label: string
  required: boolean
  sort_order: number
  field_type: FieldType
  value: any
  display_value: string
  answered_at?: string | null
}

const props = defineProps<{
  open: boolean
  title?: string
  formSubmissionId?: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const loading = ref(false)
const errorMsg = ref('')
const answers = ref<AnswerRow[]>([])
const submissionStatus = ref<string>('')

const statusLabel = computed(() => {
  if (!submissionStatus.value) return ''
  return `Status: ${submissionStatus.value.toUpperCase()}`
})

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

function normalizeValueToDisplay(v: any): string {
  if (v === null || v === undefined) return ''
  // because schema stores jsonb, you might get:
  // - primitive: "Juan", 12, true
  // - array: ["A","B"]
  // - object: { ... } (rare, but possible)
  if (typeof v === 'string') return v
  if (typeof v === 'number') return String(v)
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  if (Array.isArray(v)) return v.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(', ')
  if (typeof v === 'object') return JSON.stringify(v, null, 2)
  return String(v)
}

async function loadAnswers() {
  answers.value = []
  errorMsg.value = ''
  submissionStatus.value = ''

  if (!props.formSubmissionId) return

  loading.value = true
  try {
    // 1) load submission status (draft/submitted/locked)
    const { data: sub, error: subErr } = await supabase
      .from('form_submissions')
      .select('id,status')
      .eq('id', props.formSubmissionId)
      .single()

    if (subErr) throw subErr
    submissionStatus.value = sub?.status || ''

    // 2) load answers joined to fields
    // form_answers -> form_fields (label, type, required, sort_order)
    const { data, error } = await supabase
      .from('form_answers')
      .select(
        `
        field_id,
        value,
        answered_at,
        form_fields:form_fields(
          id,
          label,
          required,
          sort_order,
          field_type
        )
      `
      )
      .eq('form_submission_id', props.formSubmissionId)

    if (error) throw error

    const mapped: AnswerRow[] = (data || []).map((r: any) => {
      const f = r?.form_fields
      const value = r?.value
      return {
        field_id: r.field_id,
        label: f?.label || 'Unnamed field',
        required: !!f?.required,
        sort_order: Number(f?.sort_order ?? 0),
        field_type: (String(f?.field_type || 'text').toLowerCase() as FieldType) || 'text',
        value,
        display_value: normalizeValueToDisplay(value),
        answered_at: r?.answered_at || null,
      }
    })

    answers.value = mapped.sort((a, b) => a.sort_order - b.sort_order)
  } catch (e: any) {
    errorMsg.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
}

function reload() {
  loadAnswers()
}

/** Floating + draggable logic */
const panelRef = ref<HTMLElement | null>(null)
const pos = ref({ x: 24, y: 120 })
let dragging = false
let start = { x: 0, y: 0 }
let startPos = { x: 0, y: 0 }

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function moveTo(nx: number, ny: number) {
  const w = panelRef.value?.offsetWidth || 520
  const h = panelRef.value?.offsetHeight || 300
  const maxX = window.innerWidth - w - 12
  const maxY = window.innerHeight - h - 12
  pos.value.x = clamp(nx, 12, Math.max(12, maxX))
  pos.value.y = clamp(ny, 12, Math.max(12, maxY))
}

function onMove(e: MouseEvent) {
  if (!dragging) return
  moveTo(startPos.x + (e.clientX - start.x), startPos.y + (e.clientY - start.y))
}

function onUp() {
  dragging = false
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onUp)
}

function startDrag(e: MouseEvent) {
  dragging = true
  start = { x: e.clientX, y: e.clientY }
  startPos = { ...pos.value }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

function onMoveTouch(e: TouchEvent) {
  if (!dragging) return
  const t = e.touches[0]
  moveTo(startPos.x + (t.clientX - start.x), startPos.y + (t.clientY - start.y))
}

function onUpTouch() {
  dragging = false
  window.removeEventListener('touchmove', onMoveTouch)
  window.removeEventListener('touchend', onUpTouch)
}

function startDragTouch(e: TouchEvent) {
  dragging = true
  const t = e.touches[0]
  start = { x: t.clientX, y: t.clientY }
  startPos = { ...pos.value }
  window.addEventListener('touchmove', onMoveTouch, { passive: false })
  window.addEventListener('touchend', onUpTouch)
}

function onResize() {
  moveTo(pos.value.x, pos.value.y)
}

onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

watch(
  () => [props.open, props.formSubmissionId],
  ([open]) => {
    if (open) {
      // reset to a sane place (top-right-ish)
      const defaultX = Math.max(12, window.innerWidth - 520 - 24)
      pos.value = { x: defaultX, y: 120 }
      loadAnswers()
    }
  }
)
</script>
