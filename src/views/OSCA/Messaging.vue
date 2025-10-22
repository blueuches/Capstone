<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <!-- Sidebar -->
    <Sidebar role="osca" />

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
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

// (connect to Supabase later)
const sidebarOpen = ref(true)
const title = ref('')
const message = ref('')
const targets = ref([])
const fileName = ref('')
const route = useRoute()

// Active nav helper (adds bg + bold + indicator bar)
const navActive = (path) => {
  const isActive = route.path === path
  return isActive
    ? 'bg-emerald-50 text-emerald-900 font-extrabold relative before:content-[\'\'] before:absolute before:-left-1 before:h-6 before:w-1 before:rounded-full before:bg-emerald-500'
    : ''
}

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
