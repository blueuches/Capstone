<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <!-- Sidebar -->
    <aside class="w-20 md:w-60 bg-white shadow-lg flex flex-col items-center py-6">
      <h2 class="hidden md:block text-xl font-bold text-emerald-700 mb-8">Menu</h2>

      <nav class="flex flex-col gap-8 w-full items-center md:items-start px-4">
        <router-link
          to="/barangay/dashboard"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 9.75L12 3l9 6.75V21a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 21V9.75z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 22V12h6v10"
            />
          </svg>
          <span class="hidden md:inline">Home</span>
        </router-link>
        <!-- Messages -->

        <router-link
          to="/barangay/messaging"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span class="hidden md:inline">Message</span>
        </router-link>

        <!-- Notifications -->

        <router-link
          to="/barangay/notifications"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405C18.21 14.79 18 14.418 18 14V11c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 00-3 0v.68C7.64 5.36 6 7.92 6 11v3c0 .418-.21.79-.595 1.595L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span class="hidden md:inline">Notifications</span>
        </router-link>

        <!-- Applications -->

        <router-link
          to="/barangay/senior-queue"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17h6m-6-4h6m2 9H7a2 2 0 01-2-2V5a2 2 0 012-2h2l1-2h4l1 2h2a2 2 0 012 2v14a2 2 0 01-2 2z"
            />
          </svg>
          <span class="hidden md:inline">Applications</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6">
      <!-- Header -->
      <div
        class="bg-white rounded-3xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between"
      >
        <h1 class="text-3xl font-extrabold text-emerald-700">Barangay Dashboard</h1>
        <p class="text-gray-600 mt-2 md:mt-0">Welcome, Barangay Personnel</p>
      </div>

      <!-- Stats Section -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="bg-white rounded-xl shadow p-6 text-center hover:shadow-md transition">
          <h2 class="text-emerald-700 text-2xl font-bold">120</h2>
          <p class="text-gray-600 mt-1">Applications Submitted</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6 text-center hover:shadow-md transition">
          <h2 class="text-emerald-700 text-2xl font-bold">95</h2>
          <p class="text-gray-600 mt-1">Validated by OSCA</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6 text-center hover:shadow-md transition">
          <h2 class="text-emerald-700 text-2xl font-bold">25</h2>
          <p class="text-gray-600 mt-1">Pending Validation</p>
        </div>
      </section>

      <!-- Timeline Section -->
      <section class="bg-white rounded-3xl shadow p-6">
        <h2 class="text-2xl font-bold text-emerald-700 mb-6">OSCA Updates Timeline</h2>

        <div class="space-y-6 border-l-4 border-emerald-400 pl-6">
          <!-- Update 1 -->
          <div>
            <h3 class="font-bold text-lg text-emerald-700">Applications Forwarded</h3>
            <p class="text-gray-700">
              All submitted applications from your barangay have been forwarded to OSCA for review.
            </p>
            <p class="text-sm text-gray-500 mt-1">Today • 10:30 AM</p>
          </div>

          <!-- Update 2 -->
          <div>
            <h3 class="font-bold text-lg text-emerald-700">Validation Status</h3>
            <p class="text-gray-700">
              OSCA has validated 8 out of 12 applications. The rest are pending requirements.
            </p>
            <p class="text-sm text-gray-500 mt-1">Yesterday • 3:15 PM</p>
          </div>

          <!-- Update 3 -->
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
// No script logic yet; ready for linking to routes or modals.
</script>
