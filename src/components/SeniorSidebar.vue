<template>
  <transition name="fade-slide">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex"
      aria-label="More options sidebar"
    >
      <!-- Panel ON THE LEFT -->
      <aside
        class="relative w-64 max-w-[80vw] h-full bg-gradient-to-b from-emerald-50 via-white to-emerald-50/70
               text-emerald-900 shadow-2xl rounded-r-3xl border border-emerald-100
               flex flex-col"
      >
        <!-- Header -->
        <div class="px-5 py-4 border-b border-emerald-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-lg"
            >
              ⋯
            </div>
            <h2 class="font-semibold text-emerald-800 text-lg tracking-wide">
              More options
            </h2>
          </div>
          <button
            @click="$emit('close')"
            class="p-1.5 rounded-full hover:bg-emerald-100 text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-4 space-y-1 text-sm">
          <router-link
            to="/senior/settings"
            class="nav-item"
            @click="$emit('close')"
          >
            <span class="nav-label"> > Settings</span>
          </router-link>

          <router-link
            to="/senior/about"
            class="nav-item"
            @click="$emit('close')"
          >
            <span class="nav-label">> About SeniorGo</span>
          </router-link>
        </nav>

        <!-- Logout (separate section) -->
        <div class="border-t border-emerald-100 px-4 py-3">
          <router-link
            to="/logout"
            class="nav-item !text-red-600 hover:!bg-red-50"
            @click="$emit('close')"
          >
            <span class="nav-label font-semibold">Log out</span>
          </router-link>
        </div>
      </aside>

      <!-- Backdrop fills the rest -->
      <div
        class="flex-1 bg-black/30"
        @click="$emit('close')"
      ></div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  open: { type: Boolean, required: true }
})

defineEmits(['close'])
</script>

<style scoped>
/* Animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Re-usable item style for big tap targets */
.nav-item {
  @apply flex items-center gap-3 w-full px-3 py-3 rounded-2xl
    text-emerald-800 font-medium
    hover:bg-emerald-50 active:bg-emerald-100
    focus:outline-none focus:ring-2 focus:ring-emerald-400;
}

.nav-icon {
  @apply text-xl w-7 flex justify-center;
}

.nav-label {
  @apply text-base;
}
</style>
