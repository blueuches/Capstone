
<template>
  <button
    class="w-full rounded-3xl bg-[#42ad43] text-white shadow-sm active:scale-[0.995] transition-transform
           flex flex-col items-center justify-between px-4 py-5 min-h-[180px]"
    :class="disabled ? 'opacity-60 cursor-not-allowed active:scale-100' : ''"
    @click="handleApply"
    type="button"
  >
    <!-- top spacer for that “tall card” feel -->
    <div class="w-full flex-1 flex items-center justify-center">
      <p
        class="text-[11px] sm:text-xs font-extrabold tracking-wide uppercase text-center leading-snug whitespace-pre-line"
      >
        {{ title }}
      </p>
    </div>

    <!-- bottom pill -->
    <div class="w-full flex items-center justify-center mt-4">
      <div
        class="bg-white text-[#42ad43] font-bold text-[11px] px-4 py-2 rounded-full shadow-sm"
      >
        {{ subtitle || 'Click to Apply' }}
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  subtitle?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'apply'): void
}>()

function handleApply() {
  if (props.disabled) return
  emit('apply')
}
</script>
