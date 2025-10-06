<!-- SeniorIdRelease.vue -->
<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
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
        <!-- Dashboard -->
        <router-link
          to="/osca/dashboard"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >

      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.625 2.75a3.875 3.875 0 1 0 0 7.75a3.875 3.875 0 0 0 0-7.75m10.75 0a3.875 3.875 0 1 0 0 7.75a3.875 3.875 0 0 0 0-7.75M6.625 13.5a3.875 3.875 0 1 0 0 7.75a3.875 3.875 0 0 0 0-7.75m10.75 0a3.875 3.875 0 1 0 0 7.75a3.875 3.875 0 0 0 0-7.75"/></svg>
          <span class="font-bold text-lg">Dashboard</span>
        </router-link>

        <!-- View barangays and in each barangays the list of seniors (non member, approved, pending) -->
        <router-link
          to="/osca/barangays"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fill="currentColor" d="M0 0h4v4H0zm6 1h10v2H6zM0 6h4v4H0zm6 1h10v2H6zm-6 5h4v4H0zm6 1h10v2H6z"/></svg>
          <span class="font-bold text-lg">View Lists</span>
        </router-link>

        <!-- Review Seniors and their information -->
        <router-link
          to="/osca/release-id"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <!-- Identification card -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fill="currentColor" fill-rule="evenodd" d="M4 4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm10 5c0-.6.4-1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1m0 3c0-.6.4-1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1m0 3c0-.6.4-1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1m-8-5a3 3 0 1 1 6 0a3 3 0 0 1-6 0m2 4a3 3 0 0 0-3 2v.2c0 .1-.1.2 0 .2v.2c.3.2.6.4.9.4h6c.3 0 .6-.2.8-.4l.2-.2v-.2l-.1-.1A3 3 0 0 0 10 14H7.9Z" clip-rule="evenodd"/></svg>
          <span class="font-bold text-lg">Review Seniors</span>
        </router-link>

          <!-- Applications that are pending or in process in each program-->
        <router-link
          to="/osca/applications"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 9h6M9 13h4m-8 4h12" />
          </svg>
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


    <!-- Main -->
    <main class="flex-1 p-6 md:ml-60">
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
