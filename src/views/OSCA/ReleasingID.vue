<!-- SeniorIdRelease.vue -->
<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <!-- Sidebar (kept from your file) -->
    <aside class="w-20 md:w-60 bg-white shadow-lg flex flex-col items-center py-6">
      <h2 class="hidden md:block text-xl font-bold text-emerald-700 mb-8">Menu</h2>
      <nav class="flex flex-col gap-8 w-full items-center md:items-start px-4">
        <router-link to="/osca/dashboard" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9.75L12 3l9 6.75V21a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 21V9.75z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 22V12h6v10" />
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

        <router-link to="/osca/applications" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.983 13.98a2 2 0 100-3.96 2 2 0 000 3.96zM19.4 15a7.963 7.963 0 01-1.572 2.358l1.427 1.427a9.956 9.956 0 002.445-3.785l-2.3-.001zM15 19.4a7.963 7.963 0 01-2.358 1.572l.001 2.3a9.956 9.956 0 003.785-2.445L15 19.4zM8.6 19.4l-1.427 1.427a9.956 9.956 0 003.785 2.445l.001-2.3A7.963 7.963 0 018.6 19.4zM4.6 15l-2.3.001a9.956 9.956 0 002.445 3.785L6.172 17.4A7.963 7.963 0 014.6 15zM4.6 8.6A7.963 7.963 0 013.028 6.242L.583 7.67a9.956 9.956 0 002.445 3.785L4.6 8.6zM8.6 4.6L7.172 3.172A9.956 9.956 0 013.387.727l2.3.001A7.963 7.963 0 018.6 4.6zM15 4.6l1.427-1.427a9.956 9.956 0 00-3.785-2.445l-.001 2.3A7.963 7.963 0 0115 4.6z"/>
          </svg>
          <span class="hidden md:inline">System Updates</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main -->
    <main class="flex-1 pt-24 pb-10 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
      <!-- Filter Section (kept) -->
      <section class="bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 class="text-lg font-semibold text-gray-800">Filter Applications</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Select Barangay</label>
            <select
              class="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-emerald-600"
              v-model="filters.barangay"
            >
              <option value="">-- Choose Barangay --</option>
              <option value="Ampayon">Ampayon</option>
              <option value="De Oro">De Oro</option>
              <option value="Banza">Banza</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search Senior</label>
            <input
              type="text"
              placeholder="Search by name or ID"
              class="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-emerald-600"
              v-model="filters.query"
            />
          </div>
        </div>
      </section>

      <!-- Header + New Application -->
      <section class="flex items-center justify-between">
        <h1 class="text-2xl md:text-3xl font-extrabold text-emerald-700">📋 OSCA Applications</h1>
        <button class="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">+ New Application</button>
      </section>

      <!-- Applications Table (your HTML design, now dynamic) -->
      <section class="bg-white shadow-lg rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse min-w-[720px]">
            <thead class="bg-emerald-100 text-emerald-700">
              <tr>
                <th class="px-4 py-3 text-left">Applicant</th>
                <th class="px-4 py-3 text-left">Age</th>
                <th class="px-4 py-3 text-left">Barangay</th>
                <th class="px-4 py-3 text-left">Date Applied</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr
                v-for="app in filteredApps"
                :key="app.id"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-3 font-semibold text-gray-800">{{ app.name }}</td>
                <td class="px-4 py-3">{{ app.age }}</td>
                <td class="px-4 py-3">{{ app.barangay }}</td>
                <td class="px-4 py-3">{{ app.submitted }}</td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-1 text-xs rounded-full"
                    :class="badgeClass(app.status)"
                  >{{ app.status }}</span>
                </td>
                <td class="px-4 py-3 text-center space-x-2">
                  <button
                    class="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
                    @click="openModal(app)"
                  >
                    View
                  </button>
                  <button
                    class="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                    @click="updateStatus(app, 'Approved')"
                  >
                    Approve
                  </button>
                  <button
                    class="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                    @click="updateStatus(app, 'Declined')"
                  >
                    Decline
                  </button>
                  <button
                    class="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                    @click="followUp(app)"
                  >
                    Follow-Up
                  </button>
                </td>
              </tr>

              <tr v-if="filteredApps.length === 0">
                <td colspan="6" class="px-4 py-6 text-center text-sm text-gray-500">
                  No matching applications.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <!-- Modal (Vue version of your HTML modal) -->
    <div
      v-if="modal.open"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
        <!-- Close -->
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-600 hover:text-red-600">✖</button>

        <h2 class="text-xl font-bold text-emerald-700 mb-4">Application Details</h2>

        <!-- Applicant Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" v-if="modal.app">
          <div>
            <p class="font-semibold text-gray-600">Name:</p>
            <p class="text-gray-800">{{ modal.app.name }}</p>
          </div>
          <div>
            <p class="font-semibold text-gray-600">Age:</p>
            <p>{{ modal.app.age }}</p>
          </div>
          <div>
            <p class="font-semibold text-gray-600">Barangay:</p>
            <p>{{ modal.app.barangay }}</p>
          </div>
          <div>
            <p class="font-semibold text-gray-600">Date Applied:</p>
            <p>{{ modal.app.submitted }}</p>
          </div>
        </div>

        <!-- Requirements (static sample, keep your look) -->
        <h3 class="text-lg font-bold text-emerald-700 mb-2">Documentary Requirements</h3>
        <ul class="list-disc list-inside text-sm text-gray-700 space-y-1 mb-6">
          <li>✅ Whole body picture with white background (A4 size)</li>
          <li>✅ 1pc 2x2 picture with white background</li>
          <li>✅ Birth Certificate (PSA Copy) / National ID</li>
          <li>❌ OSCA ID (Not Submitted)</li>
          <li>
            ✅ RRN (Online registration via
            <a href="https://ncsc.gov.ph" class="text-emerald-600 underline" target="_blank" rel="noopener">ncsc.gov.ph</a>)
          </li>
        </ul>

        <!-- Remarks -->
        <textarea v-model="modal.remarks" placeholder="Remarks..." class="w-full border rounded p-2 mb-4"></textarea>

        <!-- Modal Actions -->
        <div class="flex flex-wrap justify-end gap-2">
          <button @click="closeModal" class="px-4 py-2 border rounded hover:bg-gray-100">Close</button>
          <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" @click="updateStatus(modal.app, 'Approved')">Approve</button>
          <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" @click="updateStatus(modal.app, 'Declined')">Decline</button>
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" @click="followUp(modal.app)">Follow-Up</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

/** DATA (replace with Supabase later) */
const applications = ref([
  { id: '2025-00123', name: 'Juan Dela Cruz',  age: 73, barangay: 'Ampayon', submitted: 'Aug 10, 2025', release: null,          remarks: 'Waiting for validation of submitted requirements.', status: 'Pending'   },
  { id: '2025-00089', name: 'Maria Santos',    age: 69, barangay: 'De Oro',  submitted: 'Aug 03, 2025', release: 'Aug 16, 2025', remarks: 'Please pick up your ID at the Barangay Hall.',      status: 'Approved'  },
  { id: '2025-00077', name: 'Pedro Ramirez',   age: 77, barangay: 'Banza',   submitted: 'Jul 28, 2025', release: 'Aug 14, 2025', remarks: 'Your ID is ready for pickup at OSCA Office.',       status: 'Declined'  },
  { id: '2025-00145', name: 'Junafe Miot Marban', age: 81, barangay: 'De Oro', submitted: 'Feb 01, 2025', release: null,         remarks: 'Octogenarian program applicant.',                   status: 'Pending'   },
])

/** FILTERS */
const filters = ref({ barangay: '', query: '' })

/** FILTERED LIST */
const filteredApps = computed(() => {
  const b = (filters.value.barangay || '').trim()
  const q = (filters.value.query || '').trim().toLowerCase()
  return applications.value.filter(a => {
    const okB = !b || a.barangay === b
    const okQ = !q || a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)
    return okB && okQ
  })
})

/** STATUS STYLES */
function badgeClass(status) {
  return {
    'Pending':  'bg-yellow-100 text-yellow-700',
    'Approved': 'bg-green-100 text-green-700',
    'Declined': 'bg-red-100 text-red-700',
    'For Pickup': 'bg-blue-100 text-blue-700',
  }[status] || 'bg-gray-100 text-gray-700'
}

/** ACTIONS */
function updateStatus(app, newStatus) {
  if (!app) return
  app.status = newStatus
  app.remarks =
    newStatus === 'Approved' ? 'Application approved.' :
    newStatus === 'Declined' ? 'Application declined. Please review documents.' :
    'Follow-up scheduled.'
}

function followUp(app) {
  // connect this to messaging / notifications later
  alert(`Follow-up queued for ${app?.name || 'applicant'}.`)
}

/** MODAL */
const modal = ref({ open: false, app: null, remarks: '' })
function openModal(app) {
  modal.value = { open: true, app, remarks: app?.remarks || '' }
}
function closeModal() {
  // persist remarks back to app
  if (modal.value.app) modal.value.app.remarks = modal.value.remarks
  modal.value.open = false
}

/** ESC to close modal */
function onKey(e) { 
  if (e.key === 'Escape' && modal.value.open) closeModal()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>
