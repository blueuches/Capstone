<template>
  <div
    class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-190px)] flex flex-col"
  >
    <!-- Header -->
    <div class="bg-[#42ad43] px-4 py-3">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-extrabold text-white">OSCA Review Form</h2>

        <div v-if="isMultiStep" class="text-[11px] font-extrabold text-white/95">
          Step {{ currentStep + 1 }} / {{ steps.length }}
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="p-4 overflow-y-auto flex-1 min-h-0">
      <!-- Loading -->
      <div v-if="loading" class="text-sm text-gray-600">
        Loading form fields…
      </div>

      <!-- Empty -->
      <div v-else-if="filteredFields.length === 0" class="text-sm text-gray-600">
        No fields found for section <span class="font-bold">{{ onlySection }}</span>.
      </div>

      <!-- Content -->
      <div v-else class="space-y-4">
        <!-- Fields -->
        <div v-for="field in currentFields" :key="field.field_key" class="space-y-1">
          <div class="flex items-center justify-between gap-2">
            <label class="text-xs font-extrabold text-gray-900">
              {{ field.label }}
              <span v-if="field.required" class="text-red-500">*</span>
            </label>

            <span
              class="text-[10px] font-extrabold px-2 py-0.5 rounded-full border"
              :class="badgeClass(field)"
            >
              {{ fieldBadge(field) }}
            </span>
          </div>

          <!-- TEXT -->
          <input
            v-if="field.field_type === 'text'"
            v-model="values[field.field_key]"
            type="text"
            class="w-full px-3 py-2 rounded-xl border-2 border-[#42ad43] focus:outline-none focus:ring-2 focus:ring-[#42ad43]/30 text-sm"
            :placeholder="field.placeholder || 'Type here...'"
          />

          <!-- NUMBER -->
          <input
            v-else-if="field.field_type === 'number'"
            v-model.number="values[field.field_key]"
            type="number"
            class="w-full px-3 py-2 rounded-xl border-2 border-[#42ad43] focus:outline-none focus:ring-2 focus:ring-[#42ad43]/30 text-sm"
            :placeholder="field.placeholder || 'Enter number...'"
          />

          <!-- DATE -->
          <input
            v-else-if="field.field_type === 'date'"
            v-model="values[field.field_key]"
            type="date"
            class="w-full px-3 py-2 rounded-xl border-2 border-[#42ad43] focus:outline-none focus:ring-2 focus:ring-[#42ad43]/30 text-sm"
          />

          <!-- CHECKBOX -->
          <label v-else-if="field.field_type === 'checkbox'" class="inline-flex items-center gap-2">
            <input
              type="checkbox"
              class="w-4 h-4 accent-[#42ad43]"
              v-model="values[field.field_key]"
            />
            <span class="text-xs font-bold text-gray-700">Yes</span>
          </label>

          <!-- SELECT -->
          <select
            v-else-if="field.field_type === 'select'"
            v-model="values[field.field_key]"
            class="w-full px-3 py-2 rounded-xl border-2 border-[#42ad43] focus:outline-none focus:ring-2 focus:ring-[#42ad43]/30 text-sm bg-white"
          >
            <option value="" disabled>Select…</option>
            <option
              v-for="opt in getChoices(field)"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>

          <!-- RADIO -->
          <div v-else-if="field.field_type === 'radio'" class="space-y-2">
            <label
              v-for="opt in getChoices(field)"
              :key="opt.value"
              class="flex items-center gap-2"
            >
              <input
                type="radio"
                class="w-4 h-4 accent-[#42ad43]"
                :name="field.field_key"
                :value="opt.value"
                v-model="values[field.field_key]"
              />
              <span class="text-xs font-bold text-gray-700">{{ opt.label }}</span>
            </label>
          </div>

          <!-- MULTISELECT -->
          <div v-else-if="field.field_type === 'multiselect'" class="space-y-2">
            <label
              v-for="opt in getChoices(field)"
              :key="opt.value"
              class="flex items-center gap-2"
            >
              <input
                type="checkbox"
                class="w-4 h-4 accent-[#42ad43]"
                :value="opt.value"
                v-model="values[field.field_key]"
              />
              <span class="text-xs font-bold text-gray-700">{{ opt.label }}</span>
            </label>
          </div>

          <!-- FALLBACK -->
          <input
            v-else
            v-model="values[field.field_key]"
            type="text"
            class="w-full px-3 py-2 rounded-xl border-2 border-[#42ad43] focus:outline-none focus:ring-2 focus:ring-[#42ad43]/30 text-sm"
            :placeholder="field.placeholder || 'Type here...'"
          />

          <p v-if="fieldErrors[field.field_key]" class="text-xs font-bold text-red-600">
            {{ fieldErrors[field.field_key] }}
          </p>
        </div>

        <!-- Reviewed By -->
        <div class="pt-2">
          <div class="text-xs font-extrabold text-gray-900 mb-1">Reviewed By</div>
          <input
            v-model="reviewedBy"
            type="text"
            class="w-full px-3 py-2 rounded-xl border-2 border-[#42ad43] focus:outline-none focus:ring-2 focus:ring-[#42ad43]/30 text-sm"
            placeholder="Reviewer name"
          />
          <p v-if="fieldErrors.__reviewedBy" class="text-xs font-bold text-red-600">
            {{ fieldErrors.__reviewedBy }}
          </p>
        </div>

        <!-- Step navigation -->
        <div v-if="isMultiStep" class="flex items-center justify-between pt-2">
          <button
            class="px-3 py-2 rounded-xl text-xs font-extrabold border-2 border-[#42ad43] text-gray-900 bg-white disabled:opacity-40"
            :disabled="currentStep === 0"
            @click="prevStep"
          >
            Prev
          </button>

          <div class="text-[11px] font-bold text-gray-500">
            {{ stepHint }}
          </div>

          <button
            class="px-3 py-2 rounded-xl text-xs font-extrabold border-2 border-[#42ad43] text-gray-900 bg-white disabled:opacity-40"
            :disabled="currentStep === steps.length - 1"
            @click="nextStep"
          >
            Next
          </button>
        </div>

        <!-- Bottom buttons -->
        <div class="flex items-center justify-between pt-3 gap-2">
          <button
            class="flex-1 px-3 py-2 rounded-xl text-xs font-extrabold border-2 border-[#42ad43] text-gray-900 bg-white hover:bg-gray-50 transition"
            @click="openDraftModal = true"
          >
            Save as Draft
          </button>

          <button
            class="flex-1 px-3 py-2 rounded-xl text-xs font-extrabold border-2 border-[#42ad43] text-gray-900 bg-white hover:bg-gray-50 transition"
            @click="openSubmitModal = true"
          >
            Submit
          </button>
        </div>
      </div>
    </div>

    <!-- Draft confirm -->
    <ConfirmationModal
      :open="openDraftModal"
      title="Save as draft?"
      message="This will save your current inputs as a draft. You can continue editing later."
      confirmText="Save Draft"
      cancelText="Cancel"
      @cancel="openDraftModal = false"
      @confirm="saveDraft"
    />

    <!-- Submit confirm -->
    <ConfirmationModal
      :open="openSubmitModal"
      title="Submit form?"
      message="This will submit the OSCA section. Please ensure all required fields are completed."
      confirmText="Submit"
      cancelText="Cancel"
      @cancel="openSubmitModal = false"
      @confirm="submitForm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect } from 'vue'
import ConfirmationModal from '@/components/ConfirmModal.vue'

export type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'multiselect'

export type DependsOn =
  | { op: 'equals'; field_key: string; value: any }
  | { op: 'contains'; field_key: string; value: any }
  | { op: 'not_empty'; field_key: string }
  | { op: 'in'; field_key: string; value: any[] }

export type FormField = {
  id: string
  form_id?: string
  section: string
  label: string
  field_key: string
  pdf_field_name?: string | null
  field_type: FieldType
  required?: boolean
  sort_order?: number
  options?: any // DB jsonb: { choices: [...], pdf_mapping: {...} }
  depends_on?: DependsOn | null
  placeholder?: string | null
}

const props = defineProps<{
  fields: FormField[]
  onlySection: string
  reviewerName?: string
  loading?: boolean
}>()

type Choice = { label: string; value: string }

// Your DB options structure is: { choices: [{label,value}], pdf_mapping: {...} }
function getChoices(field: FormField): Choice[] {
  const raw = field.options
  if (!raw) return []
  if (Array.isArray(raw)) return raw as Choice[] // fallback if you ever store array directly
  if (Array.isArray(raw.choices)) return raw.choices as Choice[]
  if (Array.isArray(raw.options)) return raw.options as Choice[] // extra fallback
  return []
}

// ---- state ----
const values = reactive<Record<string, any>>({})
const reviewedBy = ref('')

// prefill reviewedBy
watchEffect(() => {
  if (!reviewedBy.value && props.reviewerName) reviewedBy.value = props.reviewerName
})

// ensure multiselect fields are arrays
watch(
  () => props.fields,
  () => {
    for (const f of props.fields || []) {
      if (f.field_type === 'multiselect' && !Array.isArray(values[f.field_key])) {
        values[f.field_key] = []
      }
      if (f.field_type === 'checkbox' && typeof values[f.field_key] !== 'boolean') {
        values[f.field_key] = !!values[f.field_key]
      }
    }
  },
  { immediate: true }
)

// ---- depends_on evaluation ----
function isFieldVisible(field: FormField): boolean {
  if (!field.depends_on) return true
  const d = field.depends_on as any
  const parentVal = values[d.field_key]

  if (d.op === 'equals') return parentVal === d.value

  if (d.op === 'not_empty') {
    if (Array.isArray(parentVal)) return parentVal.length > 0
    return parentVal !== null && parentVal !== undefined && String(parentVal).trim() !== ''
  }

  if (d.op === 'contains') {
    // common for multiselect / checkbox group
    if (Array.isArray(parentVal)) return parentVal.includes(d.value)
    // allow string contains too
    if (typeof parentVal === 'string') return parentVal.includes(d.value)
    return false
  }

  if (d.op === 'in') {
    return Array.isArray(d.value) ? d.value.includes(parentVal) : false
  }

  return true
}

// ---- filter + sort + apply depends_on ----
const filteredFields = computed(() =>
  (props.fields || [])
    .filter((f) => f.section === props.onlySection)
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
)

const visibleFieldsSorted = computed(() => filteredFields.value.filter((f) => isFieldVisible(f)))

// If dependencies change, make sure currentStep is valid
watch(
  () => visibleFieldsSorted.value.length,
  () => {
    if (currentStep.value > steps.value.length - 1) currentStep.value = Math.max(0, steps.value.length - 1)
  }
)

// ---- multistep ----
const MAX_PER_STEP = 4

const steps = computed(() => {
  const arr = visibleFieldsSorted.value
  if (arr.length <= MAX_PER_STEP) return [arr]
  const chunks: FormField[][] = []
  for (let i = 0; i < arr.length; i += MAX_PER_STEP) chunks.push(arr.slice(i, i + MAX_PER_STEP))
  return chunks
})

const currentStep = ref(0)
const isMultiStep = computed(() => steps.value.length > 1)
const currentFields = computed(() => steps.value[currentStep.value] ?? [])

const stepHint = computed(() => {
  if (!isMultiStep.value) return 'All fields'
  const start = currentStep.value * MAX_PER_STEP + 1
  const end = Math.min((currentStep.value + 1) * MAX_PER_STEP, visibleFieldsSorted.value.length)
  return `Fields ${start}-${end} of ${visibleFieldsSorted.value.length}`
})

function nextStep() {
  currentStep.value = Math.min(currentStep.value + 1, steps.value.length - 1)
}
function prevStep() {
  currentStep.value = Math.max(currentStep.value - 1, 0)
}

// ---- validation ----
const fieldErrors = reactive<Record<string, string>>({})

function validateRequired() {
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])

  for (const f of visibleFieldsSorted.value) {
    if (!f.required) continue
    const v = values[f.field_key]

    const empty =
      v === null ||
      v === undefined ||
      (typeof v === 'string' && v.trim() === '') ||
      (f.field_type === 'select' && (v === '' || v === undefined)) ||
      (f.field_type === 'multiselect' && Array.isArray(v) && v.length === 0)

    if (empty) fieldErrors[f.field_key] = 'This field is required.'
  }

  if (!reviewedBy.value.trim()) fieldErrors.__reviewedBy = 'Reviewer name is required.'
  return Object.keys(fieldErrors).length === 0
}

function fieldBadge(field: FormField) {
  return field.required ? 'REQUIRED' : 'OPTIONAL'
}
function badgeClass(field: FormField) {
  return field.required
    ? 'border-[#42ad43]/40 bg-[#42ad43]/10 text-[#2f8b31]'
    : 'border-gray-200 bg-gray-50 text-gray-600'
}

// ---- modals ----
const openDraftModal = ref(false)
const openSubmitModal = ref(false)

function saveDraft() {
  openDraftModal.value = false
  alert(
    `Saved draft (temporary).\n\nValues: ${JSON.stringify(values)}\nReviewed By: ${reviewedBy.value}\n\nHook this to Supabase later.`
  )
}

function submitForm() {
  const ok = validateRequired()
  if (!ok) {
    openSubmitModal.value = false

    if (isMultiStep.value) {
      const errKey = Object.keys(fieldErrors).find((k) => k !== '__reviewedBy')
      if (errKey) {
        const idx = visibleFieldsSorted.value.findIndex((f) => f.field_key === errKey)
        if (idx >= 0) currentStep.value = Math.floor(idx / MAX_PER_STEP)
      }
    }

    alert('Please complete required fields.')
    return
  }

  openSubmitModal.value = false
  alert(
    `Submitted (temporary).\n\nValues: ${JSON.stringify(values)}\nReviewed By: ${reviewedBy.value}\n\nHook this to Supabase later.`
  )
}
</script>
