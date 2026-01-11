<template>
  <transition name="fade">
    <div
      v-if="show"
      class="loader-overlay"
    >
      <div class="loader-circle"></div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: { type: Boolean, required: true }
})
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(243, 250, 248, 0.9); /* soft light green */
  z-index: 9999;
}

.loader-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid #a7f3d0; /* light green */
  border-top-color: #059669; /* emerald green */
  animation: loader-spin 0.8s linear infinite;
}

@keyframes loader-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
