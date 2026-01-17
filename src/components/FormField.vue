<template>
  <div>
    <!-- TEXT / NUMBER / DATE -->
    <input
      v-if="isInput"
      :type="inputType"
      class="w-full rounded-md border-2 px-3 py-2 text-sm outline-none
             focus:border-[#42ad43]"
      :class="error ? 'border-red-400' : 'border-[#42ad43]'"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput"
      @focus="$emit('focus')"
    />

    <!-- SELECT -->
    <select
      v-else-if="field.field_type === 'select'"
      class="w-full rounded-md border-2 px-3 py-2 text-sm outline-none focus:border-[#42ad43]"
      :class="error ? 'border-red-400' : 'border-[#42ad43]'"
      :value="modelValue"
      @change="onInput"
      @focus="$emit('focus')"
    >
      <option value="" disabled>Select…</option>
      <option v-for="opt in selectOptions" :key="opt" :value="opt">
        {{ opt }}
      </option>
    </select>

    <!-- RADIO -->
    <div v-else-if="field.field_type === 'radio'" class="flex flex-wrap gap-2">
      <button
        v-for="opt in radioOptions"
        :key="opt"
        type="button"
        class="px-3 py-2 rounded-xl text-xs font-bold border-2"
        :class="modelValue === opt ? 'bg-[#42ad43] text-white border-[#42ad43]' : 'bg-white text-gray-700 border-gray-200'"
        @click="update(opt)"
      >
        {{ opt }}
      </button>
    </div>

    <!-- CHECKBOX -->
    <label v-else-if="field.field_type === 'checkbox'" class="inline-flex items-center gap-2">
      <input
        type="checkbox"
        class="w-5 h-5 accent-[#42ad43]"
        :checked="Boolean(modelValue)"
        @change="update(($event.target as HTMLInputElement).checked)"
        @focus="$emit('focus')"
      />
      <span class="text-sm text-gray-700">Yes</span>
    </label>

    <!-- MULTISELECT (simple pill toggles placeholder) -->
    <div v-else-if="field.field_type === 'multiselect'" class="flex flex-wrap gap-2">
      <button
        v-for="opt in multiOptions"
        :key="opt"
        type="button"
        class="px-3 py-2 rounded-xl text-xs font-bold border-2"
        :class="isSelected(opt) ? 'bg-[#42ad43] text-white border-[#42ad43]' : 'bg-white text-gray-700 border-gray-200'"
        @click="toggleMulti(opt)"
      >
        {{ opt }}
      </button>
    </div>

    <!-- Error -->
    <p v-if="error" class="text-xs text-red-600 mt-1 font-semibold">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type FormFieldType = 'text' | 'number' | 'date' | 'checkbox' | 'radio' | 'select' | 'multiselect'

type FormFieldRow = {
  id: string
  label: string
  field_key: string
  field_type: FormFieldType
  required: boolean
  options?: any | null
}

const props = defineProps<{
  field: FormFieldRow
  modelValue: any
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: any): void
  (e: 'focus'): void
}>()

const isInput = computed(() =>
  props.field.field_type === 'text' ||
  props.field.field_type === 'number' ||
  props.field.field_type === 'date'
)

const inputType = computed(() => {
  if (props.field.field_type === 'number') return 'number'
  if (props.field.field_type === 'date') return 'date'
  return 'text'
})

const placeholder = computed(() => {
  // match your prototype “Enter name”
  if (props.field.field_type === 'date') return 'Select date'
  if (props.field.field_type === 'number') return 'Enter number'
  return 'Enter name'
})

function onInput(e: Event) {
  const el = e.target as HTMLInputElement | HTMLSelectElement
  emit('update:modelValue', el.value)
}

function update(v: any) {
  emit('update:modelValue', v)
}

const selectOptions = computed<string[]>(() => props.field.options?.choices ?? [])
const radioOptions = computed<string[]>(() => props.field.options?.choices ?? [])
const multiOptions = computed<string[]>(() => props.field.options?.choices ?? [])

function isSelected(opt: string) {
  return Array.isArray(props.modelValue) && props.modelValue.includes(opt)
}

function toggleMulti(opt: string) {
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const idx = current.indexOf(opt)
  if (idx >= 0) current.splice(idx, 1)
  else current.push(opt)
  emit('update:modelValue', current)
}
</script>
