<template>
  <div class="h-screen bg-gray-50 flex flex-col">
      <!-- Header / Topbar -->
  <header class="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between shadow-md">
    <div class="flex items-center gap-3">
      <!-- Dashboard Icon -->
      <router-link to="/barangay/dashboard" class="flex items-center gap-2 hover:text-emerald-200">
        <!-- Home icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v11a1 1 0 01-1 1h-3m-4 0h4"/>
        </svg>
        <span class="font-bold">Dashboard</span>
      </router-link>

      <h1 class="text-lg sm:text-xl font-bold">Messaging</h1>
    </div>
    <button id="menuBtn" class="sm:hidden px-3 py-2 bg-white/20 rounded-lg">☰</button>
  </header>

  <!-- Main Content -->
  <main class="flex flex-1 overflow-hidden">
    
    <!-- Conversation List (left) -->
    <aside id="sidebar" class="hidden sm:flex flex-col w-72 border-r bg-white">
      <div class="p-4 border-b">
        <input type="text" placeholder="Search…" 
          class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
      </div>
      <div class="flex-1 overflow-y-auto">
        <!-- Example conversations -->
        <button class="w-full text-left px-4 py-3 hover:bg-emerald-50 border-b flex items-center gap-2">
          <span class="text-sm px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">📢</span>
          <div>
            <div class="font-semibold text-emerald-700">OSCA Announcements</div>
            <div class="text-xs text-gray-500">New Program Launch...</div>
          </div>
        </button>
        <button class="w-full text-left px-4 py-3 hover:bg-emerald-50 border-b">
          <div class="font-semibold text-emerald-700">Barangay Libertad</div>
          <div class="text-xs text-gray-500">Inquiry about IDs...</div>
        </button>
        <button class="w-full text-left px-4 py-3 hover:bg-emerald-50 border-b">
          <div class="font-semibold text-emerald-700">Barangay Ampayon</div>
          <div class="text-xs text-gray-500">Clarification on benefits...</div>
        </button>
      </div>
    </aside>

    <!-- Chat Area (right) -->
    <section class="flex-1 flex flex-col">
      <!-- Chat Header -->
      <div class="px-4 py-3 border-b bg-white flex items-center justify-between">
        <h2 class="font-bold text-emerald-700">OSCA Announcements</h2>
        <span class="text-xs text-gray-500">Program Updates</span>
      </div>

      <!-- Messages -->
      <div id="chatBox" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <!-- Incoming -->
        <div class="flex items-start space-x-3">
          <div class="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">O</div>
          <div class="bg-white border rounded-lg p-3 max-w-xs shadow-sm">
            <p class="text-sm text-gray-700">📢 New medical check-up schedule for all seniors on Sept 10 at OSCA Center.</p>
            <span class="text-xs text-gray-400 block mt-1">10:15 AM</span>
          </div>
        </div>

        <!-- Outgoing -->
        <div class="flex items-start justify-end space-x-3">
          <div class="bg-emerald-600 text-white rounded-lg p-3 max-w-xs shadow-sm">
            <p class="text-sm">Thank you for the update. Will coordinate with barangay personnel.</p>
            <span class="text-xs text-emerald-100 block mt-1 text-right">10:17 AM</span>
          </div>
        </div>
      </div>

      <!-- Input Box -->
      <div class="border-t bg-white p-3 flex items-center gap-2">
        <input id="messageInput" type="text" placeholder="Type a message…" 
          class="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
        <button id="sendBtn" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold">
          Send
        </button>
      </div>
    </section>
  </main>
  </div>
</template>

<script setup>
// design-only; no functionality
</script>

<style scoped>
/* no extra styles; all Tailwind */
</style>
