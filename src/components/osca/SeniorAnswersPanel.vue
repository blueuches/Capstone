<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Senior Answers</h3>
      <span v-if="isPreview" class="badge">preview</span>
    </div>

    <!-- Preview values -->
    <div v-if="isPreview" class="space-y-2 text-sm">
      <Row label="Name" value="Juan Dela Cruz" />
      <Row label="Address" value="P-8, Brgy. Ampayon, Butuan City" />
      <Row label="Birthdate" value="1949-05-12" />
      <Row label="Contact" value="+63 912 345 6789" />
      <Row label="Household Member" value="Maria Dela Cruz (Daughter)" />
      <p class="muted mt-1">Showing sample values in preview.</p>
    </div>

    <!-- Live (wire later) -->
    <div v-else class="space-y-2 text-sm">
      <p class="muted">
        Senior’s submitted answers for request <span class="mono">{{ requestId }}</span> will load here.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent } from 'vue'
const props = defineProps<{ requestId?: string | number; mock?: boolean }>()
const isPreview = computed(() => props.mock === true || props.requestId === undefined)

const Row = defineComponent({
  name: 'Row',
  props: { label: { type: String, required: true }, value: { type: String, required: true } },
  template: `
    <div class="flex justify-between gap-4 rounded-xl border bg-white px-3 py-2">
      <span class="text-gray-600">{{ label }}</span>
      <span class="font-medium text-gray-900 text-right">{{ value }}</span>
    </div>
  `
})
</script>

<style scoped>
.card {
  @apply bg-white border rounded-2xl shadow p-4;
}
.card-header {
  @apply flex items-center justify-between mb-3;
}
.card-title {
  @apply font-semibold text-emerald-700;
}
.badge {
  @apply text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-800;
}
.muted { @apply text-sm text-gray-600; }
.mono  { @apply font-mono; }
</style>
