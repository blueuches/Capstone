<!-- OscaReview.vue -->
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
    <div class="flex-1 md:ml-64 flex flex-col">
      <!-- Header -->
      <header class="w-full bg-white shadow-md fixed top-0 z-40 flex items-center justify-between px-6 py-3">
        <div class="flex items-center gap-2">
          <div class="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">O</div>
          <h1 class="font-bold text-emerald-700 text-lg sm:text-xl">OSCA Review</h1>
        </div>
        <button
          class="px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm sm:text-base hover:bg-emerald-700 transition"
          @click="goBack"
        >
          Back to Dashboard
        </button>
      </header>

      <!-- Page Content -->
      <main class="pt-20 pb-10 px-4 sm:px-6 flex flex-col lg:flex-row gap-6">
        <!-- Applicants Panel -->
        <section class="lg:w-1/2 bg-white shadow-md border rounded-xl p-5 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-emerald-700">Applicants</h3>
            <input
              type="text"
              id="searchInput"
              placeholder="Search senior..."
              v-model="applicantQuery"
              class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <ul id="applicantList" class="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            <li v-if="!currentBarangay" class="text-gray-500 italic">
              Choose a Barangay to load applicants...
            </li>

            <li
              v-for="a in filteredApplicants"
              :key="a.email + a.name"
              class="p-3 border rounded-lg cursor-pointer hover:bg-emerald-50 flex justify-between items-center"
              @click="showDetails(a)"
            >
              <div>
                <span class="font-semibold">{{ a.name }}</span> — {{ a.age }} yrs
              </div>
              <span
                class="px-2 py-1 text-xs rounded-full"
                :class="statusPill(a.status)"
              >
                {{ a.status }}
              </span>
            </li>

            <li v-if="currentBarangay && filteredApplicants.length === 0" class="text-gray-500 italic">
              No applicants found...
            </li>
          </ul>
        </section>

        <!-- Applicant Details -->
        <section
          id="detailsSection"
          class="lg:w-1/2 bg-white shadow-md border rounded-xl p-5 space-y-4"
          v-show="selectedApplicant"
        >
          <h3 class="text-lg font-semibold text-emerald-700">Applicant Details</h3>

          <!-- Profile -->
          <div class="bg-emerald-50 p-4 rounded-lg space-y-1">
            <p><span class="font-semibold">Name:</span> <span id="seniorName">{{ selectedApplicant?.name }}</span></p>
            <p><span class="font-semibold">Age:</span> <span id="seniorAge">{{ selectedApplicant?.age }}</span></p>
            <p><span class="font-semibold">Sex:</span> <span id="seniorSex">{{ selectedApplicant?.sex }}</span></p>
            <p><span class="font-semibold">Barangay:</span> <span id="seniorBarangay">{{ selectedApplicant?.barangay }}</span></p>
            <p><span class="font-semibold">Contact:</span> <span id="seniorContact">{{ selectedApplicant?.contact }}</span></p>
            <p><span class="font-semibold">Email:</span> <span id="seniorEmail">{{ selectedApplicant?.email }}</span></p>
          </div>

          <!-- Requirements -->
          <div>
            <h4 class="font-semibold text-emerald-700 mb-2">Submitted Requirements</h4>
            <ul id="reqList" class="list-disc pl-6 text-gray-700 space-y-1">
              <li v-for="(r, i) in selectedApplicant?.requirements || []" :key="i">
                <a href="#" class="text-emerald-600 hover:underline">{{ r }}</a>
              </li>
              <li v-if="!selectedApplicant || selectedApplicant.requirements.length === 0" class="text-sm text-gray-500">
                None uploaded
              </li>
            </ul>
          </div>

          <!-- Message -->
          <div>
            <h4 class="font-semibold text-emerald-700 mb-2">Message Applicant</h4>
            <textarea
              id="msgBox"
              rows="3"
              placeholder="Write a message..."
              v-model="message"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            ></textarea>
            <button class="mt-2 px-5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700" @click="sendMessage">
              Send
            </button>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row justify-end gap-3">
            <button class="px-5 py-2 flex items-center gap-2 border bg-white hover:bg-gray-100 rounded-lg" @click="setStatus('Rejected')">
              ❌ Reject
            </button>
            <button class="px-6 py-2 flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg" @click="setStatus('Approved')">
              ✅ Approve
            </button>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/** DATA (replace with API later) */
const barangays = ref(['Ampayon', 'De Oro', 'Banza', 'Dagohoy', 'Libertad'])
const data = ref({
  Ampayon: [
    { name: 'Juan Dela Cruz', age: 82, sex: 'Male',   barangay: 'Ampayon', contact: '09123456789', email: 'juan@email.com',  status: 'Pending',  requirements: ['Senior ID.pdf', 'Proof of Residency.jpg'] },
    { name: 'Maria Santos',   age: 78, sex: 'Female', barangay: 'Ampayon', contact: '0999888777',  email: 'maria@email.com', status: 'Approved', requirements: ['Senior ID.pdf', 'Proof of Residency.pdf'] },
  ],
  'De Oro': [
    { name: 'Pedro Reyes',    age: 85, sex: 'Male',   barangay: 'De Oro',  contact: '0911222333',  email: 'pedro@email.com', status: 'Pending',  requirements: ['ID.pdf', 'Residency.pdf'] },
  ],
  Banza: [
    { name: 'Ana Lopez',      age: 80, sex: 'Female', barangay: 'Banza',   contact: '0913555444',  email: 'ana@email.com',   status: 'Rejected', requirements: ['Senior ID.pdf'] },
  ],
})

/** UI state */
const barangayQuery = ref('')
const applicantQuery = ref('')
const currentBarangay = ref('')
const currentApplicants = ref([])
const selectedApplicant = ref(null)
const message = ref('')

/** Computed filters */
const filteredBarangays = computed(() => {
  const q = barangayQuery.value.trim().toLowerCase()
  if (!q) return barangays.value
  return barangays.value.filter(b => b.toLowerCase().includes(q))
})

const filteredApplicants = computed(() => {
  if (!currentBarangay.value) return []
  const q = applicantQuery.value.trim().toLowerCase()
  const list = currentApplicants.value || []
  if (!q) return list
  return list.filter(a => a.name.toLowerCase().includes(q))
})

/** Methods */
function selectBarangay(brgy) {
  currentBarangay.value = brgy
  currentApplicants.value = (data.value[brgy] || []).slice()
  selectedApplicant.value = null
  applicantQuery.value = ''
}

function showDetails(a) {
  selectedApplicant.value = a
}

function statusPill(status) {
  return status === 'Approved'
    ? 'bg-green-100 text-green-700'
    : status === 'Rejected'
    ? 'bg-red-100 text-red-700'
    : 'bg-yellow-100 text-yellow-700'
}

function setStatus(status) {
  if (!selectedApplicant.value) return
  selectedApplicant.value.status = status
}

function sendMessage() {
  if (!selectedApplicant.value) return
  if (!message.value.trim()) return alert('Please type a message.')
  // plug in messaging API here
  alert(`Message sent to ${selectedApplicant.value.name}.`)
  message.value = ''
}

function goBack() {
  // If using vue-router, replace with: router.push('/dashboard')
  window.history.back()
}
</script>
