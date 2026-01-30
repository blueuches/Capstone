<template>
  <!-- Backdrop (click to close) -->
  <div v-if="open" class="fixed inset-0 z-[80]">
    <div
      class="absolute inset-0 bg-black/40"
      @click="emit('close')"
      aria-hidden="true"
    />

    <!-- Modal -->
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div
        class="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="px-4 sm:px-6 py-4 flex items-center justify-between border-b">
          <div class="min-w-0">
            <p class="text-sm font-extrabold text-gray-900 truncate">
              {{ title || 'View Document' }}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {{ fileName || (mimeType ? mimeType : '') }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <!-- Zoom controls -->
            <button
              class="px-3 py-2 rounded-xl text-xs font-extrabold border-2 border-gray-200 hover:bg-gray-50"
              @click="zoomOut"
              :disabled="zoom <= 0.5"
              title="Zoom out"
            >
              -
            </button>
            <div class="px-3 py-2 rounded-xl text-xs font-extrabold border-2 border-gray-200 bg-gray-50">
              {{ Math.round(zoom * 100) }}%
            </div>
            <button
              class="px-3 py-2 rounded-xl text-xs font-extrabold border-2 border-gray-200 hover:bg-gray-50"
              @click="zoomIn"
              :disabled="zoom >= 3"
              title="Zoom in"
            >
              +
            </button>

            <button
              class="px-3 py-2 rounded-xl text-xs font-extrabold border-2 border-[#42ad43] text-[#42ad43] hover:bg-[#42ad43] hover:text-white transition"
              @click="reload"
              title="Reload"
            >
              Reload
            </button>

            <button
              class="w-10 h-10 rounded-2xl border-2 border-gray-200 hover:bg-gray-50 flex items-center justify-center"
              @click="emit('close')"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="relative h-[70vh] bg-gray-50">
          <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
            <div class="text-sm font-semibold text-gray-600">Loading document…</div>
          </div>

          <div v-else-if="errorMsg" class="absolute inset-0 flex items-center justify-center p-6">
            <div class="max-w-xl bg-white border border-red-200 rounded-2xl p-4">
              <p class="text-sm font-extrabold text-red-700 mb-1">Couldn’t load the file</p>
              <p class="text-xs text-gray-600">{{ errorMsg }}</p>
              <p class="text-xs text-gray-500 mt-3">
                Tip: Make sure your Storage bucket + RLS allow OSCA staff to read this file.
              </p>
            </div>
          </div>

          <div v-else class="h-full overflow-auto p-4">
            <!-- PDF -->
            <div v-if="isPdf" class="w-full h-full">
              <!-- iframe shows built-in PDF viewer with native zoom too -->
              <iframe
                :src="signedUrl"
                class="w-full h-full rounded-2xl border bg-white"
                style="transform-origin: top left;"
                :style="{ transform: `scale(${zoom})` }"
              />
            </div>

            <!-- Image -->
            <div v-else-if="isImage" class="flex justify-center">
              <img
                :src="signedUrl"
                class="rounded-2xl border bg-white max-w-none"
                style="transform-origin: top left;"
                :style="{ transform: `scale(${zoom})` }"
                alt="Uploaded document"
              />
            </div>

            <!-- Other file types -->
            <div v-else class="p-6 bg-white rounded-2xl border">
              <p class="text-sm font-extrabold text-gray-900 mb-1">Preview not available</p>
              <p class="text-xs text-gray-600 mb-4">
                This file type can’t be previewed here.
              </p>

              <a
                v-if="signedUrl"
                :href="signedUrl"
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center px-4 py-2 rounded-xl text-xs font-extrabold border-2 border-[#42ad43] text-[#42ad43] hover:bg-[#42ad43] hover:text-white transition"
              >
                Open in new tab
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-4 sm:px-6 py-3 border-t flex items-center justify-between">
          <p class="text-[11px] text-gray-500 truncate">
            {{ storagePath ? `Path: ${storagePath}` : '' }}
          </p>

          <a
            v-if="signedUrl"
            :href="signedUrl"
            target="_blank"
            rel="noreferrer"
            class="text-[11px] font-extrabold text-[#42ad43] hover:underline"
          >
            Open in new tab
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { supabase } from '@/supabase/client'

const props = defineProps<{
  open: boolean
  title?: string
  bucketFallback?: string
  storagePath?: string | null
  fileName?: string | null
  mimeType?: string | null
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const loading = ref(false)
const errorMsg = ref('')
const signedUrl = ref<string>('')

const zoom = ref(1)
function zoomIn() {
  zoom.value = Math.min(3, Number((zoom.value + 0.25).toFixed(2)))
}
function zoomOut() {
  zoom.value = Math.max(0.5, Number((zoom.value - 0.25).toFixed(2)))
}

const isPdf = computed(() => {
  const mt = (props.mimeType || '').toLowerCase()
  const fn = (props.fileName || '').toLowerCase()
  return mt.includes('pdf') || fn.endsWith('.pdf')
})

const isImage = computed(() => {
  const mt = (props.mimeType || '').toLowerCase()
  const fn = (props.fileName || '').toLowerCase()
  return (
    mt.startsWith('image/') ||
    fn.endsWith('.png') ||
    fn.endsWith('.jpg') ||
    fn.endsWith('.jpeg') ||
    fn.endsWith('.webp')
  )
})

/**
 * ✅ SAFE bucket/path parsing:
 * - If storagePath is "bucket::path/to/file" → use that
 * - Else if first segment is a known bucket name → treat as bucket/path
 * - Else → treat entire string as "path inside bucketFallback"
 */
const KNOWN_BUCKETS = new Set([
  'documents',
  'public',
  'private',
  'avatars',
  'uploads',
])

function splitBucketAndPath(storagePath: string) {
  const clean = storagePath.replace(/^\/+/, '').trim()

  // Explicit format: "bucket::path/to/file"
  if (clean.includes('::')) {
    const [bucket, ...rest] = clean.split('::')
    return { bucket, path: rest.join('::') }
  }

  const parts = clean.split('/').filter(Boolean)
  const first = parts[0]

  // Only treat first segment as bucket if it matches known buckets
  if (parts.length >= 2 && KNOWN_BUCKETS.has(first)) {
    return { bucket: first, path: parts.slice(1).join('/') }
  }

  // Otherwise, it's a path inside the fallback bucket
  return { bucket: props.bucketFallback || 'documents', path: clean }
}

async function loadSignedUrl() {
  errorMsg.value = ''
  signedUrl.value = ''
  if (!props.storagePath) return

  loading.value = true
  try {
    const { bucket, path } = splitBucketAndPath(props.storagePath)

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 10)

    if (error) throw error
    signedUrl.value = data?.signedUrl || ''
    if (!signedUrl.value) throw new Error('Signed URL is empty.')
  } catch (e: any) {
    errorMsg.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
}

function reload() {
  loadSignedUrl()
}

watch(
  () => [props.open, props.storagePath],
  ([open]) => {
    if (open) {
      zoom.value = 1
      loadSignedUrl()
    }
  }
)
</script>
