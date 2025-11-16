<template>
  <div class="senior-font-root bg-gradient-to-b from-emerald-50 via-white to-emerald-50/40 min-h-screen flex flex-col">
    <!-- Header -->
    <SeniorHeader @toggle-sidebar="toggleSidebar" />

  <SeniorSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

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
    <SeniorNav />
  </div>
</template>

<script setup>
import { ref } from "vue";
import SeniorNav from '@/components/SeniorNav.vue'
import SeniorSidebar from '@/components/SeniorSidebar.vue'
import SeniorHeader from '@/components/SeniorHeader.vue'


const sidebarOpen = ref(false);
function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }
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
