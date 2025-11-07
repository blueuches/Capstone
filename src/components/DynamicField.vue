<template>
  <div class="space-y-2">
    <!-- Label -->
    <label
      class="block text-emerald-800 font-semibold text-base tracking-tight"
    >
      {{ field.label }}
      <span v-if="field.required" class="text-red-500">*</span>
    </label>

    <!-- TEXT -->
    <div v-if="normalizedType === 'text'">
      <input
        v-model="model"
        :placeholder="field.placeholder"
        :required="field.required"
        class="fancy-input"
      />
    </div>

    <!-- TEXTAREA -->
    <div v-else-if="normalizedType === 'textarea'">
      <textarea
        v-model="model"
        rows="3"
        :placeholder="field.placeholder"
        :required="field.required"
        class="fancy-input resize-none"
      ></textarea>
    </div>

    <!-- DROPDOWN -->
    <div v-else-if="normalizedType === 'dropdown'" class="relative">
      <select
        v-model="model"
        class="fancy-input appearance-none pr-10"
        :required="field.required"
      >
        <option disabled value="">Select {{ field.label }}</option>
        <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>

    <!-- RADIO -->
    <div v-else-if="normalizedType === 'radio'" class="flex flex-col gap-2">
      <label
        v-for="opt in options"
        :key="opt"
        class="flex items-center gap-3 bg-emerald-50/60 p-2 rounded-lg hover:bg-emerald-100/60 transition cursor-pointer"
      >
        <input
          type="radio"
          :name="field.label"
          class="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
          :value="opt"
          v-model="model"
        />
        <span class="text-gray-800 font-medium text-base">{{ opt }}</span>
      </label>
    </div>

    <!-- CHECKBOX -->
    <div v-else-if="normalizedType === 'checkbox'" class="flex flex-col gap-2">
      <label
        v-for="opt in options"
        :key="opt"
        class="flex items-center gap-3 bg-emerald-50/60 p-2 rounded-lg hover:bg-emerald-100/60 transition cursor-pointer"
      >
        <input
          type="checkbox"
          class="w-5 h-5 accent-emerald-600 focus:ring-emerald-500"
          :value="opt"
          v-model="model"
        />
        <span class="text-gray-800 font-medium text-base">{{ opt }}</span>
      </label>
    </div>

    <!-- DATE -->
    <div v-else-if="normalizedType === 'date'">
      <DatePicker
        v-model="model"
        :enable-time-picker="false"
        auto-apply
        class="w-full"
      />
    </div>

    <!-- FILE -->
    <div v-else-if="normalizedType === 'file'">
      <div
        class="border-2 border-dashed border-emerald-300 bg-emerald-50/40 rounded-2xl p-4 text-center hover:bg-emerald-100/50 cursor-pointer transition"
        @click="triggerFileUpload"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 mx-auto text-emerald-600 mb-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <p class="text-sm text-gray-700">Tap to upload {{ field.label }}</p>
        <p v-if="model" class="text-xs text-gray-500 mt-2">
          Selected: <strong>{{ model }}</strong>
        </p>
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          @change="handleFileUpload"
        />
      </div>
    </div>

    <!-- GROUP -->
    <div v-else-if="normalizedType === 'group'" class="space-y-3">
      <div
        v-for="sub in options"
        :key="sub"
        class="bg-white border border-emerald-200 rounded-xl shadow-sm p-3"
      >
        <input
          v-model="group[sub]"
          :placeholder="sub"
          class="fancy-input"
        />
      </div>
    </div>

    <div v-else-if="normalizedType === 'number'">
      <input
        type="number"
        class="fancy-input"
        v-model.number="model"
        :placeholder="field.placeholder"
        :required="field.required"
        :min="field.options?.min ?? null"
        :max="field.options?.max ?? null"
        :step="field.options?.step ?? '1'"
        :readonly="!!field.options?.readonly"
        :disabled="!!field.options?.disabled"
      />
    </div>

    <!-- FALLBACK -->
    <div v-else class="text-gray-400 text-sm italic">
      Unsupported field type: {{ field.type }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

interface Field {
  id: number
  label: string
  type: string
  placeholder?: string
  required?: boolean
  options?: any
}

const props = defineProps<{ field: Field; modelValue: any }>()
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const normalizedType = computed(() => props.field.type.trim().toLowerCase())

const options = computed(() => {
  const opt = props.field.options
  if (!opt) return []
  if (Array.isArray(opt)) return opt
  if (typeof opt === 'object') return Object.values(opt)
  if (typeof opt === 'string') {
    try {
      return JSON.parse(opt)
    } catch {
      return opt.split(',').map((o) => o.trim())
    }
  }
  return []
})

const group = ref<Record<string, string>>({})
const fileInput = ref<HTMLInputElement | null>(null)

watch(group, (val) => emit('update:modelValue', val), { deep: true })

function triggerFileUpload() {
  fileInput.value?.click()
}

function handleFileUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emit('update:modelValue', file.name)
}
</script>

<style scoped>
.fancy-input {
  @apply w-full bg-white/90 rounded-2xl border border-emerald-200 shadow-sm text-gray-800 text-base px-4 py-3 transition-all;
  @apply focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 hover:shadow-md placeholder-gray-400;
}

textarea.fancy-input {
  @apply min-h-[100px];
}
</style>
