<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
     <!-- Sidebar -->
  <aside class="w-20 md:w-60 bg-white shadow-lg flex flex-col items-center py-6">
    <h2 class="hidden md:block text-xl font-bold text-emerald-700 mb-8">Menu</h2>

    <nav class="flex flex-col gap-8 w-full items-center md:items-start px-4">
      <!-- Messages -->

        <router-link to="/osca/dashboard" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M3 9.75L12 3l9 6.75V21a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 21V9.75z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M9 22V12h6v10" />
          </svg>
          <span class="hidden md:inline">Home</span>
        </router-link>

        <router-link to="/osca/messaging" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
            <span class="hidden md:inline">Message</span>
        </router-link>

        <router-link to="/osca/release-id" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17h6m-6-4h6m2 9H7a2 2 0 01-2-2V5a2 2 0 012-2h2l1-2h4l1 2h2a2 2 0 012 2v14a2 2 0 01-2 2z"/>
          </svg>
            <span class="hidden md:inline">Applications</span>
        </router-link>

      <!-- System Updates -->
      <router-link to="/osca/applications" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.983 13.98a2 2 0 100-3.96 2 2 0 000 3.96zM19.4 15a7.963 7.963 0 01-1.572 2.358l1.427 1.427a9.956 9.956 0 002.445-3.785l-2.3-.001zM15 19.4a7.963 7.963 0 01-2.358 1.572l.001 2.3a9.956 9.956 0 003.785-2.445L15 19.4zM8.6 19.4l-1.427 1.427a9.956 9.956 0 003.785 2.445l.001-2.3A7.963 7.963 0 018.6 19.4zM4.6 15l-2.3.001a9.956 9.956 0 002.445 3.785L6.172 17.4A7.963 7.963 0 014.6 15zM4.6 8.6A7.963 7.963 0 013.028 6.242L.583 7.67a9.956 9.956 0 002.445 3.785L4.6 8.6zM8.6 4.6L7.172 3.172A9.956 9.956 0 013.387.727l2.3.001A7.963 7.963 0 018.6 4.6zM15 4.6l1.427-1.427a9.956 9.956 0 00-3.785-2.445l-.001 2.3A7.963 7.963 0 0115 4.6z"/>
        </svg>
        <span class="hidden md:inline">System Updates</span>
      </router-link>
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 p-6">
    
    <!-- Header -->
    <div class="bg-white rounded-3xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
      <h1 class="text-3xl font-extrabold text-emerald-700">OSCA Dashboard</h1>
      <p class="text-gray-600 mt-2 md:mt-0">Welcome, OSCA Personnel</p>
    </div>

    <!-- Stats Section -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="bg-white rounded-xl shadow p-6 text-center hover:shadow-md transition">
        <h2 class="text-emerald-700 text-2xl font-bold">120</h2>
        <p class="text-gray-600 mt-1">Applications Submitted</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6 text-center hover:shadow-md transition">
        <h2 class="text-emerald-700 text-2xl font-bold">95</h2>
        <p class="text-gray-600 mt-1">Registered by Barangay</p>
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
// No script logic yet; ready for linking to routes or modals.
</script>
