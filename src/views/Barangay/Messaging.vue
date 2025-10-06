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

        <!-- Applications -->
        <router-link
          to="/barangay/senior-queue"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 17h6m-6-4h6m-6-4h6m-7 9h8a2 2 0 002-2V5a2 2 0 00-2-2h-8a2 2 0 00-2 2v14z" />
          </svg>
          <span class="font-bold text-lg">Applications</span>
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
    <section class="flex-1 p-6 md:ml-60">
      <!-- Chat Header -->
      <div class="px-4 py-3 border-b bg-white flex items-center justify-between">
        <h2 class="font-bold text-emerald-700">Post List</h2>
        <span class="text-xs text-gray-500">Program Updates</span>
      </div>

      <!-- Messages -->
      <div id="chatBox" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <!-- Outgoing -->
        <div class="flex items-start justify-end space-x-3">
          <div class="bg-emerald-600 text-white rounded-lg p-3 max-w-xs shadow-sm">
            <p class="text-sm">The following seniors can now apply for their benefits: 
              <br>
              Marry Bersabal
              <br>
              Eden Bughao
            </p>
            <span class="text-xs text-emerald-100 block mt-1 text-right">10:17 AM</span>
          </div>
        </div>

        <!-- Incoming -->
        <div class="flex items-start space-x-3">
          <div class="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">O</div>
          <div class="bg-white border rounded-lg p-3 max-w-xs shadow-sm">
            <p class="text-sm text-gray-700">The list is successfully posted!</p>
            <span class="text-xs text-gray-400 block mt-1">10:15 AM</span>
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
