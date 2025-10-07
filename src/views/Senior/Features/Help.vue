<template>
  <div class="bg-gradient-to-b from-emerald-50 to-white min-h-screen flex flex-col">
    <!-- Sticky Top Bar -->
    <header
      class="sticky top-0 z-40 bg-emerald-600 text-white shadow-md"
      role="banner"
    >
      <div class="px-4 py-3 flex items-center gap-3">
        <button aria-label="Menu" @click="sidebarOpen = !sidebarOpen" class="p-2 rounded-full hover:bg-emerald-700/40">
          <!-- hamburger -->
          <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <!-- App title -->
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

    </header>

<transition name="fade">
  <div v-if="sidebarOpen"
       class="absolute top-0 left-0 w-56 h-screen bg-white text-emerald-800 z-50 shadow-xl">
    <div class="p-4 border-b border-emerald-100 flex justify-between items-center">
      <h2 class="font-semibold text-emerald-700">More</h2>
      <button @click="sidebarOpen = false" class="text-emerald-700">✕</button>
    </div>
    <nav class="p-4 flex flex-col space-y-3">
      <router-link to="#" class="text-emerald-700">Settings</router-link>
      <router-link to="#" class="text-emerald-700">About</router-link>
      <router-link to="#" class="text-emerald-700">Complain</router-link>
      <button @click="sidebarOpen=false" class="text-left text-red-600 font-medium">Log out</button>
    </nav>
  </div>
</transition>

    <main class="flex-1 overflow-y-auto px-4 pb-[88px] pt-3">
  <div class="p-4 space-y-3">
      <nav class="text-sm text-emerald-700 mb-4" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <router-link to="/senior/dashboard" class="hover:underline font-medium">Dashboard</router-link>
          </li>
          <li class="text-emerald-500">›</li>
          <li class="font-semibold text-emerald-700">Help & FAQs</li>
        </ol>
      </nav>

    <label class="relative block">
      <svg class="absolute left-3 top-2.5 h-5 w-5 text-emerald-900/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle><path d="m21 21-3.5-3.5"></path>
      </svg>
      <input v-model="q" type="search" placeholder="Search question..."
             class="w-full rounded-xl pl-10 pr-3 py-2 text-[15px] bg-white ring-1 ring-emerald-200 focus:ring-2 focus:ring-yellow-300 outline-none"/>
    </label>

    <div v-for="(f,i) in filteredFaqs" :key="i"
         class="bg-white rounded-xl p-4 ring-1 ring-emerald-100 shadow-sm">
      <button class="w-full text-left font-semibold text-emerald-800"
              @click="f.open=!f.open">
        {{ f.q }}
      </button>
      <transition name="fade">
        <p v-if="f.open" class="mt-2 text-sm text-gray-700">{{ f.a }}</p>
      </transition>
    </div>

    <div class="bg-emerald-50 rounded-xl p-4 text-sm text-emerald-900">
      <p class="font-semibold">Need more help?</p>
      <p>Call OSCA Butuan Hotline: <span class="font-bold">0999-123-4567</span></p>
    </div>
  </div>

    </main>

    <!-- Sticky Bottom Tabbar (safe-area aware) -->
    <nav
      class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70
             border-t border-emerald-100 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)]"
      role="navigation"
    >
      <ul class="flex items-center justify-around px-6">
                <li>
          <router-link
            to="/senior/notifications"
            class="relative w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"
            aria-label="Notifications"
          >
            <!-- bell -->
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 5 3 9H3c0-4 3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>
            </svg>

          </router-link>
        </li>

        <li>
          <button
            class="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg"
            aria-label="Voice"
          >
            <!-- mic -->
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z"/>
              <path d="M19 11a7 7 0 0 1-14 0"/><path d="M12 18v4"/>
            </svg>
          </button>
        </li>

        <li>
          <router-link
            to="/senior/dashboard"
            class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"
            aria-label="Home"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>

          </router-link>
        </li>

      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const sidebarOpen = ref(false)
const faqs = ref([
  { q:'How do I apply for a social pension?', a:'Go to your Barangay OSCA focal person and submit your requirements.', open:false },
  { q:'Who qualifies for medical assistance?', a:'All registered senior citizens who meet income criteria.', open:false }
])
const q = ref('')
const filteredFaqs = computed(()=> !q.value ? faqs.value :
  faqs.value.filter(f=>f.q.toLowerCase().includes(q.value.toLowerCase())))

const avatarUrl = ref("https://via.placeholder.com/60");

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
