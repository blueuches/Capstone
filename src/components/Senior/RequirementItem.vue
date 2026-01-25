<template>
  <RouterLink
    :to="route"
    class="block rounded-3xl bg-[#42ad43] text-white px-5 py-4 shadow-sm active:scale-[0.995] transition-transform"
  >
    <div class="flex items-center justify-between gap-4">
      <div class="min-w-0">
        <!-- Top row (tag • service) -->
        <div class="flex items-center gap-2 text-[11px] font-extrabold tracking-wide uppercase">
          <span class="truncate">{{ tag }}</span>
          <span class="w-2 h-2 rounded-full bg-white/90 shrink-0"></span>
          <span class="font-semibold normal-case tracking-normal text-white/95 truncate">
            {{ service }}
          </span>
        </div>

        <!-- Middle row -->
        <div class="mt-2 text-sm font-semibold text-white/95">
          Requirements sent: <span class="font-extrabold">{{ requirementsSent }}/{{ requirementsTotal }}</span>
        </div>

        <!-- Optional small helper line (nice UX, still matches style) -->
        <div class="mt-1 text-xs text-white/80">
          <span v-if="isComplete">All requirements submitted</span>
          <span v-else>{{ remaining }} remaining</span>
        </div>

        <!-- Progress bar (subtle) -->
        <div class="mt-3 h-2 rounded-full bg-white/25 overflow-hidden">
          <div
            class="h-full bg-white/90 rounded-full"
            :style="{ width: progressPercent + '%' }"
          />
        </div>
      </div>

      <!-- Right arrow -->
      <div
        class="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6" />
        </svg>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  tag: string
  service: string
  requirementsSent: number
  requirementsTotal: number
  route: string
  status?: 'ongoing' | 'completed' // placeholder for later
}>()

const progressPercent = computed(() => {
  const total = Math.max(1, props.requirementsTotal)
  const sent = Math.min(Math.max(0, props.requirementsSent), total)
  return Math.round((sent / total) * 100)
})

const remaining = computed(() => {
  const total = Math.max(0, props.requirementsTotal)
  const sent = Math.max(0, props.requirementsSent)
  return Math.max(0, total - sent)
})

const isComplete = computed(() => remaining.value === 0)
</script>
