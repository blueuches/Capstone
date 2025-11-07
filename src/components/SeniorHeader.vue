<template>
  <!-- Sticky Top Bar -->
  <header
    class="sticky top-0 z-40 bg-emerald-600 text-white shadow-md"
    role="banner"
  >
    <div class="px-4 py-3 flex items-center gap-3">
      <!-- ✅ emit toggle-sidebar to parent -->
      <button aria-label="Menu" @click="$emit('toggle-sidebar')" class="p-2 rounded-full hover:bg-emerald-700/40">
        <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h1 class="flex-1 text-lg font-bold text-center -ml-8">SeniorGo</h1>

      <router-link to="/senior/profile" aria-label="Profile" class="shrink-0">
        <img
          :src="avatarUrl"
          @error="useInlineAvatar"
          class="w-8 h-8 rounded-full border border-white/70 object-cover"
          alt="Profile"
        />
      </router-link>
    </div>

    <!-- Search row -->
    <div class="px-4 pb-3">
      <label class="relative block">
        <span class="sr-only">Search</span>
        <svg
          class="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-emerald-900/70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-3.5-3.5"></path>
        </svg>
        <input
          type="search"
          placeholder="Search"
          class="w-full rounded-xl pl-10 pr-3 py-2 text-[15px] placeholder:opacity-70
                 bg-white/95 text-emerald-950 ring-1 ring-emerald-200 focus:ring-2 focus:ring-yellow-300 outline-none"
        />
      </label>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const avatarUrl = ref('')

function useInlineAvatar() {
  avatarUrl.value =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
      <rect width="100%" height="100%" fill="#ecfdf5"/>
      <circle cx="30" cy="22" r="12" fill="#10b981" fill-opacity="0.5"/>
      <rect x="14" y="38" width="32" height="14" rx="7" fill="#10b981" fill-opacity="0.35"/>
    </svg>`)
}

onMounted(() => useInlineAvatar())

</script>
