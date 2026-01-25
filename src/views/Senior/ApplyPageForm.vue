<template>
  <!-- lock overall scroll -->
  <div class="h-screen overflow-hidden bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <main class="flex-1 px-4 pt-4 flex flex-col">
      <!-- Top row -->
      <div class="flex items-center justify-between mb-2">
        <RouterLink
          v-if="applicationId"
          :to="{ name: 'ApplyPageSubmit', params: { applicationId } }"
          class="flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <component :is="Left" class="w-5 h-5 text-yellow-500" />
          <span class="text-gray-500">Back</span>
        </RouterLink>

        <!-- fallback (prevents blank page) -->
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
      <div class="mb-2">
        <p class="text-center text-sm font-extrabold text-gray-900">
          {{ formMeta.name }}
        </p>

        <!-- Voice CTA (UI ONLY) -->
        <button
          class="mt-2 w-full rounded-xl bg-[#42ad43] text-white text-xs font-extrabold py-2"
        >
          Tap here to answer using your voice
        </button>
      </div>

      <!-- FORM (NO SCROLL, STEP-BASED) -->
      <section ref="formAreaRef" class="flex-1 pt-4">
        <div class="space-y-4">
          <div
            v-for="field in currentFields"
            :key="field.id"
            class="space-y-1"
          >
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

      <!-- Bottom controls -->
      <div class="pt-2 mb-9">
        <!-- Progress = STEPS -->
        <div class="h-2 rounded-full bg-gray-200 overflow-hidden mb-3">
          <div
            class="h-full bg-[#42ad43] transition-all"
            :style="{ width: stepProgress + '%' }"
          ></div>
        </div>

        <div class="flex items-center justify-between gap-3">
          <!-- Save Draft -->
          <button
            class="px-4 py-2 rounded-xl bg-[#42ad43] text-white text-xs font-extrabold"
            @click="draftModalOpen = true"
          >
            Save as Draft
          </button>

          <!-- Mic (UI only) -->
          <button
            class="w-12 h-12 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center"
          >
            <component :is="Mic" class="tile-icon w-5 h-5 text-black" />
          </button>

          <!-- Step navigation -->
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

    <!-- Finish modal -->
    <ConfirmModal
      :open="finishModalOpen"
      title="Submit this form?"
      message="Are you sure you want to submit this form?"
      confirm-text="Yes, Submit"
      cancel-text="Cancel"
      @confirm="confirmFinish"
      @cancel="finishModalOpen = false"
    />

    <!-- Draft modal -->
    <ConfirmModal
      :open="draftModalOpen"
      title="Save as draft?"
      message="You can continue later."
      confirm-text="Yes, Save"
      cancel-text="Cancel"
      @confirm="confirmDraft"
      @cancel="draftModalOpen = false"
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

type FormFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'multiselect'

// supports BOTH formats:
// - { field_key, op: 'equals'|'not_equals', value }
// - { field_key, op: '=', value }   (your DB)
// - { field_key, op: '!=', value }
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

const formMeta = reactive({
  id: '',
  name: ''
})

const fields = ref<FormFieldRow[]>([])
const answers = reactive<Record<string, any>>({})
const errors = reactive<Record<string, string | null>>({})

const finishModalOpen = ref(false)
const draftModalOpen = ref(false)

/* =======================
   AUTO STEP SIZE (fit to space)
======================= */

const formAreaRef = ref<HTMLElement | null>(null)
const fieldsPerStep = ref(6) // default fallback
let resizeObs: ResizeObserver | null = null

function recalcFieldsPerStep() {
  const el = formAreaRef.value
  if (!el) return

  // available space for fields
  const h = el.clientHeight

  // estimate each field block height:
  // label (~16) + input (~44) + gap (~16) ≈ 76–90
  const estimatedPerField = 86

  const n = Math.max(1, Math.floor(h / estimatedPerField))
  fieldsPerStep.value = n
}

/* =======================
   MULTI-STEP LOGIC
======================= */

const currentStep = ref(0)

function passesDepends(dep: DependsOn): boolean {
  if (!dep) return true
  const current = answers[dep.field_key]

  if (dep.op === 'equals' || dep.op === '=') return current === dep.value
  if (dep.op === 'not_equals' || dep.op === '!=') return current !== dep.value
  return true
}

const visibleFields = computed(() =>
  fields.value
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    // ✅ ONLY show applicant section
    .filter((f) => f.section === 'A_APPLICANT')
    // ✅ respect depends_on
    .filter((f) => passesDepends((f.depends_on ?? null) as any))
)

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

// if changing conditions reduces steps, clamp currentStep
watch(
  () => steps.value.length,
  (len) => {
    if (!len) currentStep.value = 0
    else if (currentStep.value > len - 1) currentStep.value = len - 1
  }
)

/* =======================
   ACTIONS
======================= */

function goBackToSubmit() {
  if (!applicationId.value) return router.push('/senior/dashboard/apply')
  router.push({ name: 'ApplyPageSubmit', params: { applicationId: applicationId.value } })
}

function confirmFinish() {
  finishModalOpen.value = false
  goBackToSubmit()
}

function confirmDraft() {
  draftModalOpen.value = false
  goBackToSubmit()
}

function initAnswersDefaults() {
  for (const f of fields.value) {
    if (answers[f.field_key] !== undefined) continue
    if (f.field_type === 'checkbox') answers[f.field_key] = false
    else if (f.field_type === 'multiselect') answers[f.field_key] = []
    else answers[f.field_key] = ''
  }
}

/* =======================
   LOAD REAL DB FIELDS
======================= */

async function loadForm() {
  if (!applicationRequirementId.value) {
    console.error('Missing applicationRequirementId')
    return
  }
  if (!applicationId.value) {
    console.error('Missing applicationId in query. Pass it when navigating to ApplyForm.')
    return
  }

  const { data: authRes, error: authErr } = await supabase.auth.getUser()
  if (authErr) return console.error(authErr)
  const userId = authRes.user?.id
  if (!userId) return

  // 1) Get or create form_submissions row
  let { data: submission, error: subErr } = await supabase
    .from('form_submissions')
    .select('id, form_id, status, forms(name)')
    .eq('application_requirement_id', applicationRequirementId.value)
    .maybeSingle()

  if (subErr) return console.error(subErr)

  if (!submission) {
    const { data: ar, error: arErr } = await supabase
      .from('application_requirements')
      .select(`
        id,
        application_id,
        issuance_type_requirement:issuance_type_requirement_id (
          id,
          doc_rules
        )
      `)
      .eq('id', applicationRequirementId.value)
      .single()

    if (arErr) return console.error(arErr)

    const formId = (ar?.issuance_type_requirement as any)?.doc_rules?.form_id as string | undefined
    if (!formId) {
      console.error('No form_id found in issuance_type_requirements.doc_rules for this requirement.')
      return
    }

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

  // 2) Set meta
  formMeta.id = submission.form_id
  formMeta.name = (submission as any)?.forms?.name ?? 'Application Form'

  // 3) Load fields
  const { data: ff, error: ffErr } = await supabase
    .from('form_fields')
    .select('id, form_id, section, label, field_key, field_type, required, sort_order, options, depends_on, placeholder')
    .eq('form_id', submission.form_id)
    .order('sort_order', { ascending: true })

  if (ffErr) return console.error(ffErr)
  fields.value = (ff ?? []) as any

  initAnswersDefaults()

  // 4) Load existing answers
  const { data: ansRows, error: ansErr } = await supabase
    .from('form_answers')
    .select('field_id, value')
    .eq('form_submission_id', submission.id)

  if (ansErr) return console.error(ansErr)

  const fieldIdToKey = new Map(fields.value.map((f) => [f.id, f.field_key]))
  for (const row of ansRows ?? []) {
    const key = fieldIdToKey.get((row as any).field_id)
    if (key) answers[key] = (row as any).value
  }

  // after fields mount, auto compute how many fit
  await nextTick()
  recalcFieldsPerStep()
}

onMounted(async () => {
  await loadForm()
  await nextTick()
  recalcFieldsPerStep()

  // live resize (orientation, device sizes)
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
