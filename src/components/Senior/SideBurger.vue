<template>
  <div v-if="open" class="fixed inset-0 z-50">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/40"
      @click="$emit('close')"
    />

    <!-- Drawer -->
    <aside
      class="absolute left-0 top-0 h-full w-64 bg-white shadow-lg p-4 flex flex-col"
    >
      <h2 class="text-lg font-semibold mb-6">Menu</h2>

      <nav class="flex-1 space-y-4">
        <button class="menu-item">About</button>
        <button class="menu-item">Settings</button>
      </nav>

      <button
        @click="handleLogout"
        class="text-red-600 font-medium mt-auto"
      >
        Logout
      </button>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

defineProps<{ open: boolean }>()
defineEmits(['close'])

const { logout } = useAuth()

const handleLogout = async () => {
  await logout()
}
</script>

<style scoped>
.menu-item {
  @apply text-left w-full py-2 px-2 rounded hover:bg-gray-100;
}
</style>
