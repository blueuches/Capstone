<template>
  <div class="flex flex-col h-dvh bg-gradient-to-b from-emerald-50 to-white overflow-hidden">
    <!-- Header -->
    <header class="flex-none bg-emerald-600 text-white shadow-md z-40">
      <div class="px-4 py-3 flex items-center gap-3">
        <button
          aria-label="Menu"
          @click="sidebarOpen = !sidebarOpen"
          class="p-2 rounded-full hover:bg-emerald-700/40"
        >
          <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 class="flex-1 text-lg font-bold text-center -ml-8 tracking-wide">SeniorGo</h1>

        <router-link to="/senior/profile" aria-label="Profile" class="shrink-0">
          <img
            :src="avatarUrl"
            @error="useInlineAvatar"
            class="w-8 h-8 rounded-full border border-white/70 object-cover"
            alt="Profile"
          />
        </router-link>
      </div>

      <div class="px-4 pb-3">
        <label class="relative block">
          <svg
            class="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-emerald-900/70"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-3.5-3.5" />
          </svg>
          <input
            v-model="search"
            type="search"
            placeholder="Search programs..."
            class="w-full rounded-xl pl-10 pr-3 py-2 text-[15px]
                   placeholder:opacity-70 bg-white/95 text-emerald-950
                   ring-1 ring-emerald-200 focus:ring-2 focus:ring-yellow-300 outline-none"
          />
        </label>
      </div>
    </header>

    <!-- Sidebar -->
    <transition name="fade">
      <div v-if="sidebarOpen" class="fixed inset-0 z-50 flex">
        <div class="w-56 bg-white text-emerald-800 shadow-xl flex flex-col h-full">
          <div class="p-4 border-b border-emerald-100 flex justify-between items-center">
            <h2 class="font-semibold text-emerald-700">More</h2>
            <button @click="sidebarOpen = false" class="text-emerald-700">✕</button>
          </div>
          <nav class="p-4 flex flex-col space-y-3 flex-1">
            <router-link to="#" class="hover:text-emerald-600">Settings</router-link>
            <router-link to="#" class="hover:text-emerald-600">About</router-link>
            <router-link to="#" class="hover:text-emerald-600">Complain</router-link>
          </nav>
          <button
            @click="sidebarOpen = false"
            class="text-left text-red-600 font-medium p-4 border-t border-emerald-100"
          >
            Log out
          </button>
        </div>
        <div class="flex-1 bg-black/40" @click="sidebarOpen = false"></div>
      </div>
    </transition>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto px-4 pt-3 pb-[88px]">
        <nav class="text-sm text-emerald-700 mb-4" aria-label="Breadcrumb">
    <ol class="list-reset flex items-center space-x-2">
        <li>
        <a href="/senior/dashboard" class="hover:underline font-medium">Dashboard</a>
        </li>
        <li class="text-emerald-500">›</li>
        <li class="font-semibold text-emerald-700">Programs</li>
    </ol>
    </nav>

      <!-- Loading State -->
      <div v-if="loading" class="text-center text-gray-500 py-8">
        <svg class="animate-spin w-6 h-6 mx-auto mb-2 text-emerald-600" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
        Loading programs...
      </div>

      <!-- Program List -->
      <div v-else class="space-y-4">
        <div
          v-for="p in filteredPrograms"
          :key="p.id"
          class="bg-white rounded-2xl shadow-md ring-1 ring-emerald-100 p-4 hover:shadow-lg transition-all duration-200"
        >
          <div class="flex items-start justify-between">
            <div>
              <h2 class="font-semibold text-emerald-800 text-lg">{{ p.name }}</h2>
              <p class="text-sm text-gray-600 mt-1">{{ p.description }}</p>
            </div>
            <button
              class="text-emerald-600 text-sm font-medium"
              @click="p.open = !p.open"
            >
              {{ p.open ? 'Hide' : 'Read more' }}
            </button>
          </div>

          <transition name="fade">
            <div v-if="p.open" class="mt-3 text-[15px] space-y-2 border-t border-emerald-50 pt-3">
              <p><span class="font-semibold text-emerald-700">Eligibility:</span> {{ p.eligibility }}</p>
              <p><span class="font-semibold text-emerald-700">Requirements:</span></p>
              <ul class="list-disc ml-5 text-gray-700">
                <li v-for="req in p.requirements" :key="req">{{ req }}</li>
              </ul>
              <p><span class="font-semibold text-emerald-700">Process:</span></p>
              <p class="whitespace-pre-line">{{ p.process }}</p>
              <p v-if="p.benefits"><span class="font-semibold text-emerald-700">Benefits:</span> {{ p.benefits }}</p>
              <p v-if="p.contact_info" class="text-sm text-gray-500 italic">Contact: {{ p.contact_info }}</p>
            </div>
          </transition>
        </div>
      </div>
    </main>

    <!-- Bottom Tabbar -->
    <nav
      class="flex-none fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur
             border-t border-emerald-100 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)]"
    >
      <ul class="flex items-center justify-around px-6">
        <li>
          <router-link
            to="/senior/notifications"
            class="relative w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 5 3 9H3c0-4 3-2 3-9" />
              <path d="M10 21a2 2 0 0 0 4 0" />
            </svg>
          </router-link>
        </li>

        <li>
          <button
            class="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg"
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z" />
              <path d="M19 11a7 7 0 0 1-14 0" />
              <path d="M12 18v4" />
            </svg>
          </button>
        </li>

        <li>
          <router-link
            to="/senior/dashboard"
            class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { supabase } from '@/supabase/client'

const sidebarOpen = ref(false);
const avatarUrl = ref("https://via.placeholder.com/60");
const search = ref("");
const programs = ref([]);
const loading = ref(true);

// fetch Programs from database
onMounted(async () => {
  const { data, error } = await supabase
    .from("Programs")
    .select("id, name, description, process, requirements, eligibility, benefits, contact_info");
  if (error) {
    console.error("Error loading programs:", error.message);
  } else {
    programs.value = data.map((p) => ({ ...p, open: false }));
  }
  loading.value = false;
});

const filteredPrograms = computed(() =>
  programs.value.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

function useInlineAvatar() {
  avatarUrl.value =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
      <rect width="100%" height="100%" fill="#ecfdf5"/>
      <circle cx="30" cy="22" r="12" fill="#10b981" fill-opacity="0.5"/>
      <rect x="14" y="38" width="32" height="14" rx="7" fill="#10b981" fill-opacity="0.35"/>
    </svg>`);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
main {
  -webkit-overflow-scrolling: touch;
}
</style>
