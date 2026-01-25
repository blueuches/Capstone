<template>
  <header class="bg-[#42ad43] text-white px-4 py-6">
    <div class="relative flex items-center justify-between">
      <!-- Burger -->
      <button
        @click="$emit('toggle-menu')"
        class="h-11 w-11 rounded-xl grid place-items-center
               bg-white/10 hover:bg-white/20 active:bg-white/25
               transition"
        aria-label="Open menu"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Truly centered title -->
      <h1 class="absolute left-1/2 -translate-x-1/2 text-xl font-bold tracking-wide">
        SeniorGo
      </h1>

      <!-- Right spacer to balance burger width -->
      <div class="h-11 w-11"></div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits(['toggle-menu'])
</script>
