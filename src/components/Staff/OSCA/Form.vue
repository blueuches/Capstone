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
import { computed, reactive, ref, watch, watchEffect, onMounted } from 'vue'
import ConfirmationModal from '@/components/ConfirmModal.vue'
import { supabase } from '@/supabase/client'

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
  options?: any
  depends_on?: DependsOn | null
  placeholder?: string | null
}

const props = defineProps<{
  fields: FormField[]
  onlySection: 'A_APPLICANT' | 'B_OSCA' | string
  reviewerName?: string
  loading?: boolean

  // NEW
  formSubmissionId: string
  applicationRequirementId: string
  currentUserId: string
  lockOnSubmit?: boolean // if true, set form_submissions.status='locked' on submit
}>()

type Choice = { label: string; value: string }

function getChoices(field: FormField): Choice[] {
  const raw = field.options
  if (!raw) return []
  if (Array.isArray(raw)) return raw as Choice[]
  if (Array.isArray(raw.choices)) return raw.choices as Choice[]
  if (Array.isArray(raw.options)) return raw.options as Choice[]
  return []
}

// ---------------- state ----------------
const values = reactive<Record<string, any>>({})
const reviewedBy = ref('')
const saving = ref(false)

watchEffect(() => {
  if (!reviewedBy.value && props.reviewerName) reviewedBy.value = props.reviewerName
})

// ensure multiselect fields are arrays, checkbox is boolean
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

// ---------------- depends_on ----------------
function isFieldVisible(field: FormField): boolean {
  if (!field.depends_on) return true
  const d: any = field.depends_on
  const parentVal = values[d.field_key]

  if (d.op === 'equals') return parentVal === d.value

  if (d.op === 'not_empty') {
    if (Array.isArray(parentVal)) return parentVal.length > 0
    return parentVal !== null && parentVal !== undefined && String(parentVal).trim() !== ''
  }

  if (d.op === 'contains') {
    if (Array.isArray(parentVal)) return parentVal.includes(d.value)
    if (typeof parentVal === 'string') return parentVal.includes(d.value)
    return false
  }

  if (d.op === 'in') {
    return Array.isArray(d.value) ? d.value.includes(parentVal) : false
  }

  return true
}

// ---------------- fields lists ----------------
const filteredFields = computed(() =>
  (props.fields || [])
    .filter((f) => f.section === props.onlySection)
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
)

const visibleFieldsSorted = computed(() => filteredFields.value.filter((f) => isFieldVisible(f)))

// ---------------- multistep ----------------
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

watch(
  () => steps.value.length,
  () => {
    if (currentStep.value > steps.value.length - 1) currentStep.value = Math.max(0, steps.value.length - 1)
  }
)

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

// ---------------- validation ----------------
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

  // Optional: keep reviewer name optional because it isn't stored in DB directly
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

// ---------------- modals ----------------
const openDraftModal = ref(false)
const openSubmitModal = ref(false)

// ---------------- data loading ----------------
// Load ALL answers for this submission (A + B) so depends_on works.
async function loadExistingAnswers() {
  if (!props.formSubmissionId) return

  const { data, error } = await supabase
    .from('form_answers')
    .select(
      `
      id,
      field_id,
      value,
      answered_by,
      field:form_fields(id, field_key, section)
    `
    )
    .eq('form_submission_id', props.formSubmissionId)

  if (error) {
    console.error('loadExistingAnswers error:', error)
    return
  }

  for (const row of data || []) {
    const fieldKey = (row as any)?.field?.field_key
    if (!fieldKey) continue
    values[fieldKey] = row.value
  }
}

onMounted(loadExistingAnswers)

watch(
  () => props.formSubmissionId,
  async (id) => {
    if (!id) return
    await loadExistingAnswers()
  },
  { immediate: true }
)

// normalize after loading to match input types
for (const f of props.fields || []) {
  if (f.field_type === 'checkbox') {
    values[f.field_key] = !!values[f.field_key]
  }
  if (f.field_type === 'multiselect') {
    if (!Array.isArray(values[f.field_key])) {
      values[f.field_key] = values[f.field_key] ? [values[f.field_key]] : []
    }
  }
}

// ---------------- save logic ----------------
function getOschaEditableFields() {
  return (props.fields || []).filter((f) => f.section === props.onlySection)
}

async function saveOschaSection(statusAfter: 'draft' | 'locked') {
  if (!props.formSubmissionId || !props.currentUserId) {
    alert('Missing formSubmissionId / user context.')
    return
  }

  const editableFields = getOschaEditableFields()
  const fieldIds = editableFields.map((f) => f.id)

  saving.value = true
  try {
    // 1) Don't allow writing if already locked
    const { data: sub, error: subErr } = await supabase
      .from('form_submissions')
      .select('id,status')
      .eq('id', props.formSubmissionId)
      .single()
    if (subErr) throw subErr

    if (String(sub.status).toLowerCase() === 'locked') {
      alert('This form is already locked.')
      return
    }

    // 2) Delete previous OSCA answers (to avoid duplicates without a unique constraint)
    if (fieldIds.length > 0) {
      const { error: delErr } = await supabase
        .from('form_answers')
        .delete()
        .eq('form_submission_id', props.formSubmissionId)
        .eq('answered_by', props.currentUserId)
        .in('field_id', fieldIds)
      if (delErr) throw delErr
    }

    // 3) Insert fresh answers
    const payload = editableFields.map((f) => ({
      form_submission_id: props.formSubmissionId,
      field_id: f.id,
      value: values[f.field_key] ?? null,
      answered_by: props.currentUserId,
    }))

    if (payload.length > 0) {
      const { error: insErr } = await supabase.from('form_answers').insert(payload)
      if (insErr) throw insErr
    }

    // 4) Update form_submissions.status
    const nextStatus = statusAfter
    const { error: updErr } = await supabase
      .from('form_submissions')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', props.formSubmissionId)
    if (updErr) throw updErr

    alert(statusAfter === 'draft' ? 'Draft saved.' : 'OSCA section submitted & locked.')
  } catch (e: any) {
    console.error('saveOschaSection error:', e)
    alert(e?.message || 'Failed to save.')
  } finally {
    saving.value = false
  }
}

async function saveDraft() {
  openDraftModal.value = false
  await saveOschaSection('draft')
}

async function submitForm() {
  const ok = validateRequired()
  if (!ok) {
    openSubmitModal.value = false

    // focus step with first error
    if (isMultiStep.value) {
      const errKey = Object.keys(fieldErrors)[0]
      if (errKey) {
        const idx = visibleFieldsSorted.value.findIndex((f) => f.field_key === errKey)
        if (idx >= 0) currentStep.value = Math.floor(idx / MAX_PER_STEP)
      }
    }

    alert('Please complete required fields.')
    return
  }

  openSubmitModal.value = false
  await saveOschaSection(props.lockOnSubmit ? 'locked' : 'draft')
}
</script>

