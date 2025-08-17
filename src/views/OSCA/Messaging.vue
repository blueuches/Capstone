<template>
  <div class="bg-gray-50 min-h-screen flex">
      <!-- Sidebar (Barangay List) -->
  <aside class="hidden md:flex flex-col w-64 bg-white shadow-md fixed top-0 bottom-0 left-0 z-30">
    <div class="p-5 border-b">
      <h2 class="text-xl font-bold text-emerald-700">Barangays</h2>
      <input id="brgySearch" type="text" placeholder="Search barangay..."
        class="mt-3 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-600"/>
    </div>
    <ul id="barangayMenu" class="p-3 space-y-2 overflow-y-auto flex-1">
      <!-- Barangays render here -->
    </ul>
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
