<template>
  <button
    type="button"
    @click="go()"
    class="group w-full bg-[#42ad43] text-white rounded-lg px-5 py-3
           flex items-center justify-between gap-3 shadow-sm
           hover:brightness-105 active:brightness-95 transition"
  >
    <!-- Name: allow up to 2 lines -->
    <span
      class="min-w-0 flex-1 font-semibold tracking-wide leading-snug
             line-clamp-2 break-words"
      :title="name"
    >
      {{ name }}
    </span>

    <!-- right small circle + arrow (always visible) -->
    <span
      class="shrink-0 w-7 h-7 rounded-full bg-white/20
             flex items-center justify-center
             group-hover:bg-white/25 transition"
      aria-hidden="true"
    >
      <svg
        class="w-4 h-4 translate-x-[0.5px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </span>
  </button>
</template>


<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  id: string
  name: string
  toName?: string
}>()

const router = useRouter()

function go() {
  const routeName = props.toName ?? 'barangay-info'
  router.push({
    name: routeName,
    params: { barangayId: props.id }
  })
}
</script>
