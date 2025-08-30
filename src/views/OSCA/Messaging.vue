<template>
  <div class="bg-gray-50 min-h-screen flex">
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
  <div class="flex-1 md:ml-64 flex flex-col">

    <!-- Header -->
    <header class="w-full bg-white shadow-md fixed top-0 z-40 flex items-center justify-between px-6 py-3">
      <div class="flex items-center gap-2">
        <div class="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">O</div>
        <h1 class="font-bold text-emerald-700 text-lg sm:text-xl">OSCA Messaging</h1>
      </div>
      <router-link to="/osca/dashboard">
        <button class="px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm sm:text-base hover:bg-emerald-700 transition">
          Back to Dashboard
        </button>
      </router-link>
    </header>

    <!-- Messaging Area -->
    <main class="pt-20 pb-10 px-4 sm:px-6 flex flex-col h-screen">
      <div class="flex-1 flex flex-col bg-white shadow-md rounded-xl border overflow-hidden">

        <!-- Chat Header -->
        <div class="p-4 border-b bg-emerald-50 flex items-center justify-between">
          <h3 id="chatTitle" class="font-semibold text-emerald-700">Select a Barangay</h3>
        </div>

        <!-- Messages -->
        <div id="chatBox" class="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
          <p class="text-gray-400 italic">Choose a barangay to start messaging...</p>
        </div>

        <!-- Message Input -->
        <div class="p-3 border-t flex flex-col gap-3">
          <div class="flex gap-2">
            <input id="msgInput" type="text" placeholder="Type a message..."
              class="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600"/>
            <button id="sendBtn" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Send</button>
          </div>
          <!-- Back Button at Bottom -->
          <a href="dashboard.html" class="block text-center">
            <button class="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
              ← Back to Dashboard
            </button>
          </a>
        </div>
      </div>
    </main>
  </div>

  </div>
</template>

<script setup>
// design-only; no functionality
</script>

<style scoped>
/* no extra styles; all Tailwind */
</style>
