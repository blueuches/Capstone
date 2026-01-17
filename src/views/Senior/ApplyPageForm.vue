<template>
  <!-- lock overall scroll -->
  <div class="h-screen overflow-hidden bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <main class="flex-1 px-4 pt-4 flex flex-col">
      <!-- Top row -->
      <div class="flex items-center justify-between mb-2">
        <RouterLink
          to="/senior/dashboard/apply/submitlist"
          class="flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <component :is="Left" class="w-5 h-5 text-yellow-500" />
          <span class="text-gray-500">Back</span>
        </RouterLink>

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
      <section class="flex-1 pt-4">
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
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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

type DependsOn =
  | { field_key: string; op: 'equals' | 'not_equals'; value: any }
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
}

const open = ref(false)
const router = useRouter()

const formMeta = reactive({
  id: 'form-001',
  name: 'OSCA ID Application Form'
})

const fields = ref<FormFieldRow[]>([])
const answers = reactive<Record<string, any>>({})
const errors = reactive<Record<string, string | null>>({})

const finishModalOpen = ref(false)
const draftModalOpen = ref(false)

/* =======================
   MULTI-STEP LOGIC
======================= */

const currentStep = ref(0)
const FIELDS_PER_STEP = 3

function passesDepends(dep: DependsOn): boolean {
  if (!dep) return true
  return answers[dep.field_key] === dep.value
}

const visibleFields = computed(() =>
  fields.value
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .filter((f) => passesDepends(f.depends_on ?? null))
)

const steps = computed(() => {
  const chunks: FormFieldRow[][] = []
  for (let i = 0; i < visibleFields.value.length; i += FIELDS_PER_STEP) {
    chunks.push(visibleFields.value.slice(i, i + FIELDS_PER_STEP))
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

/* =======================
   ACTIONS
======================= */

function confirmFinish() {
  finishModalOpen.value = false
  router.push('/senior/dashboard/apply/submitlist')
}

function confirmDraft() {
  draftModalOpen.value = false
  router.push('/senior/dashboard/apply/submitlist')
}

function initAnswers() {
  for (const f of fields.value) {
    if (answers[f.field_key] !== undefined) continue
    if (f.field_type === 'checkbox') answers[f.field_key] = false
    else if (f.field_type === 'multiselect') answers[f.field_key] = []
    else answers[f.field_key] = ''
  }
}

/* =======================
   MOCK DATA
======================= */

onMounted(() => {
  fields.value = [
    { id: 'f1', form_id: 'form-001', section: 'p', label: 'First Name', field_key: 'first_name', field_type: 'text', required: true, sort_order: 1 },
    { id: 'f2', form_id: 'form-001', section: 'p', label: 'Middle Name', field_key: 'middle_name', field_type: 'text', required: false, sort_order: 2 },
    { id: 'f3', form_id: 'form-001', section: 'p', label: 'Last Name', field_key: 'last_name', field_type: 'text', required: true, sort_order: 3 },
    { id: 'f4', form_id: 'form-001', section: 'a', label: 'Barangay', field_key: 'barangay', field_type: 'text', required: true, sort_order: 4 },
    { id: 'f5', form_id: 'form-001', section: 'a', label: 'Birthdate', field_key: 'birthdate', field_type: 'date', required: true, sort_order: 5 },
    { id: 'f6', form_id: 'form-001', section: 'o', label: 'Has PhilHealth?', field_key: 'has_philhealth', field_type: 'radio', required: true, sort_order: 6, options: { choices: ['Yes', 'No'] } },
    { id: 'f7', form_id: 'form-001', section: 'o', label: 'PhilHealth No.', field_key: 'philhealth_no', field_type: 'text', required: true, sort_order: 7, depends_on: { field_key: 'has_philhealth', op: 'equals', value: 'Yes' } }
  ]

  initAnswers()
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
