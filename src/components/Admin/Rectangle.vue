<!-- components/Admin/Rectangle.vue -->
<template>
  <div
    class="bg-white border-[6px] border-[#2e6b38] shadow-sm
           w-full max-w-3xl
           px-4 py-3
           flex items-center justify-between gap-4"
    style="border-radius: 2px"
  >
    <!-- Left: requirement name -->
    <div class="min-w-0">
      <p class="text-gray-900 font-semibold truncate">
        {{ title }}
      </p>
    </div>

    <!-- Right: Edit button -->
    <RouterLink
      :to="to"
      class="shrink-0 px-6 py-1.5 rounded-full bg-[#2e6b38] text-white font-semibold text-xs
             hover:brightness-105 active:brightness-95 transition"
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
