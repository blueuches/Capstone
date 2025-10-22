<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Timeline</h3>
      <span v-if="isPreview" class="badge">preview</span>
    </div>

    <ol class="relative border-s border-emerald-200 ps-4 space-y-4">
      <li v-for="(e,i) in items" :key="i" class="leading-tight">
        <div class="dot"></div>
        <p class="text-sm">
          <span class="font-semibold">{{ e.label }}</span>
          <span class="muted"> — {{ e.ts }}</span>
        </p>
        <p v-if="e.note" class="text-xs text-gray-600">{{ e.note }}</p>
      </li>
    </ol>

    <p v-if="!isPreview && items.length === 0" class="muted text-sm mt-2">
      No events yet. Activity will appear here as the request progresses.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Item = { label: string; ts: string; note?: string }
const props = defineProps<{ requestId?: string | number; mock?: boolean; data?: Item[] }>()
const isPreview = computed(() => props.mock === true || props.requestId === undefined)

const items = computed<Item[]>(() => {
  if (isPreview.value) {
    return [
      { label: 'Submitted',      ts: '2025-10-21 09:12', note: 'Senior completed their section.' },
      { label: 'Opened by OSCA', ts: '2025-10-21 10:05' },
      { label: 'In Review',      ts: '2025-10-21 10:06' },
      { label: 'Info Requested', ts: '2025-10-21 10:30', note: 'Please upload barangay clearance.' }
    ]
  }
  // live mode: use provided data prop (wire up later to Supabase)
  return props.data ?? []
})
</script>

<style scoped>
.card        { @apply bg-white border rounded-2xl shadow p-4; }
.card-header { @apply flex items-center justify-between mb-3; }
.card-title  { @apply font-semibold text-emerald-700; }
.badge       { @apply text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-800; }
.muted       { @apply text-gray-600; }

.dot {
  @apply absolute -start-1.5 w-3 h-3 bg-emerald-500 rounded-full border border-white;
}
</style>
