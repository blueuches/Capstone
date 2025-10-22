<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
     <!-- Sidebar -->
    <Sidebar role="osca" />

  <!-- Main Content -->
  <main class="flex-1 p-6 md:ml-60">
    
    <!-- Header -->
    <div class="bg-white rounded-3xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
      <h1 class="text-3xl font-extrabold text-emerald-700">OSCA Dashboard</h1>
      <p class="text-gray-600 mt-2 md:mt-0">Welcome, OSCA Personnel</p>
    </div>

    <!-- Stats Section -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="bg-white rounded-xl shadow p-6 text-center hover:shadow-md transition">
        <h2 class="text-emerald-700 text-2xl font-bold">100</h2>
        <p class="text-gray-600 mt-1">Applications Submitted</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6 text-center hover:shadow-md transition">
        <h2 class="text-emerald-700 text-2xl font-bold">40</h2>
        <p class="text-gray-600 mt-1">Registered by Barangay</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6 text-center hover:shadow-md transition">
        <h2 class="text-emerald-700 text-2xl font-bold">25</h2>
        <p class="text-gray-600 mt-1">Pending Validation</p>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="bg-white rounded-3xl shadow p-6">
      <h2 class="text-2xl font-bold text-emerald-700 mb-6">Events & Updates Timeline</h2>

      <div class="space-y-6 border-l-4 border-emerald-400 pl-6">
        
        <!-- Update 1 -->
        <div>
          <h3 class="font-bold text-lg text-emerald-700">Applications Forwarded</h3>
          <p class="text-gray-700">All submitted applications from your barangay have been forwarded to OSCA for review.</p>
          <p class="text-sm text-gray-500 mt-1">Today • 10:30 AM</p>
        </div>

        <!-- Update 2 -->
        <div>
          <h3 class="font-bold text-lg text-emerald-700">Validation Status</h3>
          <p class="text-gray-700">OSCA has validated 8 out of 12 applications. The rest are pending requirements.</p>
          <p class="text-sm text-gray-500 mt-1">Yesterday • 3:15 PM</p>
        </div>

        <!-- Update 3 -->
        <div>
          <h3 class="font-bold text-lg text-emerald-700">System Maintenance</h3>
          <p class="text-gray-700">The SeniorGo system will undergo scheduled maintenance on March 10 at 9:00 AM.</p>
          <p class="text-sm text-gray-500 mt-1">2 days ago • 8:00 AM</p>
        </div>

      </div>
    </section>

  </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

const sidebarOpen = ref(false)
const route = useRoute()

// Active nav helper (adds bg + bold + indicator bar)
const navActive = (path) => {
  const isActive = route.path === path
  return isActive
    ? 'bg-emerald-50 text-emerald-900 font-extrabold relative before:content-[\'\'] before:absolute before:-left-1 before:h-6 before:w-1 before:rounded-full before:bg-emerald-500'
    : ''
}
</script>
