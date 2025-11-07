<template>
  <div
    class="relative flex items-center justify-center w-screen h-screen bg-gradient-to-b from-emerald-100 via-emerald-50 to-white overflow-hidden"
  >
    <!-- HEADER -->
    <div class="absolute top-4 left-0 right-0 flex items-center justify-between px-6 z-50">
      <router-link
        to="/senior/dashboard"
        class="flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-900 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M15.75 19.5a.75.75 0 0 1-.53-.22L8.97 13.03a.75.75 0 0 1 0-1.06l6.25-6.25a.75.75 0 1 1 1.06 1.06L10.56 12l5.72 5.72a.75.75 0 0 1-.53 1.28z"
          />
        </svg>
        <span class="text-base">Back</span>
      </router-link>

      <button
        @click="saveAsDraft"
        class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M17 3H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 12H4V5h12v10z"
          />
          <path d="M9 7h2v2H9z" />
        </svg>
        Save as Draft
      </button>
    </div>

    <!-- MAIN CONTENT -->
    <main
      class="relative w-[92%] max-w-md h-[90vh] bg-white shadow-2xl rounded-3xl border border-emerald-200 flex flex-col overflow-hidden"
    >
      <header
        class="flex flex-col items-center justify-center py-4 border-b border-emerald-100 bg-white/90 backdrop-blur z-10 relative"
      >
        <h1 class="text-xl font-extrabold text-emerald-700 text-center leading-tight">
          {{ formTitle || 'Application Form' }}
        </h1>
        <div class="w-[85%] mt-4">
          <div class="flex justify-between text-xs font-medium text-gray-600 mb-1">
            <span>Step {{ currentStep }} of {{ totalSteps }}</span>
            <span>{{ stepLabels[currentStep - 1] }}</span>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-2 bg-emerald-600 rounded-full transition-all duration-500"
              :style="{ width: progressWidth }"
            ></div>
          </div>
        </div>
      </header>

      <!-- FORM STEPS -->
      <section class="flex-1 px-6 py-6 overflow-y-auto">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <p v-if="loading" class="text-center text-gray-500">Loading form...</p>

          <template v-else>
            <div
              v-for="(group, i) in stepGroups"
              :key="i"
              v-show="currentStep === i + 1"
              class="animate-fade-in space-y-4"
            >
              <h2 class="font-bold text-emerald-700 text-lg mb-2">{{ stepLabels[i] }}</h2>
              <DynamicField
                v-for="field in group"
                :key="field.id"
                :field="field"
                v-model="formValues[field.id]"
              />
            </div>
          </template>
        </form>
      </section>

      <!-- FOOTER -->
      <footer
        class="flex items-center justify-between px-6 py-5 border-t border-emerald-100 bg-white/90 backdrop-blur z-10"
      >
        <button v-if="currentStep > 1" @click="prevStep" class="btn-secondary">Back</button>

        <button v-if="currentStep < totalSteps" @click="nextStep" class="btn-primary ml-auto">
          Next
        </button>

        <button
          @click="$emit('mic')"
          class="fixed bottom-2 left-1/2 -translate-x-1/2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-5 shadow-2xl focus:ring-4 focus:ring-emerald-300 transition-all z-50"
          title="Tap to Speak"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-7 h-7"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z" />
            <path
              d="M19 11a1 1 0 1 0-2 0 5 5 0 1 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V20H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-2.08A7 7 0 0 0 19 11z"
            />
          </svg>
        </button>

        <button v-if="currentStep === totalSteps" @click="onSubmit" class="btn-primary ml-auto">
          Submit
        </button>
      </footer>
    </main>

    <!-- MODAL -->
    <transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      >
        <div class="bg-white rounded-2xl p-6 max-w-sm text-center shadow-2xl">
          <h2 class="text-lg font-bold text-emerald-700 mb-3">OSCA Personnel Section</h2>
          <p class="text-gray-700 text-sm leading-relaxed mb-5">
            OSCA Personnel will handle this part.<br />
            Please double-check the information you provided.<br />
            If you are finished, click <strong>Save as Draft</strong> and wait for OSCA personnel to
            verify your application.
          </p>
          <button
            @click="confirmModal"
            class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-xl shadow transition"
          >
            Okay
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<!-- components/SmartForm.vue -->
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import DynamicField from '@/components/DynamicField.vue'
import { supabase } from '@/supabase/client'

/* ---------- Props / Emits ---------- */
type Mode = 'senior' | 'osca'
const props = defineProps<{
  programId: number 
  mode: Mode
  maxPerStep?: number
  readOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', payload: { formId: number | null; values: Record<number, any>; mode: Mode }): void
  (e: 'submit', payload: { formId: number | null; values: Record<number, any>; mode: Mode }): void
  (e: 'changed', payload: { values: Record<number, any> }): void
  (e: 'mic'): void
}>()

/* ---------- Types ---------- */
type SectionNorm = 'senior' | 'osca' | 'other'
type Field = {
  id: number
  form_id: number
  label: string
  type: string
  placeholder?: string
  required?: boolean
  options?: any
  section?: string | null
  order_index?: number
  section_norm?: SectionNorm
}

/* ---------- State ---------- */
const formId = ref<number | null>(null)
const formFields = ref<Field[]>([])
const loading = ref(true)
const errorMessage = ref('')

/** answers keyed by field.id (stable across forms) */
const formValues = ref<Record<number, any>>({})

/** role flags derived from props.mode (no auth here) */
const isSenior = computed(() => props.mode === 'senior')
const isOsca = computed(() => props.mode === 'osca')

/** stepper state */
const formTitle = ref('Application Form')
const currentStep = ref(1)
const stepLabels = ref<string[]>([])
const stepGroups = ref<Field[][]>([])
const totalSteps = computed(() => stepGroups.value.length)

/** progress bar */
const progressWidth = computed(() =>
  totalSteps.value ? `${(currentStep.value / totalSteps.value) * 100}%` : '0%',
)

/* ---------- Config ---------- */
const MAX_FIELDS_PER_STEP = computed(() => props.maxPerStep ?? 4)

/* ---------- Helpers ---------- */
function normalizeSection(raw: any): SectionNorm {
  const s = String(raw ?? '').trim().toLowerCase()
  if (['osca', 'osca_section', 'osc', 'staff_osca'].includes(s)) return 'osca'
  if (['senior', 'senior_section', 'sr', 'sc'].includes(s)) return 'senior'
  return 'other'
}
function norm(s?: string | null) {
  return (s || '').trim().toLowerCase()
}
function isChoiceType(t = '') {
  const k = t.toLowerCase()
  return k === 'dropdown' || k === 'select' || k === 'radio' || k === 'checkbox'
}
function computeAge(dob: Date | string): number | null {
  if (!dob) return null
  const d = typeof dob === 'string' ? new Date(dob) : dob
  if (isNaN(+d)) return null
  const today = new Date()
  let age = today.getFullYear() - d.getFullYear()
  const m = today.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
  return age >= 0 ? age : null
}

/* Will hold the IDs we detect from loaded fields */
const dobFieldId = ref<number | null>(null)
const ageFieldId = ref<number | null>(null)

/* ---------- Data Load ---------- */
async function loadForm() {
  loading.value = true
  errorMessage.value = ''

  try {
    // Find form by programId
    const { data: form, error: formError } = await supabase
      .from('Forms')
      .select('id, name, description')
      .eq('program_id', props.programId)
      .single()

    if (formError || !form) {
      errorMessage.value = 'No form found for this program.'
      return
    }

    formId.value = form.id
    formTitle.value = form.name || 'Application Form'

    // Load fields
    const { data: fields, error: fieldError } = await supabase
      .from('FormFields')
      .select('*')
      .eq('form_id', form.id)
      .order('order_index', { ascending: true })

    if (fieldError) {
      errorMessage.value = 'Error fetching form fields.'
      return
    }

    // Keep options as OBJECT for non-choice types (e.g., number/date config)
    formFields.value = (fields || []).map((f: any) => {
      const t = (f.type || '').toLowerCase()
      const opts = isChoiceType(t)
        ? (Array.isArray(f.options)
            ? f.options
            : f.options
              ? Object.values(f.options)
              : [])
        : (f.options ?? null)
      return {
        ...f,
        section_norm: normalizeSection(f.section),
        options: opts,
      } as Field
    })

    // Find DOB & Age fields by label (fallback to regex if labels differ)
    const byExact = (txt: string) =>
      formFields.value.find((ff) => norm(ff.label) === norm(txt))

    const dobField =
      byExact('Date of Birth') ||
      formFields.value.find((ff) => /(^|\b)(dob|birth|birthdate)(\b|$)/i.test(ff.label))

    const ageField =
      byExact('Age') ||
      formFields.value.find((ff) => norm(ff.label) === 'age')

    dobFieldId.value = dobField?.id ?? null
    ageFieldId.value = ageField?.id ?? null

    // Make Age read-only in UI (recommended so users don't fight the auto value)
    if (ageField) {
      if (!ageField.options || typeof ageField.options !== 'object') {
        ageField.options = { readonly: true }
      } else {
        ageField.options.readonly = true
      }
    }
  } catch (e) {
    console.error(e)
    errorMessage.value = 'Failed to load form data.'
  } finally {
    loading.value = false
  }
}

/* ---------- Step Builder ---------- */
function buildSteps(allFields: Field[]) {
  if (!allFields?.length) {
    stepGroups.value = []
    stepLabels.value = []
    currentStep.value = 1
    return
  }

  const priority: SectionNorm[] = ['senior', 'osca', 'other']
  const sorted = [...allFields].sort((a, b) => {
    const sa = priority.indexOf(a.section_norm ?? 'other')
    const sb = priority.indexOf(b.section_norm ?? 'other')
    if (sa !== sb) return sa - sb
    return (a.order_index ?? 0) - (b.order_index ?? 0)
  })

  // Role UI gating (DB RLS should still enforce server perms)
  let visible = sorted
  if (isSenior.value && !isOsca.value) {
    visible = sorted.filter((f) => f.section_norm === 'senior')
  } else if (isOsca.value) {
    visible = sorted.filter((f) => f.section_norm === 'osca')
  } else {
    visible = sorted.filter((f) => f.section_norm === 'senior')
  }

  // Chunk to avoid scrolling
  const steps: Field[][] = []
  const n = MAX_FIELDS_PER_STEP.value
  for (let i = 0; i < visible.length; i += n) {
    steps.push(visible.slice(i, i + n))
  }
  stepGroups.value = steps

  // Labels by the section of the first field in each chunk
  stepLabels.value = steps.map((grp) => {
    const sect = grp[0]?.section_norm
    if (sect === 'osca') return 'OSCA Section'
    if (sect === 'senior') return 'Senior Section'
    return 'Form Section'
  })

  currentStep.value = Math.min(currentStep.value, steps.length) || 1
}

/* ---------- Nav ---------- */
function nextStep() {
  if (currentStep.value < totalSteps.value) currentStep.value++
}
function prevStep() {
  if (currentStep.value > 1) currentStep.value--
}

/* ---------- Submit / Draft ---------- */
function onSubmit() {
  emit('submit', { formId: formId.value, values: formValues.value, mode: props.mode })
}
function saveAsDraft() {
  emit('save', { formId: formId.value, values: formValues.value, mode: props.mode })
}

/* ---------- Modal (kept for UI parity) ---------- */
const showModal = ref(false)
function confirmModal() {
  showModal.value = false
}

/* ---------- Reactions ---------- */
// rebuild steps whenever inputs change
watch([formFields, isOsca, isSenior, MAX_FIELDS_PER_STEP], () => buildSteps(formFields.value), {
  immediate: true,
})

// emit 'changed' whenever any field value changes
watch(formValues, (v) => emit('changed', { values: v }), { deep: true })

// when DOB changes, recompute Age and set it
watch(
  () => (dobFieldId.value ? formValues.value[dobFieldId.value] : null),
  (dobVal) => {
    if (!ageFieldId.value) return
    const age = computeAge(dobVal)
    if (age != null) {
      formValues.value[ageFieldId.value] = age
    } else {
      delete formValues.value[ageFieldId.value]
    }
  },
  { immediate: true }
)

/* ---------- Mount ---------- */
onMounted(async () => {
  await loadForm()
  buildSteps(formFields.value)
})
</script>

<style scoped>
.form-input {
  @apply w-full rounded-xl border border-gray-300 p-3 text-gray-700 text-base focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all;
}
.btn-primary {
  @apply bg-emerald-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-emerald-700 transition;
}
.btn-secondary {
  @apply border border-gray-300 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 transition;
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
