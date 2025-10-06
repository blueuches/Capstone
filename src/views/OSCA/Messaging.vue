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
          <router-link to="/osca/dashboard" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.625 2.75a3.875 3.875 0 1 0 0 7.75a3.875 3.875 0 0 0 0-7.75m10.75 0a3.875 3.875 0 1 0 0 7.75a3.875 3.875 0 0 0 0-7.75M6.625 13.5a3.875 3.875 0 1 0 0 7.75a3.875 3.875 0 0 0 0-7.75m10.75 0a3.875 3.875 0 1 0 0 7.75a3.875 3.875 0 0 0 0-7.75"/></svg>
            <span class="font-bold text-lg">Dashboard</span>
          </router-link>

          <router-link to="/osca/barangays" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fill="currentColor" d="M0 0h4v4H0zm6 1h10v2H6zM0 6h4v4H0zm6 1h10v2H6zm-6 5h4v4H0zm6 1h10v2H6z"/></svg>
            <span class="font-bold text-lg">View Lists</span>
          </router-link>

          <router-link to="/osca/review" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fill="currentColor" fill-rule="evenodd" d="M4 4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm10 5c0-.6.4-1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1m0 3c0-.6.4-1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1m0 3c0-.6.4-1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1m-8-5a3 3 0 1 1 6 0a3 3 0 0 1-6 0m2 4a3 3 0 0 0-3 2v.2c0 .1-.1.2 0 .2v.2c.3.2.6.4.9.4h6c.3 0 .6-.2.8-.4l.2-.2v-.2l-.1-.1A3 3 0 0 0 10 14H7.9Z" clip-rule="evenodd"/></svg>
            <span class="font-bold text-lg">Review Seniors</span>
          </router-link>

          <router-link to="/osca/applications" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9h6M9 13h4m-8 4h12"/></svg>
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

    <!-- MAIN AREA -->
    <main class="flex-1 p-6 md:ml-60">
      <div class="max-w-3xl mx-auto bg-white border rounded-2xl shadow-md p-6">
        <h1 class="text-2xl font-extrabold text-emerald-700 mb-2"> Post an Announcement</h1>
        <p class="text-gray-600 mb-6">
          Send important updates or notices directly to all Barangay Personnel and Senior Citizens. 
          Your message will appear in their dashboards and mobile app.
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
            <label class="block font-semibold text-sm text-gray-700 mb-1">Audience</label>
            <div class="flex flex-wrap gap-3">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="targets" value="barangay" class="accent-emerald-600" />
                Barangay Personnel
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
            <input type="file" @change="handleFileUpload" class="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none" />
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
            <button type="submit" @click.prevent="sendAnnouncement" class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Post Announcement</button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// (connect to Supabase later)
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

  // later connect this to Supabase "Announcements" insert
  alert(`Announcement posted:\n"${title.value}"\nTo: ${targets.value.join(', ')}`)
  clearForm()
}
</script>
