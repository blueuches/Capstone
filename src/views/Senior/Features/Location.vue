<template>
  <div class="bg-gradient-to-b from-emerald-50 via-white to-emerald-50/40 min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-emerald-600 text-white shadow-md">
      <div class="px-4 py-3 flex items-center gap-3">
        <!-- Menu -->
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 rounded-full hover:bg-emerald-700/40">
          <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 class="flex-1 text-lg font-semibold text-center -ml-8 tracking-wide">SeniorGo</h1>

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

    <!-- Sidebar -->
    <transition name="fade">
      <div v-if="sidebarOpen" class="absolute top-0 left-0 w-56 h-screen bg-white text-emerald-800 z-50 shadow-xl">
        <div class="p-4 border-b border-emerald-100 flex justify-between items-center">
          <h2 class="font-semibold text-emerald-700">More</h2>
          <button @click="sidebarOpen = false" class="text-emerald-700">✕</button>
        </div>
        <nav class="p-4 flex flex-col space-y-3">
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
    </transition>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto px-4 pt-3 pb-[88px]">
      <nav class="text-sm text-emerald-700 mb-4" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <router-link to="/senior/dashboard" class="hover:underline font-medium">Dashboard</router-link>
          </li>
          <li class="text-emerald-500">›</li>
          <li class="font-semibold text-emerald-700">Location</li>
        </ol>
      </nav>

      <!-- Map Card -->
      <div
        class="bg-white rounded-2xl overflow-hidden shadow-md ring-1 ring-emerald-100 border border-emerald-50"
      >
        <iframe
          class="w-full h-64 sm:h-72"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1591.986654080655!2d125.54294177733093!3d8.949163046404502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3301eaa4a0f3a8a1%3A0xe8d0b64bb98c1cc7!2sOSCA%20Butuan%20City%20Hall!5e0!3m2!1sen!2sph!4v1697711299704!5m2!1sen!2sph"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <!-- Address Card -->
      <div class="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-4 ring-1 ring-emerald-100 shadow-sm mt-4">
        <h2 class="text-emerald-800 font-semibold text-base mb-1 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 11c.828 0 1.5-.672 1.5-1.5S12.828 8 12 8s-1.5.672-1.5 1.5S11.172 11 12 11z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s8-7.373 8-11.5A8 8 0 1 0 4 9.5C4 13.627 12 21 12 21z" />
          </svg>
          OSCA Butuan City Hall
        </h2>
        <p class="text-sm text-gray-700">J.P. Rosales Avenue, Butuan City</p>
        <p class="text-sm text-gray-700">Open: Mon–Fri • 8 AM – 5 PM</p>
      </div>

      <!-- How to Get There -->
      <div class="bg-white rounded-xl p-4 ring-1 ring-emerald-100 shadow-sm mt-4">
        <h2 class="font-semibold text-emerald-800 mb-2 text-base">How to Get There</h2>
        <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Ride a multicab – <span class="italic text-emerald-700">J.P. Rosales line</span> → City Hall stop</li>
          <li>Take a tricycle from Gaisano Mall → OSCA office (₱15 fare)</li>
        </ul>
      </div>
    </main>

    <!-- Bottom Tabbar -->
    <nav
      class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70
             border-t border-emerald-100 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)]"
    >
      <ul class="flex items-center justify-around px-6">
        <li>
          <router-link
            to="/senior/notifications"
            class="relative w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"
            aria-label="Notifications"
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
            aria-label="Voice"
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
            aria-label="Home"
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
import { ref } from "vue";

const sidebarOpen = ref(false);
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
* {
  max-width: 100vw;
  box-sizing: border-box;
}
</style>
