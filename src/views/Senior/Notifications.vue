<template>
  <!-- Header -->

  <div class="bg-gray-50 min-h-screen flex flex-col">
      <header class="w-full bg-white shadow-md fixed top-0 z-40 flex items-center justify-between px-6 py-3">
    <div class="flex items-center gap-2">
      <div class="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
        S
      </div>
      <h1 class="font-bold text-emerald-700 text-lg sm:text-xl">Notifications</h1>
    </div>
    <button class="px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm sm:text-base hover:bg-emerald-700 transition">
      Back to Dashboard
    </button>
  </header>

  <!-- Main -->
  <main class="flex-1 pt-24 pb-10 px-4 sm:px-6 max-w-3xl mx-auto space-y-6">

    <!-- Title -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-800">Your Notifications</h2>
      <button id="markAllBtn" class="text-sm px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
        Mark All as Read
      </button>
    </div>

    <!-- Notification List -->
    <section id="notifList" class="space-y-4">
      <!-- Notifications will render here -->
    </section>
  </main>

  </div>
  
</template>

<script setup>
// design-only; no functionality
</script>

<style scoped>
.tab {
  @apply h-9 px-4 rounded-full text-sm text-slate-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F4C81];
  min-width: 64px;
}
.tab-active {
  @apply bg-white text-[#0F4C81] font-medium shadow;
}
.card {
  @apply w-full flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:shadow-md transition-shadow;
}
.card.unread {
  @apply bg-[#F7FAFC] border-sky-200;
}
.icon {
  @apply h-9 w-9 shrink-0 grid place-items-center rounded-full text-sm font-semibold;
}
.title {
  @apply text-sm font-semibold text-[#0B1320] truncate;
}
.snippet {
  @apply text-xs text-slate-600 truncate;
}
.time {
  @apply mt-1 text-[11px] text-slate-500;
}
.dot {
  @apply h-3 w-3 rounded-full bg-red-500 shrink-0 self-start mt-1;
}
</style>
