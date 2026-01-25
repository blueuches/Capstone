<template>
  <RouterLink
    :to="to"
    class="group w-full sm:w-auto"
  >
    <div
      class="w-full sm:w-[220px] h-[56px] sm:h-[52px] rounded-xl bg-[#2e6b38] text-white
             flex items-center justify-center text-sm font-semibold
             shadow-sm border border-black/0
             transition transform
             hover:shadow-md hover:-translate-y-[1px] hover:brightness-95
             active:translate-y-0 active:brightness-90
             focus:outline-none focus:ring-2 focus:ring-[#2e6b38]/40"
    >
      <span class="px-4 text-center leading-tight">
        {{ label }}
      </span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { logout } = useAuth()

defineProps<{
  label: string
  to: string
}>()
</script>
