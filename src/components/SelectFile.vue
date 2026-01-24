<!-- components/SelectFile.vue -->
<template>
  <div v-if="modelValue" class="fixed inset-0 z-50">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/40" @click="onCancel"></div>

    <!-- Modal -->
    <div class="absolute inset-0 flex items-end sm:items-center justify-center p-3">
      <div class="w-full sm:max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="px-5 pt-5 pb-3 border-b border-gray-100">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-base font-extrabold text-gray-900">{{ title }}</h3>
              <p v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
            </div>

            <button
              type="button"
              class="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center
                     active:scale-[0.98]"
              @click="onCancel"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="px-5 py-4">
          <label
            class="block rounded-2xl border-2 border-dashed border-gray-200 p-4 text-center
                   hover:border-[#42ad43] hover:bg-emerald-50/40 transition"
          >
            <input
              ref="fileInput"
              type="file"
              class="hidden"
              :accept="accept"
              :multiple="multiple"
              @change="onPick"
            />
            <div class="text-2xl">📎</div>
            <div class="mt-2 text-sm font-semibold text-gray-900">
              Click to choose file{{ multiple ? 's' : '' }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {{ acceptHint }}
            </div>
          </label>

          <!-- Selected list -->
          <div v-if="files.length" class="mt-4 space-y-2">
            <div
              v-for="f in files"
              :key="f.name + f.size"
              class="flex items-center justify-between gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-3 py-2"
            >
              <div class="min-w-0">
                <p class="text-xs font-semibold text-gray-900 truncate">{{ f.name }}</p>
                <p class="text-[11px] text-gray-500">
                  {{ formatBytes(f.size) }} • {{ f.type || 'unknown' }}
                </p>
              </div>
              <button
                type="button"
                class="text-xs font-bold text-red-600"
                @click="removeFile(f)"
              >
                Remove
              </button>
            </div>

            <p v-if="sizeError" class="text-xs text-red-600 mt-2">
              {{ sizeError }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-5 pb-5 flex items-center gap-2">
          <button
            type="button"
            class="flex-1 rounded-full py-2.5 text-sm font-extrabold bg-gray-100 text-gray-700"
            @click="onCancel"
          >
            Cancel
          </button>
          <button
            type="button"
            class="flex-1 rounded-full py-2.5 text-sm font-extrabold bg-[#42ad43] text-white
                   disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!files.length || !!sizeError"
            @click="onConfirm"
          >
            Use File
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title?: string
  subtitle?: string
  accept?: string
  multiple?: boolean
  maxSizeMB?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm', files: File[]): void
  (e: 'cancel'): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      files.value = []
      if (fileInput.value) fileInput.value.value = ''
    }
  }
)

const acceptHint = computed(() => {
  if (!props.accept) return 'Any file type'
  return `Accepted: ${props.accept}`
})

const sizeError = computed(() => {
  const maxMB = props.maxSizeMB ?? 10
  const maxBytes = maxMB * 1024 * 1024
  const tooBig = files.value.find(f => f.size > maxBytes)
  return tooBig ? `File too large. Max ${maxMB}MB allowed.` : ''
})

function onPick(e: Event) {
  const input = e.target as HTMLInputElement
  const picked = Array.from(input.files ?? [])
  files.value = props.multiple ? picked : picked.slice(0, 1)
}

function removeFile(f: File) {
  files.value = files.value.filter(x => x !== f)
}

function onCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

function onConfirm() {
  emit('confirm', files.value)
  emit('update:modelValue', false)
}

function formatBytes(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB']
  let n = bytes
  let i = 0
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}
</script>
