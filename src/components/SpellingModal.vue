<!-- src/components/SpellingModal.vue -->
<template>
  <div v-if="open" class="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
    <!-- backdrop -->
    <div class="absolute inset-0 bg-black/40" @click="onStop"></div>

    <!-- card -->
    <div
      class="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-xl p-5 mx-0 sm:mx-4"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-sm font-extrabold text-gray-900 truncate">{{ title }}</p>
          <p class="text-xs font-semibold text-gray-600 mt-1">{{ message }}</p>
        </div>

        <button
          type="button"
          class="shrink-0 px-3 py-1 rounded-full bg-gray-100 text-xs font-extrabold text-gray-700"
          @click="onStop"
        >
          Stop
        </button>
      </div>

      <!-- Listening indicator -->
      <div v-if="mode === 'listening'" class="mt-5 flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-[#42ad43] flex items-center justify-center animate-pulse">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"
              stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            />
            <path d="M19 11a7 7 0 0 1-14 0" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 18v3" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>

        <div class="min-w-0">
          <p class="text-xs font-extrabold text-gray-900">Listening…</p>
          <p class="text-[11px] text-gray-600">
            Speak now. If nothing happens, tap Stop then start again.
          </p>
        </div>
      </div>

      <!-- Preview box -->
      <div v-if="preview" class="mt-4 p-3 rounded-2xl bg-gray-50 border border-gray-100">
        <p class="text-xs font-extrabold text-gray-700">Preview</p>
        <p class="text-sm font-semibold text-gray-900 mt-1 break-words">{{ preview }}</p>
      </div>

      <!-- Confirm controls -->
      <div v-if="mode === 'confirm'" class="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          class="py-3 rounded-2xl bg-[#42ad43] text-white text-xs font-extrabold"
          @click="$emit('yes')"
        >
          Yes (Oo)
        </button>
        <button
          type="button"
          class="py-3 rounded-2xl bg-gray-100 text-gray-800 text-xs font-extrabold"
          @click="$emit('no')"
        >
          No (Dili)
        </button>
      </div>

      <!-- Spelling controls -->
      <div v-if="mode === 'spelling'" class="mt-5 flex gap-3">
        <button
          type="button"
          class="flex-1 py-3 rounded-2xl bg-[#42ad43] text-white text-xs font-extrabold"
          @click="$emit('stopSpelling')"
        >
          Stop spelling
        </button>
        <button
          type="button"
          class="px-4 py-3 rounded-2xl bg-gray-100 text-gray-800 text-xs font-extrabold"
          @click="$emit('clear')"
        >
          Clear
        </button>
      </div>

      <!-- Finish prompt -->
      <div v-if="mode === 'finish'" class="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          class="py-3 rounded-2xl bg-[#42ad43] text-white text-xs font-extrabold"
          @click="$emit('finishYes')"
        >
          Yes, Finish
        </button>
        <button
          type="button"
          class="py-3 rounded-2xl bg-gray-100 text-gray-800 text-xs font-extrabold"
          @click="$emit('finishNo')"
        >
          Review First
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  message: string
  preview: string
  mode: 'listening' | 'confirm' | 'spelling' | 'finish'
}>()

const emit = defineEmits<{
  (e: 'stop'): void
  (e: 'yes'): void
  (e: 'no'): void
  (e: 'stopSpelling'): void
  (e: 'clear'): void
  (e: 'finishYes'): void
  (e: 'finishNo'): void
}>()

function onStop() {
  emit('stop')
}
</script>
