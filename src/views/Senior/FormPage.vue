<!-- src/views/Senior/FormPage.vue -->
<template>

    <SmartForm
      v-if="ready"
      :programId="Number(programId)"
      mode="senior"
      :maxPerStep="4"
      @save="saveDraft"
      @submit="submitForm"
      @changed="autoSave"
    />
    <p v-else class="text-gray-500">Loading form…</p>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SmartForm from '@/components/SmartForm.vue'
import { supabase } from '@/supabase/client'

const route = useRoute()
const router = useRouter()

const programId = computed<number | null>(() => {
  const n = Number(route.params.programId)
  return Number.isFinite(n) ? n : null
})
const ready = computed(() => programId.value != null)

// Keep a cached request_id for this program so we don’t call ensure_draft repeatedly
const requestId = ref<number | null>(null)
const draftKey = computed(() => requestId.value ? `draft:${requestId.value}` : null)

/** 1) Ensure/return draft request_id */
async function ensureDraft(programId: number) {
  if (requestId.value) return requestId.value
  const { data, error } = await supabase.rpc('ensure_draft_request', { p_program_id: programId })
  if (error) throw error
  requestId.value = data as number
  return requestId.value!
}

/** 2) Load FormFields -> map { id -> { label, section } } */
async function loadFieldMeta(formId: number) {
  const { data, error } = await supabase
    .from('FormFields')
    .select('id,label,section')
    .eq('form_id', formId)
    .order('order_index', { ascending: true })

  if (error) throw error
  const map = new Map<number, { label: string; section: string }>()
  for (const f of data || []) map.set(Number(f.id), { label: f.label, section: (f.section || 'senior') })
  return map
}

/** 3) Helpers: pick only SENIOR fields and convert ids->labels for RPC */
function toAnswersByLabel(values: Record<number, any>, fieldMeta: Map<number, {label:string; section:string}>) {
  const out: Record<string, any> = {}
  for (const [fieldIdStr, val] of Object.entries(values)) {
    const fieldId = Number(fieldIdStr)
    const meta = fieldMeta.get(fieldId)
    if (!meta) continue
    if (meta.section?.toLowerCase() !== 'senior') continue   // <- gate by section
    if (val === undefined || val === null || val === '') continue
    out[meta.label] = val
  }
  return out
}

/** 4) Save as Draft: keep it local (safe), but create the request in DB so uploads/status history work */
async function saveDraft({ formId, values }: { formId: number|null; values: Record<number, any> }) {
  if (!programId.value) return
  const reqId = await ensureDraft(programId.value)

  // Local cache only (so we don’t create duplicate RequestAnswers rows)
  const payload = { formId, values, savedAt: new Date().toISOString() }
  localStorage.setItem(`draft:${reqId}`, JSON.stringify(payload))

  // Optional: toast
  console.log('Draft saved locally for request', reqId)
}

/** 5) AutoSave: same as saveDraft (lightweight) */
function autoSave({ values }: { values: Record<number, any> }) {
  if (!draftKey.value) return
  const existing = localStorage.getItem(draftKey.value)
  const prev = existing ? JSON.parse(existing) : {}
  localStorage.setItem(draftKey.value, JSON.stringify({ ...prev, values, savedAt: new Date().toISOString() }))
}

/** 6) Submit: send only SENIOR fields as { label: value } to RPC; this sets status=submitted */
async function submitForm({ formId, values }: { formId: number|null; values: Record<number, any> }) {
  if (!programId.value || !formId) return

  const reqId = await ensureDraft(programId.value)
  const fieldMeta = await loadFieldMeta(formId)
  const answers = toAnswersByLabel(values, fieldMeta) // { "Last name": "Dela Cruz", ... }

  // IMPORTANT: this RPC deletes prior answers for the request, inserts THESE (as senior), then sets status=submitted
  const { error } = await supabase.rpc('submit_request_answers', {
    p_request_id: reqId,
    p_answers: answers
  })
  if (error) {
    console.error(error)
    alert(error.message)
    return
  }

  // Clear draft cache; route to a confirmation or dashboard
  localStorage.removeItem(`draft:${reqId}`)
  router.push('/senior/dashboard')
}
</script>
