<template>
  <div class="space-y-4">
    <div
      v-for="msg in messages"
      :key="msg.id"
      class="flex"
      :class="msg.sender === 'staff' ? 'justify-start' : 'justify-end'"
    >
      <div
        class="max-w-[75%] px-4 py-3 rounded-xl"
        :class="msg.sender === 'staff'
          ? 'bg-yellow-400 text-black'
          : 'bg-[#42ad43] text-white'"
      >
        <p class="text-xs font-semibold mb-1">
          {{ msg.name }}
        </p>

        <p class="text-sm">
          {{ msg.text }}
        </p>

        <p class="text-[10px] opacity-70 mt-1">
          {{ msg.date }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  messages: Array<any>
}>()
</script>
