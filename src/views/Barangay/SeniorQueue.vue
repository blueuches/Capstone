<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <!-- Sidebar -->
<aside
  class="fixed inset-y-0 left-0 bg-white/95 backdrop-blur shadow-lg flex flex-col justify-between py-6 z-50 transform transition-transform duration-300 w-64 md:relative md:translate-x-0 md:w-64"
  :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
>
  <div>
    <!-- Logo / Header -->
    <div class="px-4 flex items-center gap-2 mb-6">
      <h4 class="font-extrabold tracking-tight text-emerald-700">SeniorGo</h4>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-2 w-full items-start px-2" id="nav">

      <!-- Dashboard -->
      <RouterLink
        to="/barangay/dashboard"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/barangay/dashboard')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Home Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-6v-6H10v6H4a1 1 0 0 1-1-1V9.5z" />
          </svg>
        </span>
        <span class="font-bold text-base">Dashboard</span>
      </RouterLink>

      <!-- View Seniors -->
      <RouterLink
        to="/barangay/senior-queue"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/barangay/senior-queue')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- People Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3s1.34 3 3 3zM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5S5 6.34 5 8s1.34 3 3 3zm8 2c-1.5 0-4.5.75-4.5 2.25V18h9v-2.75C20.5 13.75 17.5 13 16 13zM8 13c-1.5 0-4.5.75-4.5 2.25V18h9v-2.75C12.5 13.75 9.5 13 8 13z"/>
          </svg>
        </span>
        <span class="font-bold text-base">View Seniors</span>
      </RouterLink>

      <!-- Post Announcement -->
      <RouterLink
        to="/barangay/messaging"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/barangay/messaging')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Megaphone Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 14V6h2v8H2zm4 2V4l12 5v2l-12 5zm14-3a1 1 0 1 1 0-2a1 1 0 0 1 0 2z" />
          </svg>
        </span>
        <span class="font-bold text-base">Post Announcement</span>
      </RouterLink>

      <!-- Notifications -->
      <RouterLink
        to="/barangay/notifications"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/barangay/notifications')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Bell Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22a2 2 0 0 0 1.985-1.75H10.015A2 2 0 0 0 12 22zm6-6v-5a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </span>
        <span class="font-bold text-base">Notifications</span>
      </RouterLink>

      <!-- Logout -->
      <RouterLink
        to="/logout"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/logout')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Logout Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 13v-2H7V8l-5 4l5 4v-3h9zM20 3H10a1 1 0 0 0-1 1v4h2V5h8v14h-8v-3H9v4a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z" />
          </svg>
        </span>
        <span class="font-bold text-base">Logout</span>
      </RouterLink>
    </nav>
  </div>

  <!-- Footer -->
  <div class="px-4 text-xs text-gray-500 text-center leading-snug">
    © 2025 <span class="font-semibold text-emerald-700">SeniorGo</span><br />
    Made for Butuan Seniors<br />
    Powered by Barangay &amp; OSCA
  </div>
</aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col md:ml-60">
      <header class="bg-white shadow-md p-5 flex items-center justify-between">
        <div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-emerald-700">Senior List</h1>
          <p class="text-gray-600 text-sm md:text-base">Manage eligible seniors and submit to OSCA</p>
        </div>
      </header>

      <!-- Tables -->
      <main class="p-4 md:p-6 space-y-6">
        <!-- Registry -->
        <section ref="registryRef" class="bg-white rounded-2xl shadow p-4 md:p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl md:text-2xl font-bold text-emerald-700">Senior Registry</h2>
            <span class="text-sm text-gray-500">{{ seniors.length }} total</span>
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
                  :class="{ 'bg-emerald-50/40': s.validated }"
                >
                  <td class="px-4 py-2 font-medium text-gray-800">{{ s.name }}</td>
                  <td class="px-4 py-2">{{ s.age }}</td>
                  <td class="px-4 py-2">{{ s.purok }}</td>
                  <td class="px-4 py-2">
                    <span
                      v-if="s.validated"
                      class="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700"
                    >Eligible</span>
                    <span
                      v-else
                      class="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700"
                    >Ineligible</span>
                  </td>
                  <td class="px-4 py-2 flex justify-center gap-2">
                    <button
                      class="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 border border-emerald-300 hover:bg-emerald-50"
                      @click="toggleValidate(s.id)"
                    >
                      {{ s.validated ? 'Ineligible' : 'Eligible' }}
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

        <!-- To Submit -->
        <section ref="submitRef" class="bg-white rounded-2xl shadow p-4 md:p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl md:text-2xl font-bold text-emerald-700">To Submit to OSCA</h2>
            <span class="text-sm text-gray-500">{{ toSubmitList.length }} selected</span>
          </div>

          <div v-if="toSubmitList.length > 0" class="mt-4 flex justify-end">
            <button
              class="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
              @click="submitToOSCA"
            >
              Submit All
            </button>
          </div>

               <div class="bg-white/90 backdrop-blur rounded-2xl shadow ring-1 ring-emerald-100 animate-pop">
        <!-- Title -->
        <div class="p-5 border-b flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <div
              class="h-9 w-9 rounded-xl bg-emerald-600/10 text-emerald-700 grid place-items-center ring-1 ring-emerald-200"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5m0 2c-5.33 0-8 2.667-8 5v1h16v-1c0-2.333-2.67-5-8-5"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-lg sm:text-xl font-extrabold text-emerald-700">View • Eligible Seniors</h2>
              <p class="text-xs text-gray-500">Select eligible seniors to submit to OSCA</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="relative">
              <input
                v-model="search"
                type="text"
                placeholder="Search seniors…"
                class="w-full sm:w-64 ps-9 pe-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <svg
                class="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.5 3.5a5 5 0 1 1 0 10A5 5 0 0 1 8.5 3.5m6.793 9.207a.999.999 0 1 1-1.414 1.414l-2.086-2.086a6.5 6.5 0 1 1 1.414-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <button
              class="px-3 py-2 rounded-lg ring-1 ring-emerald-200 text-emerald-700 bg-white hover:bg-emerald-50"
            >
              Filter
            </button>
          </div>
        </div>

        <!-- Eligible list -->
        <ul class="divide-y">
          <li
            v-for="(senior, index) in filteredSeniors"
            :key="index"
            class="px-4 py-3 hover:bg-emerald-50/40 transition"
          >
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div class="flex items-center gap-3">
                <input type="checkbox" class="h-4 w-4 text-emerald-600 rounded border-gray-300" />
                <div>
                  <div class="font-semibold text-gray-800 leading-tight">{{ senior.name }}</div>
                  <div class="text-xs text-gray-500 flex items-center gap-2">
                    Barangay {{ senior.barangay }} • Eligible
                    <span
                      class="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      >SR-ID: {{ senior.srid }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span
                  :class="statusClass(senior)"
                  class="text-[11px] px-2 py-0.5 rounded-full ring-1"
                >
                  {{ senior.statusLabel }}
                </span>
                <button
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 hover:bg-emerald-100"
                  @click="openModal(senior)"
                >
                  View Requirements
                  <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M6 10a1 1 0 0 1 1-1h6.586l-2.293-2.293A1 1 0 0 1 12.707 5.293l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 1 1-1.414-1.414L13.586 11H7a1 1 0 0 1-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
        </section>
      </main>

          <!-- Modal -->
    <div
      v-if="showModal"
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
                <path
                  d="M9 11.5 7.5 10l-1 1 2.5 2.5L17 6.5l-1-1z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-extrabold text-emerald-700">
                Requirements — {{ activeSenior?.name }}
              </h3>
              <p class="text-xs text-gray-500">
                SR-ID: {{ activeSenior?.srid }} • Barangay {{ activeSenior?.barangay }}
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
                :style="{ '--p': progress.pct }"
              >
                <div
                  class="h-11 w-11 rounded-full bg-white grid place-items-center text-sm font-bold text-emerald-700"
                >
                  {{ progress.pct }}%
                </div>
              </div>
              <div class="text-sm text-gray-700">
                <div>
                  <span
                    class="inline-block w-2 h-2 rounded-full bg-emerald-500 align-middle mr-2"
                  ></span
                  >OK
                </div>
                <div>
                  <span
                    class="inline-block w-2 h-2 rounded-full bg-yellow-400 align-middle mr-2"
                  ></span
                  >Pending
                </div>
              </div>
            </div>
            <div class="mt-3 text-xs text-gray-500">{{ progress.ok }} of {{ progress.total }} met</div>
          </section>

          <!-- Checklist -->
          <section class="md:col-span-2 rounded-xl border p-4 bg-white">
            <h4 class="text-sm font-semibold text-emerald-700 mb-3">Requirements Checklist</h4>
            <ul class="space-y-2 text-sm text-gray-800">
              <li
                v-for="(req, i) in activeSenior.requirements"
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
        <div
          class="px-5 py-4 border-t bg-white/80 rounded-b-2xl flex items-center justify-between"
        >
          <div class="text-xs text-gray-500">Review the list before submission.</div>
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-2 rounded-lg ring-1 ring-emerald-200 text-emerald-700 bg-white hover:bg-emerald-50"
              @click="window.print()"
            >
              Print
            </button>
            <button
              class="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              @click="closeModal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

/* Sidebar logic */
const sidebarOpen = ref(false)
const route = useRoute()
const navActive = (path) => {
  const isActive = route.path === path
  return isActive
    ? 'bg-emerald-50 text-emerald-900 font-extrabold relative before:content-[\'\'] before:absolute before:-left-1 before:h-6 before:w-1 before:rounded-full before:bg-emerald-500'
    : ''
}

/* Barangay registry data */
const seniors = ref([
  { id: 1, name: 'Juan Dela Cruz', age: 72, purok: 'Purok 1', validated: true },
  { id: 2, name: 'Maria Santos', age: 79, purok: 'Purok 5', validated: false },
  { id: 3, name: 'Pedro Reyes', age: 81, purok: 'Purok 2', validated: true },
  { id: 4, name: 'Carmen Lopez', age: 69, purok: 'Purok 7', validated: false },
  { id: 5, name: 'Gregorio Tan', age: 74, purok: 'Purok 4', validated: false },
  { id: 6, name: 'Luisa Manibo', age: 83, purok: 'Purok 6', validated: true }
])
let nextId = 7

/* Reactive state */
const toSubmit = reactive({})
const toSubmitList = computed(() =>
  Object.keys(toSubmit)
    .map((id) => seniors.value.find((s) => s.id === Number(id)))
    .filter(Boolean)
)

/* Registry actions */
function toggleValidate(id) {
  const s = seniors.value.find((x) => x.id === id)
  if (s) s.validated = !s.validated
}
function selectForSubmit(id) {
  if (!toSubmit[id]) toSubmit[id] = true
}
function submitToOSCA() {
  alert(`Submitted ${toSubmitList.value.length} seniors to OSCA.`)
  for (const id of Object.keys(toSubmit)) delete toSubmit[id]
}

/* Eligible seniors list (modal section) */
const eligibleSeniors = ref([
  {
    name: 'Marry Bersabal',
    srid: '24-001',
    barangay: 'Ampayon',
    statusLabel: 'Ready',
    status: 'ok',
    requirements: [
      { label: 'Government-issued ID (valid)', status: 'ok' },
      { label: 'Birth Certificate / PSA copy', status: 'ok' },
      { label: 'OSCA Registration Form (pending signature)', status: 'pending' },
      { label: '1×1 photo (recent)', status: 'ok' },
      { label: 'Proof of Residency (Barangay Cert.)', status: 'ok' }
    ]
  },
  {
    name: 'Eden Bughao',
    srid: '24-002',
    barangay: 'Ampayon',
    statusLabel: '1 pending',
    status: 'pending',
    requirements: [
      { label: 'Government-issued ID (valid)', status: 'ok' },
      { label: 'Birth Certificate / PSA copy', status: 'ok' },
      { label: 'OSCA Registration Form', status: 'ok' },
      { label: '1×1 photo (bring on submission day)', status: 'pending' },
      { label: 'Proof of Residency (Barangay Cert.)', status: 'ok' }
    ]
  },
  {
    name: 'Ramon Cruz',
    srid: '24-003',
    barangay: 'Ampayon',
    statusLabel: 'ID renew',
    status: 'pending',
    requirements: [
      { label: 'Government-issued ID (renewal needed)', status: 'pending' },
      { label: 'Birth Certificate / PSA copy', status: 'ok' },
      { label: 'OSCA Registration Form', status: 'ok' },
      { label: '1×1 photo (recent)', status: 'ok' },
      { label: 'Proof of Residency (Barangay Cert.)', status: 'ok' }
    ]
  }
])

/* Modal logic */
const search = ref('')
const showModal = ref(false)
const activeSenior = ref(null)

const filteredSeniors = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return eligibleSeniors.value
  return eligibleSeniors.value.filter((s) =>
    s.name.toLowerCase().includes(q)
  )
})

const progress = computed(() => {
  if (!activeSenior.value) return { ok: 0, total: 0, pct: 0 }
  const req = activeSenior.value.requirements
  const ok = req.filter((r) => r.status === 'ok').length
  const total = req.length
  const pct = total ? Math.round((ok / total) * 100) : 0
  return { ok, total, pct }
})

function openModal(senior) {
  activeSenior.value = senior
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}
function statusClass(senior) {
  return senior.status === 'ok'
    ? 'bg-emerald-600/10 text-emerald-700 ring-emerald-200'
    : 'bg-yellow-400/20 text-yellow-700 ring-yellow-200'
}
</script>


<style scoped>
@keyframes flash {
  0% { box-shadow: 0 0 0 0 rgba(16,185,129,.45); }
  100% { box-shadow: 0 0 0 16px rgba(16,185,129,0); }
}
.flash-row { animation: flash 1s ease-out 2; }

@keyframes pop-in {
  0% {
    transform: translateY(12px) scale(0.98);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
.animate-pop {
  animation: pop-in 0.18s ease-out both;
}
.ring-progress {
  --p: 0;
  background: conic-gradient(rgb(16 185 129) calc(var(--p) * 1%), #e7f5ef 0);
}
</style>
