<!-- SeniorIdRelease.vue -->
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

    <!-- Main -->
    <main class="flex-1 pt-24 pb-10 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
      <!-- Filter Section -->
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

      <!-- Applicant List -->
      <section>
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Applicants</h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="app in filteredApps"
            :key="app.id"
            class="cursor-pointer p-4 rounded-lg border shadow bg-white hover:bg-emerald-50 transition"
            @click="selectApp(app.id)"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-gray-800">{{ app.name }}</h4>
              <span class="text-xs px-2 py-1 rounded-full" :class="statusClass(app.status)">{{ app.status }}</span>
            </div>
            <p class="text-sm text-gray-600">ID: {{ app.id }}</p>
            <p class="text-xs text-gray-500">Barangay: {{ app.barangay }}</p>
          </div>

          <p v-if="filteredApps.length === 0" class="text-sm text-gray-500">No matching applications.</p>
        </div>
      </section>

      <!-- Applicant Details -->
      <section v-if="selectedApp" class="bg-white rounded-xl shadow-md border p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold text-emerald-700">{{ selectedApp.name }}</h3>
          <span class="px-3 py-1 rounded-full text-sm font-medium" :class="statusClass(selectedApp.status)">
            {{ selectedApp.status }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <p><span class="font-semibold">Application #:</span> {{ selectedApp.id }}</p>
          <p><span class="font-semibold">Barangay:</span> {{ selectedApp.barangay }}</p>
          <p><span class="font-semibold">Submitted:</span> {{ selectedApp.submitted }}</p>
          <p><span class="font-semibold">Release Date:</span> {{ selectedApp.release ?? '—' }}</p>
        </div>

        <p class="text-sm text-gray-500 italic">{{ selectedApp.remarks }}</p>

        <!-- Actions -->
        <div class="flex flex-wrap gap-3 pt-4 border-t pt-4">
          <button
            class="flex-1 px-4 py-2 rounded-lg bg-yellow-500 text-white text-sm hover:bg-yellow-600"
            @click="updateStatus('Pending')"
          >
            🕒 Mark Pending
          </button>
          <button
            class="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600"
            @click="updateStatus('For Pickup')"
          >
            📦 Mark For Pickup
          </button>
          <button
            class="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
            @click="updateStatus('Released')"
          >
            ✅ Confirm Release
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/** DATA (replace with API later) */
const applications = ref([
  { id: '2025-00123', name: 'Juan Dela Cruz',  barangay: 'Ampayon', submitted: 'Aug 10, 2025', release: null,           remarks: 'Waiting for validation of submitted requirements.', status: 'Pending'   },
  { id: '2025-00089', name: 'Maria Santos',    barangay: 'De Oro',  submitted: 'Aug 3, 2025',  release: 'Aug 16, 2025',  remarks: 'Please pick up your ID at the Barangay Hall.',      status: 'Released'  },
  { id: '2025-00077', name: 'Pedro Ramirez',   barangay: 'Banza',   submitted: 'July 28, 2025',release: 'Aug 14, 2025',  remarks: 'Your ID is ready for pickup at OSCA Office.',       status: 'For Pickup'}
])

/** FILTERS */
const filters = ref({ barangay: '', query: '' })

/** SELECTION */
const selectedId = ref(null)
const selectedApp = computed(() => applications.value.find(a => a.id === selectedId.value) || null)

/** FILTERED LIST */
const filteredApps = computed(() => {
  const b = (filters.value.barangay || '').trim()
  const q = (filters.value.query || '').trim().toLowerCase()
  return applications.value.filter(app => {
    const okB = !b || app.barangay === b
    const okQ = !q || app.name.toLowerCase().includes(q) || app.id.toLowerCase().includes(q)
    return okB && okQ
  })
})

/** UI HELPERS */
function statusClass (status) {
  return {
    'Pending':    'bg-yellow-100 text-yellow-700',
    'For Pickup': 'bg-blue-100 text-blue-700',
    'Released':   'bg-green-100 text-green-700'
  }[status] || 'bg-gray-100 text-gray-700'
}

function selectApp (id) {
  selectedId.value = id
}

function updateStatus (newStatus) {
  if (!selectedApp.value) return
  const app = selectedApp.value
  app.status = newStatus
  if (newStatus === 'Released') {
    app.release = formatToday()
    app.remarks = 'ID successfully released to senior.'
  } else if (newStatus === 'For Pickup') {
    app.release = formatToday()
    app.remarks = 'Your ID is now ready for pickup at your Barangay.'
  } else {
    app.release = null
    app.remarks = 'Waiting for validation of submitted requirements.'
  }
}

function goBack () {
  // If using vue-router:
  // router.push('/dashboard')
  // For now just history back:
  window.history.back()
}

function formatToday () {
  try {
    return new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return new Date().toLocaleDateString()
  }
}
</script>
