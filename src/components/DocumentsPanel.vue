<template>
  <section class="bg-white rounded-2xl border shadow p-4">
    <header class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-extrabold text-emerald-700">Documents</h3>
      <span v-if="loading" class="text-xs text-gray-500">Loading…</span>
    </header>

    <!-- States -->
    <div v-if="mock || !reqIdNum" class="text-sm text-gray-600 p-3 rounded-xl bg-emerald-50/40">
      Select an application to see submitted files.
    </div>
    <div v-else-if="error" class="text-sm text-red-600 p-3 rounded-xl bg-red-50/60">
      {{ error }}
    </div>
    <div v-else-if="docs.length === 0" class="text-sm text-gray-600 p-3 rounded-xl bg-emerald-50/40">
      No documents uploaded yet.
    </div>

    <!-- Cards: label + date + View -->
    <ul v-else class="grid gap-3 sm:grid-cols-2">
      <li
        v-for="d in docs"
        :key="d.id"
        class="rounded-2xl border ring-1 ring-emerald-100/60 bg-white p-4 hover:shadow-sm transition"
      >
        <h4 class="text-[15px] font-semibold text-emerald-800 leading-snug">
          {{ d.label || 'Untitled document' }}
        </h4>
        <div class="mt-1 text-xs text-gray-500">
          Uploaded {{ fmtDate(d.uploaded_at) }}
        </div>

        <div class="mt-3">
          <a
            v-if="d.signedUrl"
            :href="d.signedUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-emerald-600 text-white hover:bg-emerald-700"
          >
            View
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"/>
              <path d="M5 5h6V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-2v6H5V5z"/>
            </svg>
          </a>
          <span v-else class="inline-block px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed">
            View
          </span>
        </div>
      </li>
    </ul>

    <!-- Optional: ask for more docs -->
    <div class="mt-4 flex gap-2">
      <button
        class="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
        @click="$emit('request-info', requestText)"
      >
        Send Remarks
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '@/supabase/client'

const props = defineProps<{ requestId?: string | number | undefined; mock?: boolean }>()
defineEmits<{ (e:'request-info', text: string): void }>()

const mock = computed(() => !!props.mock)
const reqIdNum = computed<number | null>(() => {
  if (props.requestId == null) return null
  const n = Number(props.requestId)
  return Number.isFinite(n) ? n : null
})

type DocRow = {
  id: number
  request_id: number
  file_path: string
  uploaded_at: string | null
  label: string | null
}
type UiDoc = DocRow & { signedUrl: string | null }

const docs = ref<UiDoc[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const requestText = ref('')

/** Adjust if your default bucket name is different */
const DEFAULT_BUCKET = 'requirements'

/** Utils */
function fmtDate(s?: string | null) {
  if (!s) return '—'
  const d = new Date(s)
  return isNaN(+d) ? '—' : d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: '2-digit' })
}

/** Return {bucket, path} ensuring no leading slash and bucket separated if present in file_path */
function parseBucketPath(raw: string): { bucket: string; path: string } {
  const fp = (raw || '').replace(/^\/+/, '') // strip leading /
  const parts = fp.split('/')
  if (parts.length > 1) {
    const bucket = parts[0]
    const path = parts.slice(1).join('/')
    return { bucket, path }
  }
  // no bucket in path → use default bucket and keep raw as relative object path
  return { bucket: DEFAULT_BUCKET, path: fp }
}

/** Safely build a URL for a stored object */
async function buildUrlFromFilePath(file_path: string): Promise<string | null> {
  if (!file_path) return null

  // 1) Try using the bucket encoded inside the path (or defaulted)
  const bp1 = parseBucketPath(file_path)
  try {
    const { data, error: se } = await supabase.storage
      .from(bp1.bucket)
      .createSignedUrl(bp1.path, 3600)
    if (!se && data?.signedUrl) return data.signedUrl
    if (se) console.warn('[Docs] sign v1 failed:', se.message, { bucket: bp1.bucket, path: bp1.path })
  } catch (e: any) {
    console.warn('[Docs] sign v1 threw:', e?.message)
  }

  // 2) Some apps store only the object path (without bucket). Try default bucket + raw file_path as object key
  try {
    const rawPath = (file_path || '').replace(/^\/+/, '')
    const { data, error: se2 } = await supabase.storage
      .from(DEFAULT_BUCKET)
      .createSignedUrl(rawPath, 3600)
    if (!se2 && data?.signedUrl) return data.signedUrl
    if (se2) console.warn('[Docs] sign v2 failed:', se2.message, { bucket: DEFAULT_BUCKET, path: rawPath })
  } catch (e: any) {
    console.warn('[Docs] sign v2 threw:', e?.message)
  }

  // 3) If your bucket is public, fall back to public URL
  try {
    const bp3 = parseBucketPath(file_path)
    const { data: pub } = supabase.storage.from(bp3.bucket).getPublicUrl(bp3.path)
    if (pub?.publicUrl) return pub.publicUrl
  } catch (e: any) {
    console.warn('[Docs] publicUrl threw:', e?.message)
  }

  // Give up → no URL
  return null
}

async function loadDocs() {
  docs.value = []
  error.value = null
  if (!reqIdNum.value || mock.value) return
  loading.value = true
  try {
    const { data, error: e } = await supabase
      .from('RequestDocuments')
      .select('id, request_id, file_path, uploaded_at, label')
      .eq('request_id', reqIdNum.value)
      .order('uploaded_at', { ascending: false })

    if (e) throw e

    const out: UiDoc[] = []
    for (const r of (data || []) as DocRow[]) {
      const signedUrl = await buildUrlFromFilePath(r.file_path)
      out.push({ ...r, signedUrl })
    }
    docs.value = out
  } catch (err: any) {
    console.error('loadDocs error:', err)
    error.value = err?.message || 'Failed to load documents.'
  } finally {
    loading.value = false
  }
}

onMounted(loadDocs)
watch(reqIdNum, loadDocs)

/** expose for template */
defineExpose({ fmtDate })
</script>

