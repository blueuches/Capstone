<!-- OSCAAdminDashboard.vue -->
<template>
  <div class="bg-gradient-to-b from-emerald-50 to-white min-h-screen flex">
    <!-- Sidebar -->
    <aside class="w-72 bg-emerald-700 text-white flex flex-col p-6 space-y-6 sticky top-0 h-screen shadow-xl">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
          <span class="text-emerald-700 font-bold text-xl">O</span>
        </div>
        <h1 class="text-2xl font-bold tracking-wide">OSCA Admin</h1>
      </div>

      <!-- Profile -->
      <div class="bg-emerald-600 p-4 rounded-lg flex items-center gap-3 shadow-md">
        <img
          src="https://via.placeholder.com/40"
          alt="Staff"
          class="w-12 h-12 rounded-full border-2 border-white object-cover"
        />
        <div>
          <p class="font-semibold">Admin Staff</p>
          <p class="text-xs text-emerald-200">Logged in</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="space-y-3 font-medium">
        <a href="#dashboard" class="block px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 transition">📊 Dashboard</a>
        <a href="#applications" class="block px-4 py-2 rounded hover:bg-emerald-600 transition">📑 Applications</a>
        <a href="#seniors" class="block px-4 py-2 rounded hover:bg-emerald-600 transition">👵 Seniors</a>
        <a href="#programs" class="block px-4 py-2 rounded hover:bg-emerald-600 transition">🎯 Programs</a>
        <a href="#updates" class="block px-4 py-2 rounded hover:bg-emerald-600 transition">📢 Updates</a>
        <a href="#settings" class="block px-4 py-2 rounded hover:bg-emerald-600 transition">⚙️ Settings</a>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 space-y-10">
      <!-- Topbar -->
      <header class="flex items-center justify-between bg-white shadow rounded-lg p-4 sticky top-0 z-10">
        <input
          type="text"
          placeholder="Search seniors..."
          class="border rounded-lg px-3 py-2 w-52 sm:w-64 focus:ring-2 focus:ring-emerald-500"
        >
        <div class="flex items-center gap-4">
          <button class="relative" aria-label="Notifications">
            🔔
            <span class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">3</span>
          </button>
          <button class="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 shadow">Logout</button>
        </div>
      </header>

      <!-- Dashboard Quick Stats -->
      <section id="dashboard" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <DashboardCard title="Total Applications" value="156" icon="📑" />
        <DashboardCard title="Active Seniors" value="2,340" icon="👵" />
        <DashboardCard title="Barangays Covered" value="42" icon="🏘️" />
        <DashboardCard title="Active Staff" value="12" icon="👨‍💼" />
      </section>

      <!-- Applications Management -->
      <section id="applications" class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-bold text-emerald-700 mb-4">Manage Application Forms</h3>
        <form class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Application Title" class="border p-2 rounded">
          <input type="date" class="border p-2 rounded">
          <textarea placeholder="Application Details" class="border p-2 rounded md:col-span-2"></textarea>
          <div class="md:col-span-2 flex justify-end">
            <button type="button" class="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 shadow">
              Add / Update Application
            </button>
          </div>
        </form>
      </section>

      <!-- Seniors Log -->
      <section id="seniors" class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-bold text-emerald-700 mb-4">Senior Logins</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse min-w-[640px]">
            <thead class="bg-emerald-100 text-emerald-700">
              <tr>
                <th class="px-4 py-2 border">Name</th>
                <th class="px-4 py-2 border">Age</th>
                <th class="px-4 py-2 border">Barangay</th>
                <th class="px-4 py-2 border">Last Login</th>
                <th class="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-2">Junafe Miot Marban</td>
                <td class="px-4 py-2">81</td>
                <td class="px-4 py-2">Barangay 6, De Oro</td>
                <td class="px-4 py-2">Feb 1, 2025</td>
                <td class="px-4 py-2"><span class="bg-green-100 text-green-700 px-2 py-1 rounded">Active</span></td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-2">Pedro Santos</td>
                <td class="px-4 py-2">77</td>
                <td class="px-4 py-2">Barangay 12</td>
                <td class="px-4 py-2">Jan 29, 2025</td>
                <td class="px-4 py-2"><span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Idle</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Programs Management -->
      <section id="programs" class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-bold text-emerald-700 mb-4">Manage Programs</h3>
        <form class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input type="text" placeholder="Program Title" class="border p-2 rounded">
          <input type="date" class="border p-2 rounded">
          <textarea placeholder="Program Details" class="border p-2 rounded md:col-span-2"></textarea>
          <div class="md:col-span-2 flex justify-end">
            <button type="button" class="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 shadow">
              Add / Update Program
            </button>
          </div>
        </form>

        <!-- List of Programs -->
        <div class="space-y-4">
          <div class="p-4 bg-emerald-50 rounded flex justify-between items-center hover:bg-emerald-100">
            <div>
              <p class="font-semibold text-emerald-700">Free Checkup Campaign</p>
              <p class="text-sm text-gray-600">Starts March 2025</p>
            </div>
            <button class="text-emerald-600 hover:underline">Edit</button>
          </div>
          <div class="p-4 bg-emerald-50 rounded flex justify-between items-center hover:bg-emerald-100">
            <div>
              <p class="font-semibold text-emerald-700">Senior Fitness Program</p>
              <p class="text-sm text-gray-600">Ongoing</p>
            </div>
            <button class="text-emerald-600 hover:underline">Edit</button>
          </div>
        </div>
      </section>

      <!-- OSCA Updates Timeline -->
      <section id="updates" class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-bold text-emerald-700 mb-6">OSCA Updates</h3>
        <form class="mb-6">
          <input type="text" placeholder="Update Title" class="border p-2 rounded w-full mb-2">
          <textarea placeholder="Update Details" class="border p-2 rounded w-full mb-2"></textarea>
          <button type="button" class="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 shadow">Post Update</button>
        </form>
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">📢</div>
            <div>
              <p class="font-semibold text-emerald-700">New Program Launched</p>
              <p class="text-sm text-gray-600">Senior Free Checkup campaign begins this March.</p>
              <p class="text-xs text-gray-400">Posted Feb 2, 2025</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Settings -->
      <section id="settings" class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-bold text-emerald-700 mb-2">Settings</h3>
        <p class="text-sm text-gray-600">Coming soon…</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { defineComponent } from "vue"

const DashboardCard = defineComponent({
  props: ["title", "value", "icon"],
  template: `
    <div class="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4 hover:shadow-xl transition">
      <div class="w-14 h-14 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full text-xl">
        {{ icon }}
      </div>
      <div>
        <p class="text-sm text-gray-500">{{ title }}</p>
        <p class="text-2xl font-bold text-emerald-700">{{ value }}</p>
      </div>
    </div>
  `
})
</script>
