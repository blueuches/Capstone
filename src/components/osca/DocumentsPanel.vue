<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Documents</h3>
      <span v-if="isPreview" class="badge">preview</span>
    </div>

    <!-- Preview (no request) -->
    <div v-if="isPreview" class="space-y-3">
      <DocRow name="ID Front (JPEG)" />
      <DocRow name="Barangay Certificate (PDF)" />
      <p class="muted mt-1">Actions disabled in preview.</p>
    </div>

    <!-- Live (wire to Supabase later) -->
    <div v-else class="space-y-3">
      <p class="muted">Docs for request <span class="mono">{{ requestId }}</span> will appear here.</p>
    </div>

    <div class="mt-4 flex gap-2">
      <input
        v-model="message"
        :disabled="isPreview"
        placeholder="Ask for additional document (e.g., Birth Cert)"
        class="input"
      />
      <button
        class="btn-primary"
        :class="{ 'opacity-60 cursor-not-allowed': isPreview || !message.trim() }"
        :disabled="isPreview || !message.trim()"
        @click="emitRequestInfo"
      >Request Info</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineComponent } from 'vue'
const props = defineProps<{ requestId?: string | number; mock?: boolean }>()
const emit  = defineEmits<{ (e: 'request-info', message: string): void }>()
const isPreview = computed(() => props.mock === true || props.requestId === undefined)
const message = ref('')

function emitRequestInfo() {
  if (!message.value.trim()) return
  emit('request-info', message.value.trim())
  message.value = ''
}

const DocRow = defineComponent({
  name: 'DocRow',
  props: { name: { type: String, required: true } },
  template: `
    <div class="flex items-center justify-between rounded-xl border bg-white px-3 py-2">
      <div class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-lg bg-emerald-100 grid place-items-center text-emerald-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM7 4v16h10V8h-4V4H7z"/>
          </svg>
        </div>
        <span class="font-medium text-gray-800">{{ name }}</span>
      </div>
      <button class="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700" disabled>Preview</button>
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
.input {
  @apply flex-1 border rounded-lg px-3 py-2 text-sm bg-white;
}
.btn-primary {
  @apply px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm;
}
.muted { @apply text-sm text-gray-600; }
.mono  { @apply font-mono; }
</style>
