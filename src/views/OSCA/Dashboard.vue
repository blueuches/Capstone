<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
     <!-- Sidebar -->
  <aside 
  :class="[
    'fixed inset-y-0 left-0 bg-white shadow-lg flex flex-col justify-between py-6 z-50 transform transition-transform duration-300',
    sidebarOpen ? 'translate-x-0 w-60' : '-translate-x-full w-60',
    'md:relative md:translate-x-0 md:w-60'
  ]"
  >

  <div>
    <h4 class="font-bold text-emerald-700 mb-8 px-4">SeniorGo</h4> 

      <nav class="flex flex-col gap-6 w-full items-start px-4">
        <!-- Dashboard -->
        <router-link
          to="/osca/dashboard"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >

      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.625 2.75a3.875 3.875 0 1 0 0 7.75a3.875 3.875 0 0 0 0-7.75m10.75 0a3.875 3.875 0 1 0 0 7.75a3.875 3.875 0 0 0 0-7.75M6.625 13.5a3.875 3.875 0 1 0 0 7.75a3.875 3.875 0 0 0 0-7.75m10.75 0a3.875 3.875 0 1 0 0 7.75a3.875 3.875 0 0 0 0-7.75"/></svg>
          <span class="font-bold text-lg">Dashboard</span>
        </router-link>

        <!-- View barangays and in each barangays the list of seniors (non member, approved, pending) -->
        <router-link
          to="/osca/barangays"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fill="currentColor" d="M0 0h4v4H0zm6 1h10v2H6zM0 6h4v4H0zm6 1h10v2H6zm-6 5h4v4H0zm6 1h10v2H6z"/></svg>
          <span class="font-bold text-lg">View Lists</span>
        </router-link>

        <!-- Review Seniors and their information -->
        <router-link
          to="/osca/review"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <!-- Identification card -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fill="currentColor" fill-rule="evenodd" d="M4 4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm10 5c0-.6.4-1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1m0 3c0-.6.4-1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1m0 3c0-.6.4-1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1m-8-5a3 3 0 1 1 6 0a3 3 0 0 1-6 0m2 4a3 3 0 0 0-3 2v.2c0 .1-.1.2 0 .2v.2c.3.2.6.4.9.4h6c.3 0 .6-.2.8-.4l.2-.2v-.2l-.1-.1A3 3 0 0 0 10 14H7.9Z" clip-rule="evenodd"/></svg>
          <span class="font-bold text-lg">Review Seniors</span>
        </router-link>

          <!-- Applications that are pending or in process in each program-->
        <router-link
          to="/osca/applications"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 9h6M9 13h4m-8 4h12" />
          </svg>
          <span class="font-bold text-lg">Applicants</span>
        </router-link>

        <!-- Post an announcement to barangays' web and seniors' side mobile -->
        <router-link
          to="/osca/messaging"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fill="currentColor" fill-rule="evenodd" d="M7.933.767a.75.75 0 0 0-1.5 0v.754a.75.75 0 0 0 1.5 0zM6.595 2.928a.75.75 0 0 1 1.024.275l3.858 6.681a.75.75 0 0 1-1.299.75l-.055-.096l-3.092.718a2.171 2.171 0 0 1-3.97 1.664l-.002-.003l-.376-.651l-1.454.337a.5.5 0 0 1-.546-.237l-.609-1.055a.5.5 0 0 1 .068-.591l6.235-6.67l-.057-.097a.75.75 0 0 1 .275-1.025M4.21 11.911l1.357-.315a.671.671 0 0 1-1.21.57zm9.78-5.088a.75.75 0 0 1-.75.75h-.754a.75.75 0 0 1 0-1.5h.753a.75.75 0 0 1 .75.75Zm-12.108.75a.75.75 0 1 0 0-1.5h-.754a.75.75 0 1 0 0 1.5zm2.182-3.868a.75.75 0 0 1-1.06 0l-.634-.634a.75.75 0 1 1 1.06-1.06l.635.633a.75.75 0 0 1 0 1.061Zm7.932-.634a.75.75 0 0 0-1.06-1.06l-.642.64a.75.75 0 1 0 1.061 1.061z" clip-rule="evenodd"/></svg>
          <span class="font-bold text-lg">Post</span>
        </router-link>

        <!-- Logout -->
        <router-link
          to="/logout"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <!-- Logout arrow -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
          <span class="font-bold text-lg">Logout</span>
        </router-link>
      </nav>

      </div>

  <div class="px-4 text-xs text-gray-500 text-center leading-snug">
    © 2025 <span class="font-semibold text-emerald-700">SeniorGo</span><br/>
    Made for Butuan Seniors<br/>
    Powered by Barangay &amp; OSCA
  </div>

  </aside>

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
// No script logic yet; ready for linking to routes or modals.
</script>
