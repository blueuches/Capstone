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
      <h2 class="text-lg font-semibold mb-6">Others</h2>

<nav class="flex flex-col gap-2">
  <RouterLink
    to="/senior/about"
    class="menu-row"
  >
    <span class="menu-icon"></span>
    <span>About</span>
  </RouterLink>

  <RouterLink
    to="/senior/settings"
    class="menu-row"
  >
    <span class="menu-icon"></span>
    <span>Settings</span>
  </RouterLink>
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
.menu-row {
  @apply flex items-center gap-3
         w-full
         px-3 py-3
         rounded-xl
         text-sm font-medium text-gray-700
         bg-white
         ring-1 ring-gray-200
         hover:bg-yellow-50 hover:text-yellow-800 hover:ring-yellow-200
         transition;
}

.menu-icon {
  @apply text-base;
}

.router-link-active.menu-row {
  @apply bg-yellow-50 text-yellow-800 ring-yellow-300;
}

</style>
