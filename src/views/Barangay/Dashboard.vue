<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 bg-white shadow-lg flex flex-col py-6 z-50 transform transition-transform duration-300',
        sidebarOpen ? 'translate-x-0 w-60' : '-translate-x-full w-60',
        'md:relative md:translate-x-0 md:w-60'
      ]"
    >
      <h4 class="font-bold text-emerald-700 mb-8 px-4">SeniorGo</h4>

      <nav class="flex flex-col gap-6 w-full items-start px-4">
        <!-- Home -->
        <router-link
          to="/barangay/dashboard"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 9.75L12 3l9 6.75V21a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 21V9.75z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 22V12h6v10" />
          </svg>
          <span class="font-bold text-lg">Home</span>
        </router-link>

        <!-- Applications -->
        <router-link
          to="/barangay/senior-queue"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 17h6m-6-4h6m-6-4h6m-7 9h8a2 2 0 002-2V5a2 2 0 00-2-2h-8a2 2 0 00-2 2v14z" />
          </svg>
          <span class="font-bold text-lg">View</span>
        </router-link>

        <!-- Messaging -->
        <router-link
          to="/barangay/messaging"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.83L3 20l1.29-2.58A7.79 7.79 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span class="font-bold text-lg">Post</span>
        </router-link>

        <!-- Notifications -->
        <router-link
          to="/barangay/notifications"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 17h5l-1.405-1.405C18.21 14.79 18 14.418 18 14V11a6 6 0 00-12 0v3c0 .418-.21.79-.595 1.595L4 17h5m6 0v1a3 3 0 11-6 0v-1" />
          </svg>
          <span class="font-bold text-lg">Notifications</span>
        </router-link>

        <!-- Logout -->
        <router-link
          to="/logout"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          <span class="font-bold text-lg">Logout</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 md:ml-60">
      <!-- Topbar with Hamburger on mobile -->
      <div class="flex items-center justify-between mb-6">
        <button @click="sidebarOpen = !sidebarOpen" class="md:hidden text-emerald-700 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 class="text-2xl font-extrabold text-emerald-700">Barangay [Ampayon]</h1>
      </div>

      <!-- Welcome -->
      <div
        class="bg-white rounded-3xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
        <p class="text-gray-600">Welcome, Barangay Personnel</p>
      </div>

      <!-- Stats Section -->
      <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <div class="bg-white rounded-xl shadow p-6 text-center hover:shadow-md transition">
          <h2 class="text-emerald-700 text-2xl font-bold">[120]</h2>
          <p class="text-gray-600 mt-1">Total Seniors</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6 text-center hover:shadow-md transition">
          <h2 class="text-emerald-700 text-2xl font-bold">[95]</h2>
          <p class="text-gray-600 mt-1">Validated by OSCA</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6 text-center hover:shadow-md transition">
          <h2 class="text-emerald-700 text-2xl font-bold">25</h2>
          <p class="text-gray-600 mt-1">Current Applications</p>
        </div>
      </section>

      <!-- Timeline Section -->
      <section class="bg-white rounded-3xl shadow p-6">
        <h2 class="text-2xl font-bold text-emerald-700 mb-6">Events and Announcements</h2>
        <div class="space-y-6 border-l-4 border-emerald-400 pl-6">
          <div>
            <h3 class="font-bold text-lg text-emerald-700">Applications Forwarded</h3>
            <p class="text-gray-700">
              All submitted applications from your barangay have been forwarded to OSCA for review.
            </p>
            <p class="text-sm text-gray-500 mt-1">Today • 10:30 AM</p>
          </div>
          <div>
            <h3 class="font-bold text-lg text-emerald-700">Validation Status</h3>
            <p class="text-gray-700">
              OSCA has validated 8 out of 12 applications. The rest are pending requirements.
            </p>
            <p class="text-sm text-gray-500 mt-1">Yesterday • 3:15 PM</p>
          </div>
          <div>
            <h3 class="font-bold text-lg text-emerald-700">System Maintenance</h3>
            <p class="text-gray-700">
              The SeniorGo system will undergo scheduled maintenance on March 10 at 9:00 AM.
            </p>
            <p class="text-sm text-gray-500 mt-1">2 days ago • 8:00 AM</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
const sidebarOpen = ref(false);
</script>
