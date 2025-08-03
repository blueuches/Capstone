<template>
  <button
    :class="[primary ? 'bg-blue-600' : 'bg-red-600', 'text-white rounded-xl p-4 text-xl']"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  primary: Boolean
})
</script>