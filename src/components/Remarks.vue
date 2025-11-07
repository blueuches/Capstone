<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Send remarks to senior"
      @keydown.esc="$emit('update:modelValue', false)"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60" @click="$emit('update:modelValue', false)"></div>

      <!-- Modal -->
      <div class="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl ring-1 ring-emerald-100 overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b">
          <div class="flex items-center gap-2">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              📨
            </span>
            <h3 class="font-semibold text-emerald-800">Send Remarks</h3>
          </div>
          <button
            class="p-2 rounded-lg hover:bg-gray-100"
            @click="$emit('update:modelValue', false)"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <!-- Body -->
        <div class="px-4 py-4 space-y-3">
          <div class="text-xs text-gray-500">
            Request ID: <span class="font-semibold text-gray-700">#{{ reqIdNum ?? '—' }}</span>
          </div>

          <label class="block text-sm font-medium text-gray-700">Title</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            placeholder="Remarks on your application"
          />

          <label class="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            v-model="form.content"
            rows="6"
            class="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            placeholder="Type your remarks to the senior citizen…"
          ></textarea>

          <!-- Quick templates -->
          <div class="flex flex-wrap gap-2 pt-1">
            <button
              v-for="t in templates"
              :key="t"
              class="text-xs px-2 py-1 rounded-lg border hover:bg-emerald-50"
              @click="appendTemplate(t)"
              type="button"
            >
              + {{ t }}
            </button>
          </div>

          <p v-if="error" class="text-sm text-red-600 mt-2">{{ error }}</p>
          <p v-if="success" class="text-sm text-emerald-700 mt-2">{{ success }}</p>
        </div>

        <!-- Footer -->
        <div class="px-4 py-3 border-t flex items-center justify-end gap-2">
          <button
            class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            @click="$emit('update:modelValue', false)"
            :disabled="loading"
          >Cancel</button>

          <button
            class="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
            @click="sendRemarks"
            :disabled="loading || !form.title || !form.content"
          >
            <span v-if="loading">Sending…</span>
            <span v-else>Send</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { supabase } from '@/supabase/client'

/**
 * v-model compatibility:
 *   <Remarks v-model="remarksOpen" :request-id="..." />
 */
const props = defineProps<{ modelValue: boolean; requestId?: number | string | null }>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'sent', payload: { announcementId: number; notificationId: number }): void
}>()

/** derived values */
const reqIdNum = computed<number | null>(() => {
  const n = Number(props.requestId)
  return Number.isFinite(n) ? n : null
})

/** ui + form state */
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const form = ref<{ title: string; content: string }>({ title: '', content: '' })

/** quick templates */
const templates = [
  'Please upload a clear copy of your Barangay Certificate within 7 days.',
  'Your OSCA ID photo must be 1x1 with white background. Kindly re-upload.',
  'We have received your files. Kindly wait for further instructions.',
  'Your request lacks a valid government ID. Please attach one to proceed.'
]
function appendTemplate(t: string) {
  form.value.content = (form.value.content ? form.value.content + '\n\n' : '') + t
}

/** reset + prefill on open */
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      error.value = null
      success.value = null
      form.value.title = `Remarks for Request #${reqIdNum.value ?? ''}`.trim()
      // do not clear content when re-opening within same context unless desired:
      // form.value.content = ''
    } else {
      // fully clear when closed
      form.value = { title: '', content: '' }
      loading.value = false
      error.value = null
      success.value = null
    }
  }
)

/** call RPC (security definer) */
async function sendRemarks() {
  if (!reqIdNum.value) {
    error.value = 'Missing request ID.'
    return
  }
  if (!form.value.content.trim()) {
    error.value = 'Please enter a message.'
    return
  }

  loading.value = true
  error.value = null
  success.value = null
  try {
    const { data, error: rpcErr } = await supabase.rpc('osca_send_remarks', {
      p_request_id: reqIdNum.value,
      p_title: form.value.title.trim(),
      p_message: form.value.content.trim(),
    })

    if (rpcErr) throw rpcErr

    const annId = Number(data?.[0]?.announcement_id ?? data?.announcement_id ?? 0)
    const notifId = Number(data?.[0]?.notification_id ?? data?.notification_id ?? 0)

    success.value = 'Remarks sent successfully.'
    emit('sent', { announcementId: annId, notificationId: notifId })

    // close after a short delay
    setTimeout(() => emit('update:modelValue', false), 600)
  } catch (e: any) {
    const msg = String(e?.message || e)
    if (msg.toLowerCase().includes('stack depth')) {
      error.value = 'Server policy/trigger loop detected. Please inform the devs.'
    } else {
      error.value = msg || 'Failed to send remarks.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
