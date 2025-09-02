<!-- SeniorList.vue -->
<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <!-- Sidebar -->
    <aside class="w-20 md:w-60 bg-white shadow-lg flex flex-col items-center py-6">
      <h2 class="hidden md:block text-xl font-bold text-emerald-700 mb-8">Menu</h2>
      <nav class="flex flex-col gap-8 w-full items-center md:items-start px-4">
        <router-link to="/barangay/dashboard" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
          <!-- Home icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 9.75L12 3l9 6.75V21a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 21V9.75z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 22V12h6v10"/>
          </svg>
          <span class="hidden md:inline">Home</span>
        </router-link>

        <!-- other nav links -->
        <router-link to="/barangay/messaging" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <span class="hidden md:inline">Message</span>
        </router-link>

        <router-link to="/barangay/notifications" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 17h5l-1.405-1.405C18.21 14.79 18 14.418 18 14V11c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 00-3 0v.68C7.64 5.36 6 7.92 6 11v3c0 .418-.21.79-.595 1.595L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span class="hidden md:inline">Notifications</span>
        </router-link>

        <router-link to="/barangay/senior-queue" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 17h6m-6-4h6m2 9H7a2 2 0 01-2-2V5a2 2 0 012-2h2l1-2h4l1 2h2a2 2 0 012 2v14a2 2 0 01-2 2z"/>
          </svg>
          <span class="hidden md:inline">Applications</span>
        </router-link>
      </nav>
    </aside>

        <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-md p-5 flex items-center justify-between">
        <div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-emerald-700">Senior List</h1>
          <p class="text-gray-600 text-sm md:text-base">Manage eligible seniors and submit to OSCA</p>
        </div>
        <div class="flex gap-2">
          <button
            id="openOnlineApp"
            class="px-4 py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow"
            @click="showOnlineApp = true"
          >
            Online Application
          </button>

          <router-link to="/barangay/dashboard">
            <p class="text-emerald-700 font-bold underline text-lg">← Back to Dashboard</p>
          </router-link>
        </div>
      </header>

      <!-- Main -->
      <main class="flex-1 p-5 max-w-7xl mx-auto space-y-6">
              <!-- Controls -->
      <section class="bg-white rounded-2xl shadow p-4 md:p-6 space-y-6">
        <div class="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
          <!-- Search -->
          <div class="w-full md:w-1/2">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Search (Name or Purok)</label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-emerald-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-4.35-4.35m1.6-4.15a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </span>
              <input
                id="searchInput"
                type="text"
                placeholder="Type a name or purok"
                v-model="search"
                class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <!-- Counters -->
          <div class="md:ml-auto grid grid-cols-3 gap-3 md:gap-4 w-full md:w-auto">
            <div class="bg-emerald-50 rounded-xl p-3 text-center">
              <div class="text-xs text-gray-600">Total Seniors</div>
              <div id="countTotal" class="text-lg font-bold text-emerald-700">{{ totalCount }}</div>
            </div>
            <div class="bg-emerald-50 rounded-xl p-3 text-center">
              <div class="text-xs text-gray-600">Selected</div>
              <div id="countSelected" class="text-lg font-bold text-emerald-700">{{ selectedCount }}</div>
            </div>
            <div class="bg-emerald-50 rounded-xl p-3 text-center">
              <div class="text-xs text-gray-600">Validated</div>
              <div id="countValidated" class="text-lg font-bold text-emerald-700">{{ validatedCount }}</div>
            </div>
          </div>
        </div>

        <!-- Add Senior -->
        <div class="border-t pt-4">
          <h3 class="text-lg font-bold text-emerald-700 mb-3">Add Senior (Name • Age • Purok)</h3>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div class="md:col-span-2">
              <label for="addName" class="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                id="addName"
                type="text"
                placeholder="e.g., Juan Dela Cruz"
                v-model="form.name"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label for="addAge" class="block text-sm font-semibold text-gray-700 mb-1">Age</label>
              <input
                id="addAge"
                type="number"
                min="0"
                placeholder="e.g., 72"
                v-model.number="form.age"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label for="addPurok" class="block text-sm font-semibold text-gray-700 mb-1">Purok</label>
              <input
                id="addPurok"
                type="text"
                placeholder="e.g., Purok 3"
                v-model="form.purok"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>
            <div class="flex items-end">
              <button
                id="addBtn"
                class="w-full md:w-auto px-4 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow"
                @click="addSenior"
              >
                Add to Registry
              </button>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Tip: You can add as many seniors as needed, then select them for OSCA submission on the right.</p>
        </div>
      </section>

      <!-- Lists: Seniors & To Submit -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Senior Registry -->
        <div id="registrySection" ref="registryRef" class="bg-white rounded-2xl shadow p-4 md:p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl md:text-2xl font-bold text-emerald-700">Senior Registry</h2>
            <span id="registryCount" class="text-sm text-gray-500">{{ totalCount }} total</span>
          </div>

          <div id="seniorList" class="space-y-3">
            <div
              v-for="s in filteredSeniors"
              :key="s.id"
              :data-row="s.id"
              class="rounded-xl border border-gray-200 p-3 md:p-4 flex items-center justify-between bg-white"
              :class="{'flash-row': highlightedId === s.id}"
            >
              <div>
                <div class="font-bold text-emerald-800">{{ s.name }}</div>
                <div class="text-sm text-gray-600">Age {{ s.age }} • {{ s.purok }}</div>
                <div class="mt-1">
                  <span
                    v-if="s.validated"
                    class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700"
                  >Validated</span>
                  <span
                    v-else
                    class="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700"
                  >Not Validated</span>
                </div>
              </div>
              <div class="ml-3 flex gap-2">
                <button
                  class="px-3 py-2 rounded-lg text-xs font-semibold text-emerald-700 border border-emerald-300 hover:bg-emerald-50"
                  @click="toggleValidate(s.id)"
                >
                  {{ s.validated ? 'Unvalidate' : 'Validate' }}
                </button>
                <button
                  class="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
                  @click="selectForSubmit(s.id)"
                >
                  Select
                </button>
              </div>
            </div>

            <div v-if="filteredSeniors.length === 0" class="text-sm text-gray-500">No seniors found.</div>
          </div>
        </div>

        <!-- To Submit to OSCA -->
        <div class="bg-white rounded-2xl shadow p-4 md:p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl md:text-2xl font-bold text-emerald-700">To Submit to OSCA</h2>
            <span id="submitCount" class="text-sm text-gray-500">{{ selectedCount }} selected</span>
          </div>

          <div id="submitList" class="space-y-4">
            <div
              v-for="item in toSubmitList"
              :key="item.senior.id"
              class="rounded-xl border border-gray-200 p-3 space-y-3"
            >
              <div class="flex justify-between items-center">
                <div class="font-bold text-emerald-800">
                  {{ item.senior.name }} (Age {{ item.senior.age }}, {{ item.senior.purok }})
                </div>
                <button
                  class="px-2 py-1 text-xs rounded bg-red-100 text-red-600 hover:bg-red-200"
                  @click="removeFromSubmit(item.senior.id)"
                >
                  Remove
                </button>
              </div>

              <!-- Benefits -->
              <div>
                <div class="text-sm font-semibold text-emerald-700">Benefits</div>
                <div class="grid grid-cols-2 gap-2">
                  <label v-for="b in BENEFITS" :key="b.key" class="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      v-model="toSubmit[item.senior.id].benefits[b.key]"
                    />
                    {{ b.label }}
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Specify others..."
                  class="mt-2 w-full px-2 py-1 border rounded"
                  v-model="toSubmit[item.senior.id].others"
                />
              </div>

              <!-- Documents -->
              <div>
                <div class="text-sm font-semibold text-emerald-700">Documents</div>
                <div class="grid grid-cols-2 gap-2">
                  <label v-for="d in DOCS" :key="d.key" class="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      v-model="toSubmit[item.senior.id].docs[d.key]"
                    />
                    {{ d.label }}
                  </label>
                </div>
              </div>
            </div>

            <div v-if="toSubmitList.length === 0" class="text-sm text-gray-500">No seniors selected.</div>
          </div>

          <div class="mt-4">
            <button
              id="submitBtn"
              class="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 rounded-xl font-bold shadow transition"
              @click="openFinalize()"
            >
              Proceed to Submission
            </button>
            <p class="text-xs text-gray-500 mt-2">
              Validation: Each selected senior must have at least one benefit checked and all required documents marked.
            </p>
          </div>
        </div>
      </section>

      <!-- VALIDATED SENIORS LIST -->
      <section id="validatedSection" class="bg-white rounded-2xl shadow p-4 md:p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl md:text-2xl font-bold text-emerald-700">Validated Seniors</h2>
          <span id="validatedCount" class="text-sm text-gray-500">{{ validatedCount }} validated</span>
        </div>
        <div id="validatedList" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="s in seniors.filter(x => x.validated)"
            :key="s.id"
            class="rounded-xl border border-emerald-200 p-3 bg-emerald-50/40"
          >
            <div class="font-semibold text-emerald-800">{{ s.name }}</div>
            <div class="text-sm text-gray-600">Age {{ s.age }} • {{ s.purok }}</div>
          </div>
          <div v-if="validatedCount === 0" class="text-sm text-gray-500">No validated seniors yet.</div>
        </div>
      </section>

      </main>
    </div>


    <!-- ===== Modal: Post-Submission ===== -->
    <div
      id="postSubmitModal"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm items-center justify-center p-4 z-50"
      v-show="showPostModal"
    >
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-xl">
        <div class="p-5 border-b flex items-center justify-between">
          <h3 class="text-lg font-bold text-emerald-700">Finalize Submission</h3>
          <button class="h-9 w-9 rounded-full grid place-items-center hover:bg-slate-100" @click="showPostModal=false">✕</button>
        </div>

        <div class="p-5 space-y-5">
          <div class="bg-emerald-50 rounded-xl p-3">
            <div class="font-semibold text-emerald-800 mb-1">Selected Seniors</div>
            <ul class="list-disc list-inside text-sm text-slate-700">
              <li v-for="n in selectedNames" :key="n">{{ n }}</li>
            </ul>
          </div>

          <div>
            <div class="flex items-end gap-3">
              <div class="flex-1">
                <label for="extraName" class="block text-sm font-semibold text-gray-700 mb-1">Add More Names (Name only)</label>
                <input
                  id="extraName"
                  type="text"
                  placeholder="e.g., Maria Villanueva"
                  v-model="extraName"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>
              <button
                class="px-4 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow"
                @click="addExtraPill"
              >
                Add
              </button>
            </div>
            <div id="extraNamesPills" class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="(nm, i) in extraNames"
                :key="i"
                class="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm"
              >
                {{ nm }}
              </span>
            </div>
          </div>

          <div class="text-xs text-gray-500">
            Note: These additional names are appended to the submission payload as name-only entries (without age/purok).
          </div>
        </div>

        <div class="p-5 border-t flex items-center justify-end gap-2">
          <button
            class="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
            @click="showPostModal=false"
          >
            Cancel
          </button>
          <button
            class="px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow"
            @click="confirmFinalize"
          >
            Confirm & Submit to OSCA
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Modal: Online Application Intake ===== -->
    <div
      id="onlineAppModal"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm items-center justify-center p-4 z-50"
      v-show="showOnlineApp"
    >
      <div class="bg-white w-full max-w-xl rounded-2xl shadow-xl">
        <div class="p-5 border-b flex items-center justify-between">
          <h3 class="text-lg font-bold text-emerald-700">Online Application — Quick Intake</h3>
          <button class="h-9 w-9 rounded-full grid place-items-center hover:bg-slate-100" @click="showOnlineApp=false">✕</button>
        </div>

        <div class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              id="oaName"
              type="text"
              placeholder="e.g., Regina A. Cruz"
              v-model="oa.name"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Age</label>
              <input
                id="oaAge"
                type="number"
                min="0"
                placeholder="e.g., 70"
                v-model.number="oa.age"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Purok</label>
              <input
                id="oaPurok"
                type="text"
                placeholder="e.g., Purok 8"
                v-model="oa.purok"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>
          </div>
          <p class="text-xs text-gray-500">On Accept, this applicant will be added to the Senior Registry list and marked as Validated.</p>
        </div>

        <div class="p-5 border-t flex items-center justify-end gap-2">
          <button
            class="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
            @click="showOnlineApp=false"
          >
            Reject
          </button>
          <button
            class="px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow"
            @click="acceptOnlineApplicant"
          >
            Accept & Add to Registry
          </button>
        </div>
      </div>
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
