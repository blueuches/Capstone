<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
<aside
  class="fixed inset-y-0 left-0 bg-white/95 backdrop-blur shadow-lg flex flex-col justify-between py-6 z-50 transform transition-transform duration-300 w-64 md:relative md:translate-x-0 md:w-64"
  :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
>
  <div>
    <!-- Logo / Header -->
    <div class="px-4 flex items-center gap-2 mb-6">
      <h4 class="font-extrabold tracking-tight text-emerald-700">SeniorGo</h4>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-2 w-full items-start px-2" id="nav">

      <!-- Dashboard -->
      <RouterLink
        to="/barangay/dashboard"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/barangay/dashboard')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Home Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-6v-6H10v6H4a1 1 0 0 1-1-1V9.5z" />
          </svg>
        </span>
        <span class="font-bold text-base">Dashboard</span>
      </RouterLink>

      <!-- View Seniors -->
      <RouterLink
        to="/barangay/senior-queue"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/barangay/senior-queue')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- People Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3s1.34 3 3 3zM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5S5 6.34 5 8s1.34 3 3 3zm8 2c-1.5 0-4.5.75-4.5 2.25V18h9v-2.75C20.5 13.75 17.5 13 16 13zM8 13c-1.5 0-4.5.75-4.5 2.25V18h9v-2.75C12.5 13.75 9.5 13 8 13z"/>
          </svg>
        </span>
        <span class="font-bold text-base">View Seniors</span>
      </RouterLink>

      <!-- Post Announcement -->
      <RouterLink
        to="/barangay/messaging"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/barangay/messaging')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Megaphone Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 14V6h2v8H2zm4 2V4l12 5v2l-12 5zm14-3a1 1 0 1 1 0-2a1 1 0 0 1 0 2z" />
          </svg>
        </span>
        <span class="font-bold text-base">Post Announcement</span>
      </RouterLink>

      <!-- Notifications -->
      <RouterLink
        to="/barangay/notifications"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/barangay/notifications')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Bell Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22a2 2 0 0 0 1.985-1.75H10.015A2 2 0 0 0 12 22zm6-6v-5a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </span>
        <span class="font-bold text-base">Notifications</span>
      </RouterLink>

      <!-- Logout -->
      <RouterLink
        to="/logout"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/logout')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Logout Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 13v-2H7V8l-5 4l5 4v-3h9zM20 3H10a1 1 0 0 0-1 1v4h2V5h8v14h-8v-3H9v4a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z" />
          </svg>
        </span>
        <span class="font-bold text-base">Logout</span>
      </RouterLink>
    </nav>
  </div>

  <!-- Footer -->
  <div class="px-4 text-xs text-gray-500 text-center leading-snug">
    © 2025 <span class="font-semibold text-emerald-700">SeniorGo</span><br />
    Made for Butuan Seniors<br />
    Powered by Barangay &amp; OSCA
  </div>
</aside>


    <!-- MAIN AREA -->
    <main class="flex-1 p-6 md:ml-60">
      <div class="max-w-3xl mx-auto bg-white border rounded-2xl shadow-md p-6">
        <h1 class="text-2xl font-extrabold text-emerald-700 mb-2"> Post an Announcement to OSCA or Seniors</h1>
        <p class="text-gray-600 mb-6">
          Barangay staff can send official notices or updates directly to the OSCA Office or senior citizens registered in your barangay.
        </p>

        <!-- Announcement Form -->
        <form class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block font-semibold text-sm text-gray-700 mb-1">Title</label>
            <input
              v-model="title"
              type="text"
              placeholder="Enter announcement title"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <!-- Audience -->
          <div>
            <label class="block font-semibold text-sm text-gray-700 mb-1">Recipient</label>
            <div class="flex flex-wrap gap-3">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="targets" value="osca" class="accent-emerald-600" />
                OSCA Office
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="targets" value="seniors" class="accent-emerald-600" />
                Senior Citizens
              </label>
            </div>
          </div>

          <!-- Message -->
          <div>
            <label class="block font-semibold text-sm text-gray-700 mb-1">Message Content</label>
            <textarea
              v-model="message"
              rows="5"
              placeholder="Write your announcement..."
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none resize-none"
            ></textarea>
          </div>

          <!-- Attachment -->
          <div>
            <label class="block font-semibold text-sm text-gray-700 mb-1">Attachment (optional)</label>
            <input
              type="file"
              @change="handleFileUpload"
              class="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            />
            <p v-if="fileName" class="text-sm text-gray-600 mt-1">Attached: {{ fileName }}</p>
          </div>

          <!-- Preview -->
          <div v-if="title || message" class="bg-emerald-50 border border-emerald-100 p-4 rounded-lg mt-6">
            <h3 class="font-semibold text-emerald-700">Preview:</h3>
            <p class="mt-2 text-lg font-bold text-gray-800">{{ title }}</p>
            <p class="mt-1 text-gray-700 whitespace-pre-line">{{ message }}</p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="clearForm" class="px-5 py-2 border rounded-lg hover:bg-gray-100">Clear</button>
            <button type="submit" @click.prevent="sendAnnouncement" class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Send Announcement</button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'   // ✅ Added this line

const sidebarOpen = ref(true)
const title = ref('')
const message = ref('')
const targets = ref([])
const fileName = ref('')

function handleFileUpload(e) {
  const file = e.target.files[0]
  if (file) fileName.value = file.name
}

function clearForm() {
  title.value = ''
  message.value = ''
  targets.value = []
  fileName.value = ''
}

function sendAnnouncement() {
  if (!title.value || !message.value || targets.value.length === 0) {
    alert('Please complete all required fields.')
    return
  }
  alert(`📢 Barangay announcement sent:\n"${title.value}"\nTo: ${targets.value.join(', ')}`)
  clearForm()
}

const route = useRoute()

// Active nav helper
const navActive = (path) => {
  const isActive = route.path === path
  return isActive
    ? 'bg-emerald-50 text-emerald-900 font-extrabold relative before:content-[\'\'] before:absolute before:-left-1 before:h-6 before:w-1 before:rounded-full before:bg-emerald-500'
    : ''
}
</script>


<style scoped>
@keyframes pop-in {
  0% { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.animate-pop {
  animation: pop-in .2s ease-out both;
}
</style>
