<!-- components/Admin/Card.vue -->
<template>
  <RouterLink
    :to="to"
    class="group block bg-white border-[6px] border-[#2e6b38]
           w-full max-w-sm h-80 sm:h-96
           flex flex-col items-center justify-center
           px-6 py-8
           shadow-sm hover:shadow-md transition"
    style="border-radius: 2px"
  >
    <!-- Content stack -->
    <div class="flex flex-col items-center text-center space-y-4">
      <!-- Title -->
      <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
        {{ title }}
      </h3>

      <!-- Description -->
      <!-- <p class="text-sm sm:text-base text-gray-600 max-w-xs">
        {{ description }}
      </p> -->

      <!-- Arrow -->
      <div
        class="mt-2 w-10 h-10 rounded-full bg-[#2e6b38] text-white
               flex items-center justify-center
               group-hover:brightness-105 group-active:brightness-95 transition"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 8l4 4-4 4" />
        </svg>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})
</script>
