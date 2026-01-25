<!-- components/Admin/CardEdit.vue -->
<template>
  <div
    class="bg-white border-[6px] border-[#2e6b38] shadow-sm
           w-full max-w-sm h-32 sm:h-36
           flex flex-col items-center justify-center
           px-4 py-4"
    style="border-radius: 2px"
  >
    <!-- Title -->
    <div class="text-center text-gray-900 font-semibold leading-snug">
      {{ title }}
    </div>

    <!-- Edit button -->
    <RouterLink
      :to="to"
      class="mt-3 inline-flex items-center justify-center
             px-10 py-1.5 rounded-full
             bg-[#2e6b38] text-white font-semibold
             hover:brightness-50 active:brightness-20 transition"
    >
      Edit
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  to: string
}>()
</script>
