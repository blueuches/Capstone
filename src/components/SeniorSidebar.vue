<template>
  <transition name="fade">
    <div
      v-if="open"
      class="absolute top-0 left-0 w-56 h-screen bg-white text-emerald-800 z-50 shadow-xl"
    >
      <!-- Header -->
      <div class="p-4 border-b border-emerald-100 flex justify-between items-center">
        <h2 class="font-semibold text-emerald-700">More</h2>
        <button @click="$emit('close')" class="text-emerald-700">✕</button>
      </div>

      <!-- Navigation -->
      <nav class="p-4 flex flex-col space-y-3">
        <router-link
          to="/senior/settings"
          class="text-emerald-700"
          @click="$emit('close')"
        >
          Settings
        </router-link>

        <router-link
          to="/senior/about"
          class="text-emerald-700"
          @click="$emit('close')"
        >
          About
        </router-link>

        <router-link
          to="/logout"
          class="text-left text-red-600 font-medium"
          @click="$emit('close')"
        >
          Log out
        </router-link>
      </nav>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  open: { type: Boolean, required: true }
})

defineEmits(["close"])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
