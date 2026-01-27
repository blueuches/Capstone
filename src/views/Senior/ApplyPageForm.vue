<template>
  <!-- lock overall scroll; use dvh for mobile -->
  <div class="h-[100dvh] overflow-hidden bg-gray-50 font-poppins flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <!-- important: min-h-0 + overflow-hidden so inner section can scroll -->
    <main class="flex-1 min-h-0 px-4 pt-4 flex flex-col overflow-hidden">
      <!-- Top row -->
      <div class="flex items-center justify-between mb-2 shrink-0">
        <RouterLink
          v-if="applicationId"
          :to="{ name: 'ApplyPageSubmit', params: { applicationId } }"
          class="flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <component :is="Left" class="w-5 h-5 text-yellow-500" />
          <span class="text-gray-500">Back</span>
        </RouterLink>

        <button
          v-else
          type="button"
          class="flex items-center gap-2 text-sm font-semibold text-gray-700"
          @click="router.push('/senior/dashboard/apply')"
        >
          <component :is="Left" class="w-5 h-5 text-yellow-500" />
          <span class="text-gray-500">Back</span>
        </button>

        <button
          class="flex items-center gap-2 text-sm font-semibold text-gray-700"
          @click="finishModalOpen = true"
        >
          Finish
          <component :is="Right" class="w-5 h-5 text-yellow-500" />
        </button>
      </div>

      <!-- Title -->
      <div class="mb-2 shrink-0">
        <p class="text-center text-sm font-extrabold text-gray-900">
          {{ formMeta.name }}
        </p>

        <button
          class="mt-2 w-full rounded-xl bg-[#42ad43] text-white text-xs font-extrabold py-2"
          @click="voiceActive ? voice.stopAll() : voice.start()"
        >
{{ voiceActive ? 'Stop voice assist' : 'Tap here to answer using your voice' }}        </button>
      </div>

      <!-- ✅ SCROLL AREA (only this scrolls) -->
      <section ref="formAreaRef" class="flex-1 min-h-0 overflow-y-auto pt-4 pb-6">
        <div class="space-y-4">
          <div v-for="field in currentFields" :key="field.id" class="space-y-1"  :data-field-key="field.field_key">
            <label class="text-xs font-bold text-gray-700">
              {{ field.label }}
              <span v-if="field.required" class="text-red-500">*</span>
            </label>

            <FormField
              :field="field"
              v-model="answers[field.field_key]"
              :error="errors[field.field_key]"
            />
          </div>
        </div>
      </section>

      <!-- Bottom controls (fixed inside page) -->
      <!-- ✅ shrink-0 so it never overlaps the form; add safe-area padding -->
      <div class="shrink-0 pt-2 pb-[calc(env(safe-area-inset-bottom)+84px)]">
        <div class="h-2 rounded-full bg-gray-200 overflow-hidden mb-3">
          <div
            class="h-full bg-[#42ad43] transition-all"
            :style="{ width: stepProgress + '%' }"
          ></div>
        </div>

        <div class="flex items-center justify-between gap-3">
          <button
            class="px-4 py-2 rounded-xl bg-[#42ad43] text-white text-xs font-extrabold"
            @click="draftModalOpen = true"
          >
            Save as Draft
          </button>

          <button
            class="w-12 h-12 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center"
            :class="voiceActive ? 'ring-4 ring-[#42ad43]/30' : ''"
          >
            <component :is="Mic" class="tile-icon w-5 h-5" :class="voiceActive ? 'text-[#42ad43]' : 'text-black'" />
          </button>


          <button
            class="w-10 h-10 rounded-full bg-[#42ad43] text-white flex items-center justify-center"
            @click="prevStep"
            :disabled="currentStep === 0"
            :class="currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''"
          >
            <component :is="Left" class="tile-icon w-5 h-5 text-white" />
          </button>

          <button
            class="w-10 h-10 rounded-full bg-[#42ad43] text-white flex items-center justify-center"
            @click="nextStep"
            :disabled="currentStep === steps.length - 1"
            :class="currentStep === steps.length - 1 ? 'opacity-50 cursor-not-allowed' : ''"
          >
            <component :is="Right" class="tile-icon w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </main>

    <BottomNav />

    <!-- modals unchanged -->
    <ConfirmModal
      :open="finishModalOpen"
      title="Submit this form?"
      message="Are you sure you want to submit this form?"
      confirm-text="Yes, Submit"
      cancel-text="Cancel"
      @confirm="confirmFinish"
      @cancel="finishModalOpen = false"
    />

    <ConfirmModal
      :open="draftModalOpen"
      title="Save as draft?"
      message="You can continue later."
      confirm-text="Yes, Save"
      cancel-text="Cancel"
      @confirm="confirmDraft"
      @cancel="draftModalOpen = false"
    />

    <SpellingModal
      :open="voiceModalOpen"
      :title="voiceModalTitle"
      :message="voiceModalMessage"
      :preview="voiceModalPreview"
      :mode="voiceModalMode"
      @stop="voice.stopAll"
      @yes="voice.confirmYes"
      @no="voice.confirmNo"
      @stopSpelling="voice.stopSpelling()"
      @clear="voiceModalPreview = ''"
    />

    <ConfirmModal
      :open="missedModalOpen"
      title="Incomplete form"
      :message="missedModalMessage"
      confirm-text="Show me"
      cancel-text="Close"
      @cancel="missedModalOpen = false"
      @confirm="handleMissedConfirm"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabase/client'

import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import FormField from '@/components/FormField.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

import Left from '@/assets/icons/senior/left-arrow.svg'
import Right from '@/assets/icons/senior/right-arrow.svg'
import Mic from '@/assets/icons/senior/mic.svg'

import SpellingModal from '@/components/SpellingModal.vue'
import { useFormVoiceAssistant } from '@/composables/useFormVoiceAssistant'
import { useUnifiedSTT } from '@/composables/useUnifiedSTT'


type FormFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'multiselect'

type DependsOn =
  | { field_key: string; op: 'equals' | 'not_equals' | '=' | '!='; value: any }
  | null

type FormFieldRow = {
  id: string
  form_id: string
  section: string
  label: string
  field_key: string
  field_type: FormFieldType
  required: boolean
  sort_order: number
  options?: any
  depends_on?: DependsOn
  placeholder?: string | null
}

const props = defineProps<{ id: string }>() // application_requirement_id
const route = useRoute()
const router = useRouter()

const open = ref(false)

const applicationId = computed(() => {
  const v = route.query.applicationId
  return typeof v === 'string' ? v : ''
})
const applicationRequirementId = computed(() => props.id)

const formMeta = reactive({ id: '', name: '' })
const fields = ref<FormFieldRow[]>([])
const answers = reactive<Record<string, any>>({})
const errors = reactive<Record<string, string | null>>({})

const finishModalOpen = ref(false)
const draftModalOpen = ref(false)

// ✅ keep these so we can upsert answers without creating duplicates
const formSubmissionId = ref<string>('')
const userIdRef = ref<string>('')

// ✅ barangay dropdown choices
const barangayChoices = ref<Array<{ label: string; value: string }>>([])

// =======================
// AUTO STEP SIZE (fit to space)
// =======================
const formAreaRef = ref<HTMLElement | null>(null)
const fieldsPerStep = ref(6)
let resizeObs: ResizeObserver | null = null

function recalcFieldsPerStep() {
  const el = formAreaRef.value
  if (!el) return
  const h = el.clientHeight
  const estimatedPerField = 86
  fieldsPerStep.value = Math.max(1, Math.floor(h / estimatedPerField))
}

// =======================
// DEPENDS + VISIBILITY
// =======================
function passesDepends(dep: DependsOn): boolean {
  if (!dep) return true
  const current = answers[dep.field_key]
  if (dep.op === 'equals' || dep.op === '=') return current === dep.value
  if (dep.op === 'not_equals' || dep.op === '!=') return current !== dep.value
  return true
}

// ✅ custom order: birthdate before age (without touching DB)
function adjustedSortOrder(f: FormFieldRow) {
  if (f.field_key === 'birthdate') return 49
  if (f.field_key === 'age') return 50
  return f.sort_order ?? 0
}

const visibleFields = computed(() =>
  fields.value
    .slice()
    .sort((a, b) => adjustedSortOrder(a) - adjustedSortOrder(b))
    .filter((f) => f.section === 'A_APPLICANT')
    .filter((f) => passesDepends((f.depends_on ?? null) as any))
)

const applicantFieldsAll = computed(() =>
  fields.value
    .slice()
    .sort((a, b) => adjustedSortOrder(a) - adjustedSortOrder(b))
    .filter((f) => f.section === 'A_APPLICANT')
)


const currentStep = ref(0)

const steps = computed(() => {
  const chunks: FormFieldRow[][] = []
  const size = Math.max(1, fieldsPerStep.value)
  for (let i = 0; i < visibleFields.value.length; i += size) {
    chunks.push(visibleFields.value.slice(i, i + size))
  }
  return chunks
})

const currentFields = computed(() => steps.value[currentStep.value] ?? [])

const stepProgress = computed(() => {
  if (!steps.value.length) return 0
  return Math.round(((currentStep.value + 1) / steps.value.length) * 100)
})

function nextStep() {
  if (currentStep.value < steps.value.length - 1) currentStep.value++
}
function prevStep() {
  if (currentStep.value > 0) currentStep.value--
}
watch(
  () => steps.value.length,
  (len) => {
    if (!len) currentStep.value = 0
    else if (currentStep.value > len - 1) currentStep.value = len - 1
  }
)

// =======================
// NAV
// =======================
function goBackToSubmit() {
  if (!applicationId.value) return router.push('/senior/dashboard/apply')
  router.push({ name: 'ApplyPageSubmit', params: { applicationId: applicationId.value } })
}

// =======================
// DEFAULTS + SPECIAL FIELDS
// =======================
function initAnswersDefaults() {
  for (const f of fields.value) {
    if (answers[f.field_key] !== undefined) continue
    if (f.field_type === 'checkbox') answers[f.field_key] = false
    else if (f.field_type === 'multiselect') answers[f.field_key] = []
    else answers[f.field_key] = ''
  }

  // ✅ your requested defaults
  if (!answers.citizenship) answers.citizenship = 'Filipino'
  if (!answers.civil_status) answers.civil_status = 'married'
}

// ✅ age auto compute
function computeAge(birthdateISO: string): number | '' {
  if (!birthdateISO) return ''
  const d = new Date(birthdateISO)
  if (Number.isNaN(d.getTime())) return ''
  const today = new Date()
  let age = today.getFullYear() - d.getFullYear()
  const m = today.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
  return age < 0 ? '' : age
}

watch(
  () => answers.birthdate,
  (val) => {
    const age = computeAge(val)
    answers.age = age === '' ? '' : age
    // clear age errors when it gets auto-filled
    if (errors.age) errors.age = null
  }
)

// =======================
// VALIDATION
// =======================
function isEmptyForType(field: FormFieldRow, value: any) {
  if (field.field_type === 'checkbox') return value !== true
  if (field.field_type === 'multiselect') return !Array.isArray(value) || value.length === 0
  return value === null || value === undefined || String(value).trim() === ''
}

function validateRequiredVisible(): boolean {
  let ok = true
  for (const f of visibleFields.value) {
    if (!f.required) continue
    const v = answers[f.field_key]
    if (isEmptyForType(f, v)) {
      errors[f.field_key] = 'Required'
      ok = false
    } else {
      errors[f.field_key] = null
    }
  }
  return ok
}

// =======================
// SAVE/UPSERT ANSWERS (Option B)
// Save ONLY A_APPLICANT fields (including hidden depends_on fields)
// =======================
async function upsertApplicantAnswersAll() {
  if (!formSubmissionId.value || !userIdRef.value) return
  if (!fields.value.length) return

  const rows = applicantFieldsAll.value.map((f) => ({
    form_submission_id: formSubmissionId.value,
    field_id: f.id,
    value: answers[f.field_key] ?? null, // includes empty
    answered_by: userIdRef.value
  }))

  const { error } = await supabase
    .from('form_answers')
    .upsert(rows as any, { onConflict: 'form_submission_id,field_id' })

  if (error) {
    console.error(error)
    throw error
  }
}

// =======================
// ACTIONS: DRAFT + SUBMIT
// =======================
async function confirmDraft() {
  draftModalOpen.value = false
  try {
    await upsertApplicantAnswersAll()


    // status stays draft
    await supabase
      .from('form_submissions')
      .update({ status: 'draft' })
      .eq('id', formSubmissionId.value)

    goBackToSubmit()
  } catch (e) {
    console.error(e)
  }
}

async function confirmFinish() {
  finishModalOpen.value = false

  const ok = validateRequiredVisible()
  if (!ok) {
    collectMissedRequired()
    missedModalOpen.value = true
    return
  }

  try {
    await upsertApplicantAnswersAll()

    await supabase
      .from('form_submissions')
      .update({ status: 'submitted' })
      .eq('id', formSubmissionId.value)

    // ✅ important: mark requirement submitted too
    await supabase
      .from('application_requirements')
      .update({ status: 'submitted' })
      .eq('id', applicationRequirementId.value)

    goBackToSubmit()
  } catch (e) {
    console.error(e)
  }
}

// =======================
// LOAD: FORM + FIELDS + EXISTING ANSWERS
// =======================
async function loadBarangays() {
  const { data, error } = await supabase.from('barangays').select('id, name').order('name')
  if (error) return console.error(error)
  barangayChoices.value = (data ?? []).map((b: any) => ({ label: b.name, value: b.id }))
}

function applyFieldOverridesForUX() {
  // ✅ convert barangay to dropdown using barangays table
  const barangayField = fields.value.find((f) => f.field_key === 'barangay')
  if (barangayField) {
    barangayField.field_type = 'select'
    barangayField.placeholder = null
    barangayField.options = {
      ...(barangayField.options ?? {}),
      choices: barangayChoices.value,
      default: barangayField.options?.default ?? null
    }
  }

  // ✅ citizenship default Filipino
  const citizen = fields.value.find((f) => f.field_key === 'citizenship')
  if (citizen) {
    citizen.options = { ...(citizen.options ?? {}), default: 'Filipino' }
    citizen.placeholder = 'Filipino'
  }

  // ✅ civil status default married (and no “Select...” feel)
  const civil = fields.value.find((f) => f.field_key === 'civil_status')
  if (civil) {
    civil.options = { ...(civil.options ?? {}), default: 'married' }
    civil.placeholder = null
  }

  // ✅ age disabled (FormField will respect field.options.disabled after patch #2 below)
  const age = fields.value.find((f) => f.field_key === 'age')
  if (age) {
    age.options = { ...(age.options ?? {}), disabled: true }
  }
}

async function loadForm() {
  if (!applicationRequirementId.value) return console.error('Missing applicationRequirementId')
  if (!applicationId.value) return console.error('Missing applicationId in query.')

  const { data: authRes, error: authErr } = await supabase.auth.getUser()
  if (authErr) return console.error(authErr)
  const userId = authRes.user?.id
  if (!userId) return
  userIdRef.value = userId

  // ✅ load barangays early
  await loadBarangays()

  // 1) Get or create form_submissions row (unique by application_requirement_id)
  let { data: submission, error: subErr } = await supabase
    .from('form_submissions')
    .select('id, form_id, status, forms(name)')
    .eq('application_requirement_id', applicationRequirementId.value)
    .maybeSingle()

  if (subErr) return console.error(subErr)

  if (!submission) {
    const { data: ar, error: arErr } = await supabase
      .from('application_requirements')
      .select(
        `
        id,
        application_id,
        issuance_type_requirement:issuance_type_requirement_id (
          id,
          doc_rules
        )
      `
      )
      .eq('id', applicationRequirementId.value)
      .single()

    if (arErr) return console.error(arErr)

    const formId = (ar?.issuance_type_requirement as any)?.doc_rules?.form_id as string | undefined
    if (!formId) return console.error('No form_id found in issuance_type_requirements.doc_rules')

    const { data: created, error: createErr } = await supabase
      .from('form_submissions')
      .insert({
        application_id: applicationId.value,
        application_requirement_id: applicationRequirementId.value,
        form_id: formId,
        created_by: userId,
        status: 'draft'
      })
      .select('id, form_id, status, forms(name)')
      .single()

    if (createErr) return console.error(createErr)
    submission = created
  }

  formSubmissionId.value = (submission as any).id

  // 2) Meta
  formMeta.id = (submission as any).form_id
  formMeta.name = (submission as any)?.forms?.name ?? 'Application Form'

  // 3) Fields
  const { data: ff, error: ffErr } = await supabase
    .from('form_fields')
    .select('id, form_id, section, label, field_key, field_type, required, sort_order, options, depends_on, placeholder')
    .eq('form_id', (submission as any).form_id)
    .order('sort_order', { ascending: true })

  if (ffErr) return console.error(ffErr)
  fields.value = (ff ?? []) as any

  // ✅ apply your special UX rules without changing design
  applyFieldOverridesForUX()

  initAnswersDefaults()

  const { data: ansRows, error: ansErr } = await supabase
    .from('form_answers')
    .select('field_id, value')
    .eq('form_submission_id', (submission as any).id)

  if (ansErr) return console.error(ansErr)

  const fieldIdToKey = new Map(fields.value.map((f) => [f.id, f.field_key]))
  for (const row of ansRows ?? []) {
    const key = fieldIdToKey.get((row as any).field_id)
    if (key) answers[key] = (row as any).value
  }

  // ✅ ensure defaults still apply if DB returned empty
  if (!answers.citizenship) answers.citizenship = 'Filipino'
  if (!answers.civil_status) answers.civil_status = 'married'

  // after mount
  await nextTick()
  recalcFieldsPerStep()
}

const voiceModalOpen = ref(false)
const voiceModalTitle = ref('Voice Assist')
const voiceModalMessage = ref('')
const voiceModalPreview = ref('')
const voiceModalMode = ref<'listening' | 'confirm' | 'spelling' | 'finish'>('listening')

// For STT transcript watching
const stt = useUnifiedSTT()

const voice = useFormVoiceAssistant({
  stt,
  fields: () => visibleFields.value as any,
  answers,

  onOpenModal: () => (voiceModalOpen.value = true),
  onCloseModal: () => (voiceModalOpen.value = false),

  setModalTitle: (t) => (voiceModalTitle.value = t),
  setModalMessage: (t) => (voiceModalMessage.value = t),
  setModalPreview: (t) => (voiceModalPreview.value = t),
  setModalMode: (m) => (voiceModalMode.value = m),

  onSubmit: async () => {
    // reuse your existing submit routine
    // IMPORTANT: this validates + saves + sets statuses
    const ok = validateRequiredVisible()
    if (!ok) return
    await upsertApplicantAnswersAll()
    await supabase.from('form_submissions').update({ status: 'submitted' }).eq('id', formSubmissionId.value)
    await supabase.from('application_requirements').update({ status: 'submitted' }).eq('id', applicationRequirementId.value)
  },

  onGoSubmitList: () => {
    goBackToSubmit()
  },
})

const voiceActive = computed(() => voice.active.value)

import { watchEffect } from 'vue'

watchEffect(() => {
  console.log('[VOICE] mode=', voice.mode.value, 'active=', voice.active.value)
})

const missedModalOpen = ref(false)
const missedRequiredLabels = ref<string[]>([])

const missedModalMessage = computed(() => {
  const n = missedRequiredLabels.value.length
  if (n > 0) return `You missed ${n} required field(s). Please complete them before submitting.`
  return 'You missed some required field(s). Please complete them before submitting.'
})

async function handleMissedConfirm() {
  missedModalOpen.value = false
  await jumpToFirstError()
}

function collectMissedRequired() {
  // assumes: errors[field_key] is set by validateRequiredVisible()
  const missed = visibleFields.value
    .filter((f) => f.required && !!errors[f.field_key])
    .map((f) => f.label || f.field_key)

  missedRequiredLabels.value = missed
}

async function jumpToFirstError() {
  const firstBad = visibleFields.value.find((f) => f.required && errors[f.field_key])
  if (!firstBad) return

  const idx = visibleFields.value.findIndex((f) => f.field_key === firstBad.field_key)
  if (idx < 0) return

  const stepSize = Math.max(1, fieldsPerStep.value)
  const targetStep = Math.floor(idx / stepSize)
  currentStep.value = Math.min(Math.max(targetStep, 0), steps.value.length - 1)

  await nextTick()

  const el = document.querySelector(
    `[data-field-key="${firstBad.field_key}"]`
  ) as HTMLElement | null

  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}


// Watch for final transcript arriving, then feed assistant
watch(
  () => stt.finalTranscript.value,
  async (val) => {
    if (!val || !val.trim()) return
    await voice.onFinalTranscript(val)
  }
)

onMounted(async () => {
  await loadForm()
  await nextTick()
  recalcFieldsPerStep()

  if (formAreaRef.value) {
    resizeObs = new ResizeObserver(() => recalcFieldsPerStep())
    resizeObs.observe(formAreaRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObs && formAreaRef.value) resizeObs.unobserve(formAreaRef.value)
  resizeObs = null
})
</script>

<style scoped>
.tile-icon :deep(path),
.tile-icon :deep(circle),
.tile-icon :deep(rect),
.tile-icon :deep(polygon),
.tile-icon :deep(line),
.tile-icon :deep(polyline) {
  fill: currentColor !important;
  stroke: currentColor !important;
}
</style>
