<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Status</h3>
      <span v-if="isPreview" class="badge">preview</span>
    </div>

    <div class="space-y-3">
      <div class="grid grid-cols-3 gap-2">
        <button
          class="btn-primary"
          :class="{ 'opacity-60 cursor-not-allowed': isPreview }"
          :disabled="isPreview"
          @click="$emit('set-status','verified')"
        >
          Verify
        </button>
        <button
          class="btn-blue"
          :class="{ 'opacity-60 cursor-not-allowed': isPreview }"
          :disabled="isPreview"
          @click="$emit('set-status','approved')"
        >
          Approve
        </button>
        <button
          class="btn-rose"
          :class="{ 'opacity-60 cursor-not-allowed': isPreview }"
          :disabled="isPreview"
          @click="$emit('set-status','rejected')"
        >
          Reject
        </button>
      </div>

      <p class="muted text-xs">
        <template v-if="isPreview">
          Disabled in preview (no request selected).
        </template>
        <template v-else>
          Actions apply to request <span class="mono">{{ requestId }}</span>.
        </template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ requestId?: string | number; mock?: boolean }>()
defineEmits<{ (e:'set-status', status:'verified'|'approved'|'rejected'): void }>()
const isPreview = computed(() => props.mock === true || props.requestId === undefined)
</script>

<style scoped>
.card       { @apply bg-white border rounded-2xl shadow p-4; }
.card-header{ @apply flex items-center justify-between mb-3; }
.card-title { @apply font-semibold text-emerald-700; }
.badge      { @apply text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-800; }
.muted      { @apply text-gray-600; }
.mono       { @apply font-mono; }

.btn-primary{ @apply px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm; }
.btn-blue   { @apply px-3 py-2 rounded-lg bg-blue-600   text-white text-sm; }
.btn-rose   { @apply px-3 py-2 rounded-lg bg-rose-600   text-white text-sm; }
</style>
