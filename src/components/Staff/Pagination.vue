<template>
  <nav class="w-full flex items-center justify-center gap-4 select-none">
    <!-- Prev -->
    <button
      type="button"
      class="w-9 h-9 rounded-full bg-[#42ad43] text-white flex items-center justify-center
             disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 active:brightness-95 transition"
      :disabled="currentPage <= 1"
      @click="setPage(currentPage - 1)"
      aria-label="Previous page"
    >
      <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6" />
      </svg>
    </button>

    <!-- Page buttons -->
    <div class="flex items-center gap-2">
      <template v-for="(item, idx) in pageItems" :key="`${item}-${idx}`">
        <span v-if="item === '…'" class="px-1 text-gray-500 font-semibold">…</span>

        <button
          v-else
          type="button"
          class="min-w-8 h-8 px-2 rounded-md font-semibold transition
                 hover:bg-gray-100 active:bg-gray-200"
          :class="Number(item) === currentPage ? 'text-[#42ad43]' : 'text-gray-600'"
          @click="setPage(Number(item))"
          :aria-current="Number(item) === currentPage ? 'page' : undefined"
        >
          {{ item }}
        </button>
      </template>
    </div>

    <!-- Next -->
    <button
      type="button"
      class="w-9 h-9 rounded-full bg-[#42ad43] text-white flex items-center justify-center
             disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 active:brightness-95 transition"
      :disabled="currentPage >= totalPagesComputed"
      @click="setPage(currentPage + 1)"
      aria-label="Next page"
    >
      <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6" />
      </svg>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type PageItem = number | '…'

const props = withDefaults(
  defineProps<{
    modelValue: number

    /** Option A: provide totalItems + pageSize */
    totalItems?: number
    pageSize?: number

    /** Option B: directly provide totalPages (overrides computed from totalItems/pageSize) */
    totalPages?: number

    /** how many numeric buttons to show around current (excluding first/last) */
    maxButtons?: number
  }>(),
  {
    pageSize: 16,
    maxButtons: 5
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
  (e: 'change', v: number): void
}>()

const totalPagesComputed = computed(() => {
  if (props.totalPages && props.totalPages > 0) return props.totalPages
  const items = props.totalItems ?? 0
  const size = Math.max(1, props.pageSize ?? 16)
  return Math.max(1, Math.ceil(items / size))
})

const currentPage = computed(() => {
  const p = Math.floor(props.modelValue || 1)
  return Math.min(Math.max(1, p), totalPagesComputed.value)
})

function setPage(p: number) {
  const next = Math.min(Math.max(1, Math.floor(p)), totalPagesComputed.value)
  if (next === currentPage.value) return
  emit('update:modelValue', next)
  emit('change', next)
}

const pageItems = computed<PageItem[]>(() => {
  const total = totalPagesComputed.value
  const cur = currentPage.value
  const maxMid = Math.max(1, props.maxButtons ?? 5)

  if (total <= 1) return [1]
  if (total <= maxMid + 2) {
    // show all pages if small
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const items: PageItem[] = []
  items.push(1)

  const half = Math.floor(maxMid / 2)
  let start = cur - half
  let end = cur + half

  // clamp mid window
  if (start < 2) {
    start = 2
    end = start + maxMid - 1
  }
  if (end > total - 1) {
    end = total - 1
    start = end - maxMid + 1
  }

  if (start > 2) items.push('…')
  for (let p = start; p <= end; p++) items.push(p)
  if (end < total - 1) items.push('…')

  items.push(total)
  return items
})
</script>
