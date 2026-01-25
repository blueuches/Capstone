<template>
  <div
    class="relative bg-[#42ad43] text-white rounded-xl p-4 flex justify-between items-center shadow-sm"
  >
    <!-- Left content -->
    <div>
      <p class="text-xs uppercase font-semibold opacity-90">
        {{ statusLabel }}
      </p>

      <h3 class="text-base font-bold mt-1">
        {{ title }}
      </h3>

      <p class="text-xs mt-1 opacity-90">
        Started at: {{ startedAt }}
      </p>

      <p class="text-xs mt-1 opacity-90">
        {{ statusLabel }}
      </p>

      <RouterLink
        :to="requirementsLink"
        class="text-xs underline mt-2 inline-block text-yellow-300"
      >
        View Requirements
      </RouterLink>
    </div>

    <!-- Right arrow -->
    <RouterLink
      :to="update"
      class="flex items-center justify-center"
    >
      <component
        :is="Right"
        class="tile-icon w-6 h-6 text-white"
      />
    </RouterLink>

    <!-- Notification badge -->
    <span
      v-if="unreadCount > 0"
      class="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full"
    >
      {{ unreadCount }}
    </span>
  </div>
</template>

<script setup lang="ts">
import Right from '@/assets/icons/senior/right-arrow.svg'

withDefaults(defineProps<{
  title: string
  statusLabel: string
  startedAt: string
  requirementsLink: string
  update: string
  unreadCount?: number
}>(), {
  unreadCount: 0
})
</script>

<style scoped>
.tile-icon :deep(path),
.tile-icon :deep(circle),
.tile-icon :deep(rect),
.tile-icon :deep(polygon),
.tile-icon :deep(line),
.tile-icon :deep(polyline) {
  fill: currentColor !important;
  stroke: currentColor !important;
}
</style>