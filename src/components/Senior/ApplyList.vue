<template>
  <div>
    <!-- Empty state -->
    <div
      v-if="!items.length"
      class="mt-10 bg-white border border-gray-200 rounded-3xl p-6 text-center"
    >
      <div class="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
        <span class="text-2xl">📄</span>
      </div>
      <h2 class="text-lg font-bold text-gray-900">No Items To Show</h2>
      <p class="text-sm text-gray-500 mt-1">
        This application has no submission requirements loaded yet.
      </p>
    </div>

    <!-- List -->
    <div v-else class="space-y-3">
      <div
        v-for="(item, idx) in items"
        :key="item.id"
        class="flex items-stretch gap-3"
      >
        <!-- ✅ Left number column -->
        <div class="w-10 flex items-center justify-center">
          <span class="text-2xl font-extrabold text-[#42ad43] leading-none">
            {{ idx + 1 }}
          </span>
        </div>

        <!-- ✅ Green pill card (prototype shape) -->
        <div
          class="flex-1 rounded-3xl bg-[#42ad43] text-white px-5 py-3 shadow-sm"
        >
          <div class="flex items-center justify-between gap-4">
            <!-- LEFT CONTENT (wraps, never pushes button) -->
            <div class="min-w-0 flex-1">
              <p
                class="text-sm font-extrabold leading-snug break-words"
                style="word-break: break-word;"
              >
                {{ item.title }}
              </p>

              <p v-if="item.subtitle" class="text-[11px] text-white/85 mt-0.5 break-words">
                {{ item.subtitle }}
              </p>
            </div>

            <!-- RIGHT BUTTON (fixed, uniform) -->
            <div class="w-[78px] shrink-0 flex justify-end">
              <button
                class="px-3 py-2 rounded-full bg-white text-[#42ad43] text-xs font-extrabold shadow-sm
                       active:scale-[0.99] transition-transform"
                @click="emit('action', item)"
              >
                {{ actionLabel(item) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Optional: progress hint -->
    <div v-if="items.length" class="mt-4">
      <div class="text-xs text-gray-500">
        Completed: <span class="font-semibold">{{ completedCount }}/{{ items.length }}</span> [Go to My Requirements to view]
      </div>
      <div class="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div class="h-full bg-[#42ad43]" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type RequirementItem = {
  id: string
  title: string
  subtitle?: string
  kind: 'form' | 'file'
  hasRecord: boolean
}

const props = defineProps<{
  items: RequirementItem[]
}>()

const emit = defineEmits<{
  (e: 'action', item: RequirementItem): void
}>()

function actionLabel(item: RequirementItem) {
  return item.kind === 'form' ? 'Answer' : 'Submit'
}

const completedCount = computed(() => props.items.filter(i => i.hasRecord).length)

const progress = computed(() => {
  const total = Math.max(1, props.items.length)
  return Math.round((completedCount.value / total) * 100)
})
</script>
