<template>
  <div v-if="open" class="fixed inset-0 z-50">
    <!-- overlay -->
    <div class="absolute inset-0 bg-black/40" @click="$emit('cancel')"></div>

    <!-- modal -->
    <div class="absolute inset-0 flex items-end justify-center p-4">
      <div class="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-5">
        <h3 class="text-base font-extrabold text-gray-900">{{ title }}</h3>
        <p class="text-sm text-gray-600 mt-2">{{ message }}</p>

        <div class="mt-4 flex gap-3">
          <button
            class="flex-1 px-4 py-2 rounded-2xl border border-gray-200 text-sm font-bold text-gray-700 active:scale-[0.99]"
            @click="$emit('cancel')"
          >
            {{ cancelText || 'Cancel' }}
          </button>

          <button
            class="flex-1 px-4 py-2 rounded-2xl text-sm font-extrabold text-white active:scale-[0.99]"
            :class="danger ? 'bg-red-600' : 'bg-[#42ad43]'"
            @click="$emit('confirm')"
          >
            {{ confirmText || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}>()

defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>
