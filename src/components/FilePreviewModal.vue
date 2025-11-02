<template>
  <transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-[999] flex items-center justify-center p-4"
      @keydown.esc.prevent="$emit('close')"
      tabindex="0"
      ref="root"
      aria-modal="true"
      role="dialog"
      :aria-label="label || 'File preview'"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60" @click="$emit('close')"></div>

      <!-- Modal -->
      <div class="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-2xl ring-1 ring-emerald-100 overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b">
          <div class="flex items-center gap-2">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white font-semibold">👁️</span>
            <div class="min-w-0">
              <p class="font-semibold text-emerald-900 truncate">Preview</p>
              <p v-if="label" class="text-xs text-gray-500 truncate">{{ label }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <a
              v-if="url"
              :href="url"
              target="_blank"
              rel="noopener"
              class="text-sm text-emerald-700 hover:text-emerald-900 underline"
            >
              Open in new tab
            </a>
            <button
              @click="$emit('close')"
              class="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100"
              aria-label="Close preview"
            >✕</button>
          </div>
        </div>

        <!-- Body -->
        <div class="p-3">
          <div v-if="loading" class="flex items-center justify-center h-[70vh] text-gray-600">
            Loading preview…
          </div>

          <div v-else-if="error" class="p-4 text-red-700 bg-red-50 rounded-lg">
            {{ error }}
          </div>

          <!-- Image -->
          <div v-else-if="type === 'image'" class="flex items-center justify-center">
            <img
              :src="url"
              :alt="label || 'Uploaded image'"
              class="max-h-[70vh] w-auto object-contain rounded-lg"
              loading="eager"
            />
          </div>

          <!-- PDF -->
          <div v-else-if="type === 'pdf'" class="h-[70vh]">
            <iframe
              :src="url"
              title="PDF preview"
              class="w-full h-full rounded-lg"
            ></iframe>
          </div>

          <!-- Other file types -->
          <div v-else class="p-4 text-gray-700">
            Preview not available. You can
            <a :href="url" target="_blank" rel="noopener" class="text-emerald-700 underline">open the file</a>
            in a new tab.
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineProps<{
  open: boolean
  url?: string
  label?: string
  type?: 'image' | 'pdf' | 'other'
  loading?: boolean
  error?: string
}>()

defineEmits<{
  (e: 'close'): void
}>()

const root = ref<HTMLElement | null>(null)
onMounted(() => {
  // focus trap entry
  if (root.value) root.value.focus()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
