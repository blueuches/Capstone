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
                v-model="formValues[field.label]"
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

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase/client'
import DynamicField from '@/components/DynamicField.vue'

// ROUTER PARAMS
const route = useRoute()
const programId = route.params.programId || route.params.formId // fallback compatibility

// MAIN REACTIVE STATE
const formId = ref(null)
const formFields = ref([])
const loading = ref(true)
const errorMessage = ref('')
const answers = ref({})
const formValues = ref({})


// FORM DISPLAY STATE
const formTitle = ref('Application Form')
const currentStep = ref(1)
const totalSteps = ref(1)
const stepLabels = ref([])
const stepGroups = ref([])

// PROGRESS BAR WIDTH
const progressWidth = computed(() => {
  if (!totalSteps.value) return '0%'
  return `${(currentStep.value / totalSteps.value) * 100}%`
})

// FETCH FORM FIELDS FROM SUPABASE
const loadFormFields = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    // 1️⃣ Get the form linked to this program
    const { data: form, error: formError } = await supabase
      .from('Forms')
      .select('id, name, description')
      .eq('program_id', programId)
      .single()

    if (formError || !form) {
      errorMessage.value = 'No form found for this program.'
      console.error(formError)
      return
    }

    formId.value = form.id
    formTitle.value = form.name || 'Application Form'

    // 2️⃣ Fetch fields for this form_id
    const { data: fields, error: fieldError } = await supabase
      .from('FormFields')
      .select('*')
      .eq('form_id', form.id)
      .order('order_index', { ascending: true })

    if (fieldError) {
      errorMessage.value = 'Error fetching form fields.'
      console.error(fieldError)
      return
    }

    // Normalize options JSON → array
    formFields.value = fields.map(f => ({
      ...f,
      options: Array.isArray(f.options)
        ? f.options
        : f.options
        ? Object.values(f.options)
        : []
    }))
  } catch (err) {
    console.error('Unexpected error:', err)
    errorMessage.value = 'Failed to load form data.'
  } finally {
    loading.value = false
  }
}

// 👀 WATCH FOR FIELDS TO POPULATE STEP DATA
watch(formFields, fields => {
  if (!fields || !fields.length) return

  // Group by `section` (or fallback to chunks)
  const grouped = fields.reduce((acc, field) => {
    const section = field.section || 'General'
    if (!acc[section]) acc[section] = []
    acc[section].push(field)
    return acc
  }, {})

  stepGroups.value = Object.values(grouped)
  stepLabels.value = Object.keys(grouped)
  totalSteps.value = stepGroups.value.length
})

// 🧭 NAVIGATION LOGIC
const nextStep = () => {
  if (currentStep.value < totalSteps.value) currentStep.value++
}
const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

// 🧾 SUBMIT HANDLER
const onSubmit = () => {
  console.log('Form submission:', answers.value)
  // TODO: integrate Supabase insert to FormSubmissions & RequestAnswers
}

// 💾 SAVE AS DRAFT (placeholder)
const saveAsDraft = () => {
  console.log('Saved as draft:', answers.value)
}

// MODAL STATE
const showModal = ref(false)
const confirmModal = () => (showModal.value = false)

onMounted(loadFormFields)
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
