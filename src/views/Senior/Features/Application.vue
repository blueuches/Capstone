<template>
  <div class="flex flex-col h-dvh bg-gradient-to-b from-emerald-50 via-white to-emerald-50/40 overflow-hidden">
    <!-- Sticky Header -->
    <header class="flex-none bg-emerald-600 text-white shadow-md z-40">
      <div class="px-4 py-3 flex items-center gap-3">
        <!-- Menu -->
        <button
          aria-label="Menu"
          @click="sidebarOpen = !sidebarOpen"
          class="p-2 rounded-full hover:bg-emerald-700/40"
        >
          <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 class="flex-1 text-lg font-semibold tracking-wide text-center -ml-8">SeniorGo</h1>

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

    <!-- Sidebar Overlay -->
    <transition name="fade">
      <div v-if="sidebarOpen" class="fixed inset-0 z-50 flex">
        <div class="w-56 bg-white text-emerald-800 shadow-xl h-full flex flex-col">
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
    <main class="flex-1 overflow-y-auto px-4 pt-4 pb-[88px]">
      <!-- Breadcrumb -->
      <nav class="text-sm text-emerald-700 mb-4" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <router-link to="/senior/dashboard" class="hover:underline font-medium">Dashboard</router-link>
          </li>
          <li class="text-emerald-500">›</li>
          <li class="font-semibold text-emerald-700">My Applications</li>
        </ol>
      </nav>

      <!-- Applications List -->
      <div class="space-y-4">
        <div
          v-for="(app, i) in applications"
          :key="i"
          class="relative bg-white rounded-2xl shadow-sm hover:shadow-md ring-1 ring-emerald-100 p-4 transition duration-200"
        >
          <!-- Program Header -->
          <div class="flex justify-between items-center mb-1">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <svg
                  v-if="app.status === 'Approved'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <svg
                  v-else-if="app.status === 'Pending'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 class="text-[15px] font-semibold text-emerald-800 leading-tight">
                {{ app.program }}
              </h3>
            </div>

            <span
              :class="statusColor(app.status)"
              class="text-[11px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
            >
              {{ app.status }}
            </span>
          </div>

          <!-- Details -->
          <p class="text-[14px] text-gray-700 mb-1">{{ app.note }}</p>
          <p class="text-[12px] text-gray-500 italic">{{ app.updated_at }}</p>

          <!-- Progress Bar -->
          <div class="mt-3">
            <div class="h-2 bg-emerald-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                :style="{ width: app.progress + '%' }"
              ></div>
            </div>
            <p class="text-right text-[11px] text-gray-500 mt-1">{{ app.progress }}% complete</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Navigation -->
    <nav
      class="flex-none fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-emerald-100 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)]"
      role="navigation"
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
            <span
              v-if="notifCount"
              class="absolute -top-0.5 -right-0.5 text-[10px] leading-none bg-red-500 text-white px-1.5 py-0.5 rounded-full"
              >{{ notifCount }}</span
            >
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
const notifCount = ref(2);

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

const applications = [
  {
    program: "Social Pension Program",
    status: "Pending",
    note: "Waiting for OSCA validation.",
    progress: 40,
    updated_at: "2 days ago",
  },
  {
    program: "Medical Assistance",
    status: "Approved",
    note: "For release next week.",
    progress: 100,
    updated_at: "1 week ago",
  },
  {
    program: "Centenarian Gift",
    status: "Declined",
    note: "Verification incomplete.",
    progress: 20,
    updated_at: "5 days ago",
  },
];

function statusColor(status) {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Declined":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
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

/* Smooth scroll within main content */
main {
  -webkit-overflow-scrolling: touch;
}

/* Prevent extra horizontal scroll */
* {
  max-width: 100vw;
  box-sizing: border-box;
}
</style>
