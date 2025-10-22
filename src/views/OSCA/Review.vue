<!-- SeniorIdRelease.vue -->
<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <Sidebar role="osca" />

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
  class="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto"
>
  <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="closeModal"></div>

  <div
    class="relative max-w-3xl mx-auto mt-16 sm:mt-24 bg-white/90 backdrop-blur rounded-2xl shadow-2xl ring-1 ring-emerald-100 animate-pop"
  >
    <div class="px-5 py-4 border-b flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="h-9 w-9 rounded-xl bg-emerald-600/10 text-emerald-700 grid place-items-center ring-1 ring-emerald-200"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 11.5 7.5 10l-1 1 2.5 2.5L17 6.5l-1-1z" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-extrabold text-emerald-700">
            Requirements — {{ modal.app?.name }}
          </h3>
          <p class="text-xs text-gray-500">
            SR-ID: {{ modal.app?.id }} • Barangay {{ modal.app?.barangay }}
          </p>
        </div>
      </div>
      <button class="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50" @click="closeModal">
        ✕
      </button>
    </div>

    <!-- Body -->
    <div class="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
      <!-- Progress -->
      <section class="md:col-span-1 rounded-xl border p-4 bg-white">
        <h4 class="text-sm font-semibold text-emerald-700 mb-3">Completion</h4>
        <div class="flex items-center gap-4">
          <div
            class="h-16 w-16 rounded-full ring-progress grid place-items-center"
          >
            <div
              class="h-11 w-11 rounded-full bg-white grid place-items-center text-sm font-bold text-emerald-700"
            >
              {{ progressPct }}%
            </div>
          </div>
          <div class="text-sm text-gray-700">
            <div><span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>OK</div>
            <div><span class="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>Pending</div>
          </div>
        </div>
        <div class="mt-3 text-xs text-gray-500">{{ progressOk }} of {{ progressTotal }} met</div>
      </section>

      <!-- Checklist -->
      <section class="md:col-span-2 rounded-xl border p-4 bg-white">
        <h4 class="text-sm font-semibold text-emerald-700 mb-3">Requirements Checklist</h4>
        <ul class="space-y-2 text-sm text-gray-800">
          <li
            v-for="(req, i) in modal.app?.requirements || []"
            :key="i"
            class="flex items-start gap-3 p-2 rounded-lg border hover:bg-emerald-50/40"
          >
            <span
              class="mt-1 h-2 w-2 rounded-full"
              :class="req.status === 'ok' ? 'bg-emerald-500' : 'bg-yellow-400'"
            ></span>
            <div class="flex-1">{{ req.label }}</div>
            <span class="shrink-0">
              <svg
                v-if="req.status === 'ok'"
                class="h-4 w-4 text-emerald-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                />
              </svg>
              <svg
                v-else
                class="h-4 w-4 text-yellow-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.518 11.6c.75 1.335-.213 3.001-1.743 3.001H3.482c-1.53 0-2.493-1.666-1.743-3.002l6.518-11.6zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V7a1 1 0 112 0v4a1 1 0 01-1 1z"
                />
              </svg>
            </span>
          </li>
        </ul>
      </section>
    </div>

    <!-- Footer -->
    <div class="px-5 py-4 border-t bg-white/80 rounded-b-2xl flex items-center justify-between">
      <div class="text-xs text-gray-500">Review the list before submission.</div>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-2 rounded-lg ring-1 ring-emerald-200 text-emerald-700 bg-white hover:bg-emerald-50"
          @click="window.print()"
        >
          Print
        </button>

        <!-- NEW: Deep-link into the Review workspace -->
        <RouterLink
          class="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          to="/osca/review/4"
          title="Open the full reviewer workspace for this applicant"
        >
          Open in Review Workspace
        </RouterLink>

        <button
          class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          @click="closeModal"
        >
          Close
        </button>
      </div>
    </div>

  </div>
</div>



  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

const sidebarOpen = ref(false)
const route = useRoute()

// Active nav helper (adds bg + bold + indicator bar)
const navActive = (path) => {
  const isActive = route.path === path
  return isActive
    ? 'bg-emerald-50 text-emerald-900 font-extrabold relative before:content-[\'\'] before:absolute before:-left-1 before:h-6 before:w-1 before:rounded-full before:bg-emerald-500'
    : ''
}

/** DATA (replace with Supabase later) */
const applications = ref([
  { id: '2025-00123',programId: 4, name: 'Juan Dela Cruz',  age: 73, barangay: 'Ampayon', submitted: 'Aug 10, 2025', release: null,          remarks: 'Waiting for validation of submitted requirements.', status: 'Pending'   },
  { id: '2025-00089',programId: 4, name: 'Maria Santos',    age: 69, barangay: 'De Oro',  submitted: 'Aug 03, 2025', release: 'Aug 16, 2025', remarks: 'Please pick up your ID at the Barangay Hall.',      status: 'Approved'  },
  { id: '2025-00077',programId: 4, name: 'Pedro Ramirez',   age: 77, barangay: 'Banza',   submitted: 'Jul 28, 2025', release: 'Aug 14, 2025', remarks: 'Your ID is ready for pickup at OSCA Office.',       status: 'Declined'  },
  { id: '2025-00145',programId: 4, name: 'Junafe Miot Marban', age: 81, barangay: 'De Oro', submitted: 'Feb 01, 2025', release: null,         remarks: 'Octogenarian program applicant.',                   status: 'Pending'   },
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

const progressTotal = computed(() => modal.value.app?.requirements?.length || 0)
const progressOk = computed(() =>
  modal.value.app?.requirements?.filter(r => r.status === 'ok').length || 0
)
const progressPct = computed(() =>
  progressTotal.value ? Math.round((progressOk.value / progressTotal.value) * 100) : 0
)

/** ESC to close modal */
function onKey(e) { 
  if (e.key === 'Escape' && modal.value.open) closeModal()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>
