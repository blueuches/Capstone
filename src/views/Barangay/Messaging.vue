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
