<!-- SeniorList.vue -->
<template>
 <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <!-- Sidebar -->
    <aside
      :class="[ 
        'fixed inset-y-0 left-0 bg-white shadow-lg flex flex-col py-6 z-50 transform transition-transform duration-300',
        sidebarOpen ? 'translate-x-0 w-60' : '-translate-x-full w-60',
        'md:relative md:translate-x-0 md:w-60'
      ]"
    >
      <h4 class="font-bold text-emerald-700 mb-8 px-4">SeniorGo</h4>

      <nav class="flex flex-col gap-6 w-full items-start px-4">
        <!-- Home -->
        <router-link
          to="/barangay/dashboard"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 9.75L12 3l9 6.75V21a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 21V9.75z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 22V12h6v10" />
          </svg>
          <span class="font-bold text-lg">Home</span>
        </router-link>

        <!-- Messaging -->
        <router-link
          to="/barangay/messaging"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.83L3 20l1.29-2.58A7.79 7.79 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span class="font-bold text-lg">Post</span>
        </router-link>

        <!-- Notifications -->
        <router-link
          to="/barangay/notifications"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 17h5l-1.405-1.405C18.21 14.79 18 14.418 18 14V11a6 6 0 00-12 0v3c0 .418-.21.79-.595 1.595L4 17h5m6 0v1a3 3 0 11-6 0v-1" />
          </svg>
          <span class="font-bold text-lg">Notifications</span>
        </router-link>

        <!-- Applications -->
        <router-link
          to="/barangay/senior-queue"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 17h6m-6-4h6m-6-4h6m-7 9h8a2 2 0 002-2V5a2 2 0 00-2-2h-8a2 2 0 00-2 2v14z" />
          </svg>
          <span class="font-bold text-lg">Applications</span>
        </router-link>

        <!-- Logout -->
        <router-link
          to="/logout"
          class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          <span class="font-bold text-lg">Logout</span>
        </router-link>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col md:ml-60">
      <!-- Header -->
      <header class="bg-white shadow-md p-5 flex items-center justify-between">
        <div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-emerald-700">Senior List</h1>
          <p class="text-gray-600 text-sm md:text-base">Manage eligible seniors and submit to OSCA</p>
        </div>
      </header>

      <!-- Main content -->
      <main class="p-4 md:p-6 space-y-6">
            <!-- Senior Registry Table -->
    <section id="registrySection" ref="registryRef" class="bg-white rounded-2xl shadow p-4 md:p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl md:text-2xl font-bold text-emerald-700">Senior Registry</h2>
        <span id="registryCount" class="text-sm text-gray-500">{{ seniors.length }} total</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead class="bg-emerald-50 text-emerald-700 text-sm">
            <tr>
              <th class="px-4 py-2 text-left font-semibold">Name</th>
              <th class="px-4 py-2 text-left font-semibold">Age</th>
              <th class="px-4 py-2 text-left font-semibold">Purok</th>
              <th class="px-4 py-2 text-left font-semibold">Status</th>
              <th class="px-4 py-2 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr 
              v-for="s in seniors" 
              :key="s.id" 
              :class="{'bg-emerald-50/40': s.validated}"
            >
              <td class="px-4 py-2 font-medium text-gray-800">{{ s.name }}</td>
              <td class="px-4 py-2">{{ s.age }}</td>
              <td class="px-4 py-2">{{ s.purok }}</td>
              <td class="px-4 py-2">
                <span
                  v-if="s.validated"
                  class="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700"
                >Validated</span>
                <span
                  v-else
                  class="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700"
                >Not Validated</span>
              </td>
              <td class="px-4 py-2 flex justify-center gap-2">
                <button
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 border border-emerald-300 hover:bg-emerald-50"
                  @click="toggleValidate(s.id)"
                >
                  {{ s.validated ? 'Unvalidate' : 'Validate' }}
                </button>
                <button
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
                  @click="selectForSubmit(s.id)"
                >
                  Select
                </button>
              </td>
            </tr>
            <tr v-if="seniors.length === 0">
              <td colspan="5" class="px-4 py-4 text-center text-sm text-gray-500">No seniors found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- To Submit to OSCA Table -->
    <section id="submitSection" ref="submitRef" class="bg-white rounded-2xl shadow p-4 md:p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl md:text-2xl font-bold text-emerald-700">To Submit to OSCA</h2>
        <span id="submitCount" class="text-sm text-gray-500">{{ toSubmit.length }} selected</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead class="bg-emerald-50 text-emerald-700 text-sm">
            <tr>
              <th class="px-4 py-2 text-left font-semibold">Name</th>
              <th class="px-4 py-2 text-left font-semibold">Age</th>
              <th class="px-4 py-2 text-left font-semibold">Purok</th>
              <th class="px-4 py-2 text-center font-semibold">Remove</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr 
              v-for="s in toSubmit" 
              :key="s.id"
              class="bg-emerald-50/40"
            >
              <td class="px-4 py-2 font-medium text-gray-800">{{ s.name }}</td>
              <td class="px-4 py-2">{{ s.age }}</td>
              <td class="px-4 py-2">{{ s.purok }}</td>
              <td class="px-4 py-2 text-center">
                <button
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 border border-red-300 hover:bg-red-50"
                  @click="removeFromSubmit(s.id)"
                >
                  Remove
                </button>
              </td>
            </tr>
            <tr v-if="toSubmit.length === 0">
              <td colspan="4" class="px-4 py-4 text-center text-sm text-gray-500">No seniors selected.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="toSubmit.length > 0" class="mt-4 flex justify-end">
        <button
          class="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
          @click="submitToOSCA"
        >
          Submit All
        </button>
      </div>
    </section>

      </main>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'

/* --- Sample Data (replace with backend later) --- */
const seniors = ref([
  { id: 1, name: 'Juan Dela Cruz',  age: 72, purok: 'Purok 1', validated: true  },
  { id: 2, name: 'Maria Santos',    age: 79, purok: 'Purok 5', validated: false },
  { id: 3, name: 'Pedro Reyes',     age: 81, purok: 'Purok 2', validated: true  },
  { id: 4, name: 'Carmen Lopez',    age: 69, purok: 'Purok 7', validated: false },
  { id: 5, name: 'Gregorio Tan',    age: 74, purok: 'Purok 4', validated: false },
  { id: 6, name: 'Luisa Manibo',    age: 83, purok: 'Purok 6', validated: true  },
])
let nextId = 7

/* Benefits & Required Docs */
const BENEFITS = [
  { key: 'food',       label: 'Food Assistance' },
  { key: 'medical',    label: 'Medical Checkup' },
  { key: 'medicine',   label: 'Medicine/Vitamins' },
  { key: 'livelihood', label: 'Livelihood / Entrepreneurial Activities' },
  { key: 'others',     label: 'Others (specify)' },
]
const DOCS = [
  { key: 'idpic',     label: '2x2 ID Picture' },
  { key: 'rrn',       label: 'NCSC Registration Reference Number' },
  { key: 'residency', label: 'Proof of Residency' },
  { key: 'oath',      label: 'Signed Oath Form' },
  { key: 'appform',   label: 'OSCA Application Form' },
]

/* Controls */
const search = ref('')
const form = reactive({ name: '', age: null, purok: '' })

/* To-Submit state: { [id]: { benefits: Record<string,boolean>, docs: Record<string,boolean>, others: string } } */
const toSubmit = reactive({})

/* UI state */
const showPostModal = ref(false)
const showOnlineApp = ref(false)
const extraName = ref('')
const extraNames = ref([])
const oa = reactive({ name: '', age: null, purok: '' })
const highlightedId = ref(null)
const registryRef = ref(null)

/* Derived/computed */
const filteredSeniors = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return seniors.value
  return seniors.value.filter(s => s.name.toLowerCase().includes(q) || s.purok.toLowerCase().includes(q))
})
const totalCount = computed(() => seniors.value.length)
const selectedCount = computed(() => Object.keys(toSubmit).length)
const validatedCount = computed(() => seniors.value.filter(s => s.validated).length)
const toSubmitList = computed(() => {
  return Object.keys(toSubmit).map(id => {
    const senior = seniors.value.find(s => s.id === Number(id))
    return { senior }
  })
})
const selectedNames = computed(() =>
  Object.keys(toSubmit).map(id => seniors.value.find(s => s.id === Number(id))?.name).filter(Boolean)
)

/* Actions */
function addSenior () {
  if (!form.name.trim() || !form.age || !form.purok.trim()) {
    alert('Please fill in Name, Age, and Purok.')
    return
  }
  const id = nextId++
  seniors.value.push({ id, name: form.name.trim(), age: Number(form.age), purok: form.purok.trim(), validated: false })
  form.name = ''; form.age = null; form.purok = ''
  flashRow(id)
}

function toggleValidate (id) {
  const i = seniors.value.findIndex(s => s.id === id)
  if (i >= 0) seniors.value[i].validated = !seniors.value[i].validated
}

function selectForSubmit (id) {
  if (!toSubmit[id]) toSubmit[id] = { benefits: {}, docs: {}, others: '' }
}

function removeFromSubmit (id) {
  delete toSubmit[id]
}

function openFinalize () {
  if (selectedCount.value === 0) {
    alert('No seniors selected.')
    return
  }
  extraNames.value = []
  showPostModal.value = true
}

function addExtraPill () {
  const v = extraName.value.trim()
  if (!v) return
  extraNames.value.push(v)
  extraName.value = ''
}

function confirmFinalize () {
  alert(`Submitted to OSCA with ${selectedCount.value + extraNames.value.length} seniors.`)
  // clear selection
  for (const id of Object.keys(toSubmit)) delete toSubmit[id]
  showPostModal.value = false
}

function acceptOnlineApplicant () {
  if (!oa.name.trim() || !oa.age || !oa.purok.trim()) {
    alert('Please fill Name, Age, and Purok.')
    return
  }
  const id = nextId++
  seniors.value.push({ id, name: oa.name.trim(), age: Number(oa.age), purok: oa.purok.trim(), validated: true })
  oa.name = ''; oa.age = null; oa.purok = ''
  showOnlineApp.value = false
  flashRow(id)
}

/* UX helpers */
async function flashRow (id) {
  highlightedId.value = id
  await nextTick()
  registryRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  setTimeout(() => { if (highlightedId.value === id) highlightedId.value = null }, 2000)
}
</script>

<style scoped>
/* simple highlight pulse on new/accepted rows */
@keyframes flash {
  0%   { box-shadow: 0 0 0 0 rgba(16,185,129,.45); }
  100% { box-shadow: 0 0 0 16px rgba(16,185,129,0); }
}
.flash-row {
  animation: flash 1s ease-out 2;
}
</style>
