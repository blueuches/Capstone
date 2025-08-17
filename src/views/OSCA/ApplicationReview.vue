<!-- OscaReview.vue -->
<template>
  <div class="bg-gray-50 min-h-screen flex">
    <!-- Sidebar -->
    <aside class="hidden md:flex flex-col w-64 bg-white shadow-md fixed top-0 bottom-0 left-0 z-30">
      <div class="p-5 border-b">
        <h2 class="text-xl font-bold text-emerald-700">Barangays</h2>
        <input
          id="brgySearch"
          type="text"
          placeholder="Search barangay..."
          v-model="barangayQuery"
          class="mt-3 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-600"
        />
      </div>
      <ul id="barangayMenu" class="p-3 space-y-2 overflow-y-auto flex-1">
        <li v-for="brgy in filteredBarangays" :key="brgy">
          <button
            class="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50"
            @click="selectBarangay(brgy)"
          >
            {{ brgy }}
          </button>
        </li>
        <li v-if="filteredBarangays.length === 0" class="text-sm text-gray-500 px-3">
          No results…
        </li>
      </ul>
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
