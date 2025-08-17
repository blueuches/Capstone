<!-- SeniorIdRelease.vue -->
<template>
  <div class="bg-gray-50 min-h-screen flex flex-col">
    <!-- Header -->
    <header class="w-full bg-white shadow-md fixed top-0 z-40 flex items-center justify-between px-6 py-3">
      <div class="flex items-center gap-2">
        <div class="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">S</div>
        <h1 class="font-bold text-emerald-700 text-lg sm:text-xl">Senior ID Release</h1>
      </div>
      <!-- If you use vue-router, swap to: <RouterLink to="/dashboard" ...> -->
      <button
        class="px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm sm:text-base hover:bg-emerald-700 transition"
        @click="goBack"
      >
        Back to Dashboard
      </button>
    </header>

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
