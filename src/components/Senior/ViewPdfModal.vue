<template>
  <div v-if="open" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/50" @click="emit('close')" />

    <div class="absolute inset-0 flex items-end sm:items-center justify-center p-2">
      <div class="w-[96vw] h-[92vh] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col" style="padding-bottom: env(safe-area-inset-bottom);">
        <div class="px-5 py-4 border-b flex items-center justify-between gap-3">
          <div class="min-w-0">
            <div class="font-extrabold text-gray-900 truncate">{{ title || 'View PDF' }}</div>
            <div class="text-xs text-gray-500 truncate">
              Use + / – to zoom. Swipe to scroll.
            </div>
          </div>

          <div class="flex items-center gap-2">
            <a
              v-if="url"
              :href="url"
              target="_blank"
              class="px-3 py-2 rounded-xl text-sm font-bold border border-gray-200"
            >
              Open
            </a>

            <button
              class="px-3 py-2 rounded-xl text-sm font-bold bg-gray-100"
              @click="emit('close')"
            >
              Close
            </button>
          </div>
        </div>

        <div class="flex-1 min-h-0">
          <PdfJsViewer :url="url" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PdfJsViewer from '@/components/Senior/PdfJsViewer.vue'

defineProps<{
  open: boolean
  title?: string
  url: string | null
}>()

const emit = defineEmits<{ (e: 'close'): void }>()
</script>
