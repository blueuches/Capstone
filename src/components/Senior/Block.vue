<template>
  <section class="block w-full mb-4">
    <div
      class="w-full rounded-3xl bg-white border border-gray-200 p-4"
    >
      <h2 class="text-sm font-bold text-green-600 mb-3">
        {{ title }}
      </h2>

      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
