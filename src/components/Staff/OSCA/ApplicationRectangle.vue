<template>
  <button
    type="button"
    @click="go"
    class="group w-full bg-[#42ad43] text-white rounded-xl px-6 py-5
           shadow-sm hover:shadow-md hover:-translate-y-[1px]
           hover:brightness-105 active:brightness-95 active:translate-y-0
           transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#42ad43]/40"
  >
    <div class="w-full flex items-start justify-between gap-4">
      <!-- Text -->
      <div class="min-w-0 flex-1 text-left">
        <div class="text-xs font-extrabold tracking-widest opacity-95">
          {{ topLabel }}
        </div>

        <div
          class="mt-2 font-semibold leading-snug text-base sm:text-lg
                 line-clamp-3 break-words"
          :title="name"
        >
          {{ name }}
        </div>
      </div>

      <!-- Arrow circle -->
      <span
        class="shrink-0 w-7 h-7 rounded-full bg-white/20
               flex items-center justify-center
               group-hover:bg-white/30 transition"
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
    </div>
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    id: string
    name: string
    /** Route name for IssuancePageInfo.vue */
    toName?: string
    /** Small label above the issuance name (prototype: "OSCA ID") */
    topLabel?: string
  }>(),
  {
    topLabel: 'OSCA ID'
  }
)

const router = useRouter()

async function go() {
  const routeName = props.toName ?? 'issuance-info'
  try {
    await router.push({
      name: routeName,
      params: { issuanceTypeId: props.id }
    })
  } catch (e) {
    console.error('Navigation error:', e)
  }
}
</script>
