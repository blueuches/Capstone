<template>
  <RouterLink
    :to="to"
    class="group flex items-center gap-3 rounded-xl px-3 py-3 transition
           focus:outline-none focus:ring-2 focus:ring-white/40"
    :class="[
      isActive ? 'bg-white/20' : 'bg-[#42ad43] hover:bg-white/15 active:bg-white/20'
    ]"
  >
    <div
      class="w-10 h-10 rounded-xl bg-[#42ad43] flex items-center justify-center transition"
      :class="isActive ? 'bg-[#42ad43]' : 'group-hover:bg-[#42ad43]'"
    >
      <img
        :src="icon"
        alt=""
        class="w-5 h-5 object-contain"
      />

    </div>

    <div v-if="!collapsed" class="font-semibold text-sm text-white tracking-wide">
      {{ label }}
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

//type IconComponent = Record<string, any>

const props = defineProps<{
  label: string
  to: string
  icon: string
  collapsed: boolean
}>()

const route = useRoute()

// simple active check (works for exact paths)
// if you want "startsWith" behavior, tell me and I’ll adjust
const isActive = computed(() => route.path === props.to)
</script>
