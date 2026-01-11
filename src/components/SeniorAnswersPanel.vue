<template>
  <section class="bg-white rounded-2xl border shadow p-4">
    <header class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-extrabold text-emerald-700">Application Form Answers</h3>
      <span v-if="loading" class="text-xs text-gray-500">Loading…</span>
    </header>

    <div v-if="mock || !reqIdNum" class="text-sm text-gray-500 p-3 rounded-lg bg-emerald-50/40">
      Select an application to see the senior’s submitted answers.
    </div>
    <div v-else-if="error" class="text-sm text-red-600 p-3 rounded-lg bg-red-50/60">
      {{ error }}
    </div>

    <ul v-else-if="rows.length" class="space-y-2">
      <li v-for="r in rows" :key="r.id" class="p-3 rounded-xl border hover:bg-emerald-50/30 transition">
        <div class="text-xs font-semibold text-emerald-700">{{ r.label }}</div>
        <div class="text-sm text-gray-800 whitespace-pre-wrap break-words">{{ r.value_fmt }}</div>
      </li>
    </ul>

    <div v-else class="text-sm text-gray-500 p-3 rounded-lg bg-emerald-50/40">
      No answers from the senior yet.
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '@/supabase/client'

const props = defineProps<{
  requestId?: string | number | undefined
  mock?: boolean
}>()

const mock = computed(() => !!props.mock)
const reqIdNum = computed<number | null>(() => {
  if (props.requestId == null) return null
  const n = Number(props.requestId)
  return Number.isFinite(n) ? n : null
})

type Row = {
  id: number
  field_id: number
  label: string
  type: string | null
  raw: string | null
  value_fmt: string
}

const rows = ref<Row[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

function stripQuotes(s: string) {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1)
  return s
}
function tryFormat(raw: string | null, type?: string | null) {
  if (raw == null || raw === '') return '—'
  const v = String(raw)

  // booleans
  if (v === 'true') return 'Yes'
  if (v === 'false') return 'No'

  // JSON?
  try {
    const parsed = JSON.parse(v)
    if (typeof parsed === 'string') return stripQuotes(parsed)
    if (Array.isArray(parsed)) return parsed.join(', ')
    if (parsed && typeof parsed === 'object') {
      return Object.entries(parsed).map(([k, val]) => `${k}: ${val}`).join('\n')
    }
  } catch { /* ignore */ }

  // date-ish
  if ((type || '').includes('date')) {
    const d = new Date(v)
    if (!isNaN(+d)) return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: '2-digit' })
  }

  // numbers stay as-is
  if (!Number.isNaN(Number(v))) return v

  // plain string
  return stripQuotes(v)
}

async function loadAnswers() {
  rows.value = []
  error.value = null
  if (!reqIdNum.value || mock.value) return
  loading.value = true
  try {
    const { data, error: e } = await supabase
      .from('RequestAnswers')
      .select(`
        id,
        field_id,
        value,
        filled_by,
        FormFields:field_id (
          id,
          label,
          type,
          order_index,
          section
        )
      `)
      .eq('request_id', reqIdNum.value)
      .eq('filled_by', 'senior')
      .order('order_index', { referencedTable: 'FormFields', ascending: true })

    if (e) throw e

    rows.value = (data || []).map((r: any) => ({
      id: r.id,
      field_id: r.field_id,
      label: r?.FormFields?.label || `Field #${r.field_id}`,
      type: r?.FormFields?.type ?? null,
      raw: r?.value ?? null,
      value_fmt: tryFormat(r?.value ?? null, r?.FormFields?.type ?? null)
    }))
  } catch (err: any) {
    error.value = err?.message || 'Failed to load answers.'
  } finally {
    loading.value = false
  }
}

onMounted(loadAnswers)
watch(reqIdNum, loadAnswers)
</script>
