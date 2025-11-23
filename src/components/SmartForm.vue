<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-100 via-emerald-50 to-white flex justify-center items-start py-6 px-4">
    <div class="w-full max-w-3xl bg-white/95 backdrop-blur rounded-3xl shadow-2xl border border-emerald-100 px-6 pt-16 pb-28 relative">
      <!-- HEADER -->
      <div class="absolute top-4 left-0 right-0 flex items-center justify-between px-6 z-50">
        <router-link
          to="/senior/dashboard"
          class="flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-900 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M15.75 19.5a.75.75 0 0 1-.53-.22L8.47 12.53a.75.75 0 0 1 0-1.06l6.75-6.75a.75.75 0 0 1 1.06 1.06L10.56 12l5.72 5.72a.75.75 0 0 1-.53 1.28z"
            />
          </svg>
          <span class="text-base">Back</span>
        </router-link>

        <button
          v-if="isSenior && !readOnly"
          @click="saveAsDraft"
          class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow"
        >
          Save Draft
        </button>
      </div>

      <!-- TITLE & STEP PROGRESS -->
      <header class="mt-2 mb-6 space-y-3">
        <div class="flex items-center justify-between gap-3">
<div>
  <h1 class="text-xl font-bold text-emerald-900">{{ formTitle }}</h1>

  <!-- Voice subtitle only for seniors -->
  <p v-if="showVoice" class="text-xs text-gray-600">
    Voice-guided form: questions will be read aloud and your answers will be filled automatically.
  </p>

  <!-- Simple description on OSCA side -->
  <p v-else class="text-xs text-gray-600">
    Review and complete the application details below.
  </p>
</div>

<!-- Lang selector + status: seniors only -->
<div v-if="showVoice" class="text-right space-y-1">
  <select
    v-model="voiceLang"
    class="px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
    :disabled="isListening || isSpeaking"
  >
    <option value="ceb-PH">Cebuano</option>
    <option value="fil-PH">Filipino</option>
    <option value="en-US">English (US)</option>
  </select>
  <p :class="statusClass">{{ statusText }}</p>
</div>

        </div>

        <!-- Step progress bar -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px] font-medium text-gray-600">
            <span>Step {{ currentStep }} of {{ totalSteps }}</span>
            <span>{{ stepLabels[currentStep - 1] || '' }}</span>
          </div>
          <div class="h-2 bg-emerald-50 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-300"
              :style="{ width: progressWidth }"
            ></div>
          </div>
        </div>

        <!-- Voice-sequential progress (like Test.vue) -->
        <div   v-if="showVoice && voiceFields.length > 0"
  class="mt-3 bg-emerald-50/70 border border-emerald-100 rounded-xl p-3">
          <div class="flex justify-between text-xs text-gray-700 mb-1">
            <span>Voice Progress</span>
            <span>{{ currentFieldIndex + 1 }} of {{ voiceFields.length }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: voiceProgress + '%' }"
            ></div>
          </div>
          <p class="text-[11px] text-gray-700 mt-1">
            Current field:
            <strong>{{ currentVoiceField ? currentVoiceField.label : '—' }}</strong>
          </p>
        </div>
      </header>

      <!-- ERROR / LOADING -->
      <p v-if="errorMessage" class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
        {{ errorMessage }}
      </p>
      <p v-if="loading && !errorMessage" class="text-center text-gray-500 text-sm">
        Loading form...
      </p>

      <!-- VOICE CONTROLS (like Test.vue) -->
      <section   v-if="showVoice" class="mb-4 bg-emerald-50/70 border border-emerald-100 rounded-xl p-4 space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-emerald-900">Voice Assistant</h2>
          <div class="flex gap-2">
            <button
              v-if="!isFormComplete && logs.length === 0"
              @click="startForm"
              :disabled="loading || !voiceFields.length || isSpeaking || isListening"
              class="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Form
            </button>

            <button
              v-if="isListening"
              @click="stopListening"
              class="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700"
            >
              Stop & Use Answer
            </button>

            <button
              v-if="isFormComplete"
              @click="startForm"
              class="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700"
            >
              Start New Voice Run
            </button>
          </div>
        </div>

        <!-- Interim / final transcripts -->
        <div v-if="isListening || interimTranscript || transcript" class="space-y-2">
          <div class="p-3 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
            <p class="text-[10px] text-emerald-700 font-semibold mb-1">
              LISTENING... (Interim)
            </p>
            <p class="text-xs text-gray-800">
              {{ interimTranscript || 'Speak now...' }}
            </p>
          </div>
          <div v-if="transcript" class="p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-[10px] text-blue-700 font-semibold mb-1">Final Transcript</p>
            <p class="text-xs text-gray-800">{{ transcript }}</p>
          </div>
        </div>

        <p v-if="isFormComplete" class="mt-1 text-[11px] text-green-700">
          Voice run complete. You can still review and edit any field manually before submitting.
        </p>
      </section>

      <!-- FORM FIELDS -->
      <section v-if="!loading" class="flex-1 overflow-y-auto space-y-4 mb-4">
        <div v-if="!stepGroups.length" class="text-sm text-gray-500">
          No fields available for this form.
        </div>

        <div v-else class="space-y-4">
          <div v-for="(group, i) in stepGroups" :key="i" v-show="currentStep === i + 1" class="space-y-3">
            <div
              v-for="field in group"
              :key="field.id"
              :class="fieldContainerClass(field)"
            >
              <label class="block text-[11px] font-semibold text-gray-700 mb-1">
                {{ field.label }}
                <span
                  v-if="currentVoiceField && currentVoiceField.id === field.id && !isFormComplete"
                  class="ml-2 text-emerald-600 text-[10px]"
                >
                  (Voice: current)
                </span>
              </label>

              <DynamicField
                :field="field"
                v-model="formValues[field.id]"
                :readonly="readOnly"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER BUTTONS -->
      <footer
        class="fixed bottom-0 left-0 right-0 px-6 py-3 bg-white/95 border-t border-emerald-100 flex items-center justify-between gap-3"
      >
        <button
          v-if="currentStep > 1"
          @click="prevStep"
          class="btn-secondary text-xs"
        >
          Back
        </button>

        <div class="flex-1"></div>

        <button
          v-if="currentStep < totalSteps"
          @click="nextStep"
          class="btn-primary text-xs"
        >
          Next
        </button>

        <button
          v-if="currentStep === totalSteps"
          @click="onSubmit"
          class="btn-primary text-xs"
        >
          Submit
        </button>
      </footer>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import DynamicField from '@/components/DynamicField.vue'
import { supabase } from '@/supabase/client'
import { useUnifiedTTS } from '@/composables/useUnifiedTTS'
import { useWebSpeechStt } from '@/composables/useWebSpeechStt'
import { useUnifiedSTT } from '@/composables/useUnifiedSTT'

type Mode = 'senior' | 'osca'

const props = defineProps<{
  programId: number
  mode: Mode
  maxPerStep?: number
  readOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', payload: { formId: number | null; values: Record<number, any> }): void
  (e: 'submit', payload: { formId: number | null; values: Record<number, any> }): void
  (e: 'changed', payload: { values: Record<number, any> }): void
}>()

/* ---------- Types & basic state ---------- */
type SectionNorm = 'senior' | 'osca' | 'other'
interface Field {
  id: number
  form_id: number
  label: string
  type: string
  placeholder?: string | null
  required?: boolean | null
  options?: any
  section?: string | null
  section_norm?: SectionNorm
  order_index?: number | null
}

const formId = ref<number | null>(null)
const formTitle = ref('Application Form')
const formFields = ref<Field[]>([])
const formValues = ref<Record<number, any>>({})
const loading = ref(true)
const errorMessage = ref('')

const currentStep = ref(1)
const stepGroups = ref<Field[][]>([])
const stepLabels = ref<string[]>([])
const MAX_FIELDS_PER_STEP = computed(() => props.maxPerStep ?? 4)

const isSenior = computed(() => props.mode === 'senior')
const isOsca = computed(() => props.mode === 'osca')
const showVoice = computed(() => isSenior.value && !props.readOnly)

const totalSteps = computed(() => stepGroups.value.length)
const progressWidth = computed(() =>
  totalSteps.value ? `${(currentStep.value / totalSteps.value) * 100}%` : '0%',
)

/* ---------- Voice assistant (Test.vue-like) ---------- */
const unifiedTts = useUnifiedTTS()
const stt = useWebSpeechStt()

const voiceLang = ref<'ceb-PH' | 'fil-PH' | 'en-US'>('ceb-PH')
const statusText = ref('Ready to start')
const logs = ref<string[]>([])
const isFormComplete = ref(false)

// STT state shown in the UI
const transcript = ref('')
const interimTranscript = ref('')

// flags to control auto-processing
const isSpeaking = ref(false)
const isListening = computed(() => stt.listening?.value ?? false)
const isAwaitingAnswer = ref(false)
const hasProcessedCurrentAnswer = ref(false)

const currentFieldIndex = ref(0)
const voiceFields = computed<Field[]>(() => stepGroups.value.flat())
const currentVoiceField = computed<Field | null>(
  () => voiceFields.value[currentFieldIndex.value] ?? null,
)
const voiceProgress = computed(() =>
  voiceFields.value.length ? ((currentFieldIndex.value + 1) / voiceFields.value.length) * 100 : 0,
)

type VoiceField = {
  id: number
  label: string
  type: string
  options?: any
  // ...whatever you already have
}

const voiceFillTypes = ['text', 'textarea', 'number'] // STT will fill these
const manualFillTypes = ['dropdown', 'radio', 'checkbox', 'file', 'group', 'date']

function isVoiceFillable(field: VoiceField | null | undefined) {
  if (!field) return false
  return voiceFillTypes.includes(field.type)
}

function isManualFill(field: VoiceField | null | undefined) {
  if (!field) return false
  return manualFillTypes.includes(field.type)
}

function buildSpokenPrompt(field: VoiceField): string {
  const base = field.label

  // For select-type fields, read the options
  if (['dropdown', 'radio', 'checkbox'].includes(field.type) && Array.isArray(field.options)) {
    const optionsList = field.options.join(', ')
    return `${base}. Please tap and choose one of the options: ${optionsList}.`
  }

  if (field.type === 'file') {
    return `${base}. Please tap the upload button to add the required picture or signature.`
  }

  if (field.type === 'date') {
    return `${base}. Please tap to pick the date from the calendar.`
  }

  if (field.type === 'group') {
    return `${base}. This question has several boxes. Please tap and fill them on the screen.`
  }

  // default for text-like fields
  return base
}



const statusClass = computed(() => {
  if (isListening.value) return 'text-[11px] mt-1 text-emerald-600 font-semibold'
  if (isSpeaking.value) return 'text-[11px] mt-1 text-blue-600 font-semibold'
  return 'text-[11px] mt-1 text-gray-600'
})

function addLog(message: string) {
  const ts = new Date().toLocaleTimeString()
  logs.value.push(`[${ts}] ${message}`)
}

/* ---------- Helpers ---------- */
function normalizeSection(raw: any): SectionNorm {
  const s = String(raw ?? '').trim().toLowerCase()
  if (!s) return 'other'
  if (s.includes('osca')) return 'osca'
  if (s.includes('senior')) return 'senior'
  return 'other'
}

function isChoiceType(t = '') {
  const k = t.toLowerCase()
  return k === 'dropdown' || k === 'select' || k === 'radio' || k === 'checkbox'
}

function computeAge(dob: Date | string): number | null {
  if (!dob) return null
  const d = typeof dob === 'string' ? new Date(dob) : dob
  if (isNaN(d.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - d.getFullYear()
  const m = today.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
  return age >= 0 ? age : null
}

/* IDs for DOB & Age auto-link */
const dobFieldId = ref<number | null>(null)
const ageFieldId = ref<number | null>(null)

/* ---------- Supabase: load form & fields ---------- */
async function loadForm() {
  loading.value = true
  errorMessage.value = ''

  try {
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

    const { data: fields, error: fieldError } = await supabase
      .from('FormFields')
      .select('*')
      .eq('form_id', form.id)
      .order('order_index', { ascending: true })

    if (fieldError) {
      console.error(fieldError)
      errorMessage.value = 'Error fetching form fields.'
      return
    }

    // Fetch all barangays so we can populate the Barangay dropdown
    const { data: barangays, error: barangayError } = await supabase
      .from('Barangays')
      .select('id, name')
      .order('name', { ascending: true })

    if (barangayError) {
      console.error('Error fetching barangays', barangayError)
    }

    const barangayOptions =
      !barangayError && barangays
        ? barangays.map((b: any) => b.name)
        : []


    const mapped: Field[] = (fields || []).map((f: any) => {
      const t = (f.type || '').toLowerCase()

      // original options logic
      let opts = isChoiceType(t)
        ? (Array.isArray(f.options)
            ? f.options
            : f.options
            ? Object.values(f.options)
            : [])
        : f.options ?? null

      // If this is the Barangay dropdown, override options with the list from the DB
      const labelNorm = String(f.label ?? '').trim().toLowerCase()
      if (t === 'dropdown' && labelNorm === 'barangay' && barangayOptions.length) {
        opts = barangayOptions
      }

      return {
        ...f,
        section_norm: normalizeSection(f.section),
        options: opts,
      } as Field
    })


    formFields.value = mapped

    // init values
    const vals: Record<number, any> = {}
    for (const f of mapped) {
      if (!(f.id in vals)) vals[f.id] = ''
    }
    formValues.value = vals

    // find DOB & Age
    const dobField =
      mapped.find((ff) => String(ff.label ?? '').trim().toLowerCase() === 'date of birth') ||
      mapped.find((ff) => /dob|birth|birthdate/i.test(String(ff.label ?? '')))
    const ageField =
      mapped.find((ff) => String(ff.label ?? '').trim().toLowerCase() === 'age') || null

    dobFieldId.value = dobField?.id ?? null
    ageFieldId.value = ageField?.id ?? null

    if (ageField) {
      if (!ageField.options || typeof ageField.options !== 'object') {
        ageField.options = { readonly: true }
      } else {
        ageField.options.readonly = true
      }
    }
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Failed to load form data.'
  } finally {
    loading.value = false
  }
}

/* ---------- Step builder ---------- */
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

  let visible = sorted
  if (isSenior.value && !isOsca.value) {
    visible = sorted.filter((f) => f.section_norm === 'senior')
  } else if (isOsca.value) {
    visible = sorted.filter((f) => f.section_norm === 'osca')
  } else {
    visible = sorted.filter((f) => f.section_norm === 'senior')
  }

  const steps: Field[][] = []
  const n = MAX_FIELDS_PER_STEP.value
  for (let i = 0; i < visible.length; i += n) {
    steps.push(visible.slice(i, i + n))
  }
  stepGroups.value = steps

  stepLabels.value = steps.map((grp) => {
    const sect = grp[0]?.section_norm
    if (sect === 'osca') return 'OSCA Section'
    if (sect === 'senior') return 'Senior Section'
    return 'Form Section'
  })

  currentStep.value = steps.length ? Math.min(currentStep.value, steps.length) : 1
}

/* ---------- Step navigation ---------- */
function nextStep() {
  if (currentStep.value < totalSteps.value) currentStep.value++
}
function prevStep() {
  if (currentStep.value > 1) currentStep.value--
}

/* ---------- Voice: sync step when currentFieldIndex changes ---------- */
function syncStepWithVoiceIndex() {
  const groups = stepGroups.value
  const idx = currentFieldIndex.value
  let acc = 0

  for (let i = 0; i < groups.length; i++) {
    const size = groups[i].length
    if (idx < acc + size) {
      currentStep.value = i + 1
      return
    }
    acc += size
  }
}

watch(currentFieldIndex, () => {
  syncStepWithVoiceIndex()
  hasProcessedCurrentAnswer.value = false
})

// Keep interim text in sync with the composable (for the green "LISTENING..." box)
watch(
  () => stt.interimTranscript?.value,
  (val) => {
    if (!isAwaitingAnswer.value) return
    interimTranscript.value = val ?? ''
  }
)

// When a final transcript appears, auto-stop and process the answer once
watch(
  () => stt.finalTranscript?.value,
  (val, oldVal) => {
    if (!isAwaitingAnswer.value) return

    const text = (val || '').trim()
    const prev = (oldVal || '').trim()
    if (!text || text === prev) return
    if (hasProcessedCurrentAnswer.value) return

    transcript.value = text
    logs.value.push(`[AUTO] Heard: ${text}`)
    stopListening() // will call processAnswer() but guarded so it runs only once
  }
)

// Basic error logging from STT
watch(
  () => stt.error?.value,
  (err) => {
    if (!err) return
    statusText.value = 'Speech recognition error.'
    logs.value.push(`[ERROR] STT: ${String(err)}`)
    isAwaitingAnswer.value = false
  }
)


/* ---------- Voice: speak wrapper ---------- */
async function speakText(text: string) {
  if (!text) return
  try {
    isSpeaking.value = true
    await Promise.resolve(unifiedTts.stop())
    addLog(`Speaking: ${text}`)
    await Promise.resolve(unifiedTts.speak(text))
    addLog('Speech ended')
  } catch (err) {
    console.error('TTS error', err)
    addLog('Speech error')
  } finally {
    isSpeaking.value = false
  }
}


/* ---------- Voice: start/stop listening & process answer ---------- */
function startListening() {
  if (!stt.supported?.value) {
    statusText.value = 'Speech recognition is not supported on this device.'
    addLog('STT not supported')
    return
  }

  // new voice turn
  transcript.value = ''
  interimTranscript.value = ''
  isAwaitingAnswer.value = true
  hasProcessedCurrentAnswer.value = false

  if ('lang' in stt && stt.lang) {
    stt.lang.value = voiceLang.value
  }
  if ('autoRestart' in stt && stt.autoRestart) {
    stt.autoRestart.value = false
  }

  stt.clear()
  stt.start()
  statusText.value = `Listening for: ${currentVoiceField.value?.label ?? ''}`
  addLog('Microphone started')
}


async function stopListening() {
  // prevent double processing for the same field
  if (hasProcessedCurrentAnswer.value) return
  hasProcessedCurrentAnswer.value = true

  if (stt.listening?.value) {
    stt.stop()
    addLog('Microphone stopped')
  }

  statusText.value = 'Processing answer...'

  // small delay to let Web Speech flush its final result
  await new Promise((resolve) => setTimeout(resolve, 500))

  const finalText = (stt.finalTranscript?.value || '').trim()
  const interimText = (stt.interimTranscript?.value || '').trim()

  interimTranscript.value = interimText
  transcript.value = finalText || interimText

  const answer = finalText || interimText
  isAwaitingAnswer.value = false

  if (!answer) {
    addLog('No answer received')
    statusText.value = 'No answer received. Please try again.'
    return
  }

  await processAnswer(answer)
}


async function processAnswer(answer: string) {
  const field = currentVoiceField.value
  if (!field) return

  const cleaned = answer.trim()
  addLog(`Processing answer for ${field.label}: ${cleaned}`)
  statusText.value = `Processing answer for ${field.label}...`

  if (cleaned) {
    formValues.value[field.id] = cleaned
    emit('changed', { values: formValues.value })
    addLog(`Filled ${field.label} with: ${cleaned}`)

    if (currentFieldIndex.value < voiceFields.value.length - 1) {
      currentFieldIndex.value++
      transcript.value = ''
      interimTranscript.value = ''
      await new Promise((resolve) => setTimeout(resolve, 700))
      await askCurrentQuestion()
    } else {
      isFormComplete.value = true
      statusText.value = 'Form completed (voice run).'
      await speakText('Salamat! Kompleto na ang imong mga tubag.')
      addLog('Form completed')
    }
  } else {
    addLog('Empty answer after cleaning')
    statusText.value = 'No answer received. Please try again.'
  }
}


/* ---------- Voice: start form & ask current question ---------- */
async function startForm() {
  if (!voiceFields.value.length) {
    statusText.value = 'No fields available for voice mode.'
    return
  }

  currentFieldIndex.value = 0
  isFormComplete.value = false
  logs.value = []
  transcript.value = ''
  interimTranscript.value = ''
  isAwaitingAnswer.value = false
  hasProcessedCurrentAnswer.value = false

  statusText.value = 'Starting voice run...'
  addLog('Starting form process')

  await new Promise((resolve) => setTimeout(resolve, 300))
  await askCurrentQuestion()
}


async function askCurrentQuestion() {
  const field = currentVoiceField.value
  if (!field) return

  // reset state for the new field
  transcript.value = ''
  interimTranscript.value = ''
  isAwaitingAnswer.value = false
  hasProcessedCurrentAnswer.value = false

  // highlight field in the UI (whatever you already do there)
  statusText.value = `Question: ${field.label}`
  addLog(`Asking: ${field.label}`)

  // TTS: speak a friendly prompt (with options if any)
  const prompt = buildSpokenPrompt(field)
  await speakText(prompt)

  // Decide if we use STT or manual tap
  if (isVoiceFillable(field)) {
    // normal voice flow (text/textarea/number)
    isAwaitingAnswer.value = true
    startListening()
  } else if (isManualFill(field)) {
    // Manual fields: no mic, just wait for user interaction
    addLog(`Waiting for manual input for ${field.label}`)
    statusText.value = `Please tap on ${field.label} and choose or upload as needed.`

    waitForManualAnswer(field)
  } else {
    // fallback: just move on
    addLog(`Skipping unsupported field type: ${field.type}`)
    if (currentFieldIndex.value < voiceFields.value.length - 1) {
      currentFieldIndex.value++
      await new Promise((resolve) => setTimeout(resolve, 500))
      await askCurrentQuestion()
    }
  }
}


/* ---------- Submit & Draft ---------- */
function onSubmit() {
  emit('submit', { formId: formId.value, values: formValues.value })
}

function saveAsDraft() {
  emit('save', { formId: formId.value, values: formValues.value })
}

/* ---------- Field container class (highlight current voice field) ---------- */
function fieldContainerClass(field: Field) {
  const base = 'rounded-2xl border px-4 py-3 transition-all'
  if (currentVoiceField.value && currentVoiceField.value.id === field.id && !isFormComplete.value) {
    return `${base} border-emerald-500 bg-emerald-50`
  }
  if (formValues.value[field.id]) {
    return `${base} border-green-300 bg-green-50`
  }
  return `${base} border-emerald-50 bg-emerald-50/40`
}

/* ---------- Watches ---------- */
watch(
  [formFields, isSenior, isOsca, MAX_FIELDS_PER_STEP],
  () => buildSteps(formFields.value),
  { immediate: true },
)

watch(
  formValues,
  (v) => {
    emit('changed', { values: v })
  },
  { deep: true },
)

watch(
  () => (dobFieldId.value ? formValues.value[dobFieldId.value] : null),
  (dobVal) => {
    if (!ageFieldId.value) return
    const age = computeAge(dobVal as any)
    if (age != null) {
      formValues.value[ageFieldId.value] = age
    } else {
      delete formValues.value[ageFieldId.value]
    }
  },
  { immediate: true },
)

function waitForManualAnswer(field: VoiceField) {
  const fieldId = field.id

  // If it already has a value (e.g. prefilled), skip waiting
  if (formValues.value[fieldId]) {
    handleManualAnswer(field, formValues.value[fieldId])
    return
  }

  const stopWatch = watch(
    () => formValues.value[fieldId],
    (newVal, oldVal) => {
      // ignore empty or unchanged
      if (newVal == null || newVal === '' || JSON.stringify(newVal) === JSON.stringify(oldVal)) {
        return
      }

      stopWatch()
      handleManualAnswer(field, newVal)
    },
    { deep: true, immediate: false }
  )
}

async function handleManualAnswer(field: VoiceField, value: any) {
  // Simple text for logs – for checkbox/group it might be an array
  let valueForLog = ''
  if (Array.isArray(value)) {
    valueForLog = value.join(', ')
  } else if (typeof value === 'object' && value !== null) {
    valueForLog = JSON.stringify(value)
  } else {
    valueForLog = String(value)
  }

  addLog(`Manual answer for ${field.label}: ${valueForLog}`)
  statusText.value = `Recorded answer for ${field.label}.`

  // Move to next field, same as in processAnswer()
  if (currentFieldIndex.value < voiceFields.value.length - 1) {
    currentFieldIndex.value++
    transcript.value = ''
    interimTranscript.value = ''
    await new Promise((resolve) => setTimeout(resolve, 700))
    await askCurrentQuestion()
  } else {
    isFormComplete.value = true
    statusText.value = 'Form completed.'
    await speakText('Salamat! Kompleto na ang imong mga tubag.')
    addLog('Form completed (with some manual answers).')
  }
}


/* ---------- Mount ---------- */
onMounted(async () => {
  await loadForm()
  buildSteps(formFields.value)
})
</script>

<style scoped>
.btn-primary {
  @apply bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-emerald-700 transition;
}
.btn-secondary {
  @apply border border-gray-300 px-4 py-2 rounded-xl font-semibold hover:bg-gray-100 transition;
}
</style>