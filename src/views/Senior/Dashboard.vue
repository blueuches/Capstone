<template>
  <div class="min-h-screen bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <!-- Greeting Banner -->
    <section class="px-6 pt-4">
      <div
        class="rounded-2xl bg-gradient-to-r from-[#42ad43] to-emerald-500 text-white px-5 py-4 shadow-lg"
      >
        <p class="text-sm opacity-90">Welcome back</p>

        <p v-if="profile" class="text-xl font-semibold leading-tight">
          {{ greeting }}, {{ profile.first_name }}!
        </p>
        <p v-else class="text-xl font-semibold leading-tight">
          {{ greeting }}!
        </p>

        <p class="text-xs opacity-90 mt-1">
          Choose an action below to continue.
        </p>
      </div>
    </section>

    <main class="flex-1 flex items-center justify-center px-6">
      <div class="w-full max-w-md">
        <Tiles />
      </div>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import Tiles from '@/components/Senior/Tiles.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import { useAuth } from '@/composables/useAuth'

const { profile } = useAuth()
const open = ref(false)

const greeting = computed(() => {
  const hour = new Date().getHours()

  // Simple Cebuano time greeting
  if (hour >= 5 && hour < 12) return 'Maayong Buntag'
  if (hour >= 12 && hour < 18) return 'Maayong Hapon'
  return 'Maayong Gabie'
})
</script>
