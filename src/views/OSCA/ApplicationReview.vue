<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <!-- Sidebar -->
    <Sidebar role="osca" />

    <!-- MAIN CONTENT -->
    <main class="flex-1 p-7 md:ml-100 space-y-6">
      <!-- STEP 1: CHOOSE PROGRAM -->
      <section v-if="!selectedProgram">
        <header class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-2xl font-extrabold text-emerald-700">Application Review</h1>
            <p class="text-sm text-emerald-900/70 mt-1">
              Choose a program to see all senior applications submitted across Butuan.
            </p>
          </div>
        </header>

        <div class="bg-white rounded-2xl shadow border border-emerald-100 p-4 md:p-6">
          <div class="flex items-center justify-between mb-4 gap-3">
            <h2 class="text-base font-semibold text-emerald-800">
              Available Programs
            </h2>
            <span
              v-if="loadingPrograms"
              class="inline-flex items-center gap-2 text-xs text-emerald-700"
            >
              <span class="w-3 h-3 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
              Loading programs…
            </span>
          </div>

          <!-- Empty + loading states -->
          <div v-if="!loadingPrograms && !programs.length" class="py-10 text-center text-sm text-emerald-900/70">
            No programs configured yet. Please coordinate with the system admin.
          </div>

          <!-- Programs grid -->
          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <button
              v-for="program in programs"
              :key="program.id"
              type="button"
              @click="selectProgram(program)"
              class="bg-white border border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all text-left flex flex-col justify-between rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1"
            >
              <div>
                <p class="text-[11px] uppercase tracking-wide text-emerald-500 font-semibold mb-1">
                  {{ program.code }}
                </p>
                <h3 class="text-sm font-bold text-emerald-900 line-clamp-2">
                  {{ program.name }}
                </h3>
                <p class="mt-2 text-xs text-emerald-900/70 line-clamp-3">
                  {{ program.description || 'No description provided.' }}
                </p>
              </div>

              <div class="mt-4 flex items-center justify-between text-[11px] text-emerald-900/70">
                <span class="inline-flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Click to view applicants
                </span>
                <span class="inline-flex items-center gap-1">
                  <span class="text-xs">Open</span>
                  <span class="text-base leading-none">→</span>
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      <!-- STEP 2: VIEW APPLICANTS FOR SELECTED PROGRAM -->
      <section v-else class="space-y-4">
        <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div class="space-y-1">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-xs text-emerald-700 hover:text-emerald-900 font-medium"
              @click="resetProgram"
            >
              <span class="text-base leading-none">←</span>
              Back to all programs
            </button>
            <div>
              <h1 class="text-2xl font-extrabold text-emerald-700">
                {{ selectedProgram.name }}
              </h1>
              <p class="text-xs text-emerald-900/70 mt-1">
                Reviewing senior applications for
                <span class="font-semibold">{{ selectedProgram.code }}</span>.
              </p>
            </div>
          </div>

          <div class="flex flex-col items-start md:items-end gap-1 text-xs text-emerald-900/70">
            <span class="font-semibold">
              Total loaded: {{ applicants.length }} application<span v-if="applicants.length !== 1">s</span>
            </span>
            <span v-if="search || statusFilter !== 'all'">
              Showing {{ filteredApplicants.length }} after filters
            </span>
          </div>
        </header>

        <div class="bg-white rounded-2xl shadow border border-emerald-100 p-4 md:p-6 space-y-4">
          <!-- Filters -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <!-- Search -->
            <div class="relative w-full md:max-w-xs">
              <span class="absolute left-3 top-2.5 text-emerald-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="11" cy="11" r="6" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </span>
              <input
                v-model="search"
                type="text"
                placeholder="Search by name or Request ID"
                class="w-full pl-9 pr-3 py-2 rounded-full border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-white shadow-sm text-sm"
              />
            </div>

            <!-- Status filter -->
            <div class="flex items-center gap-2 text-xs">
              <span class="text-emerald-900/80 font-medium">Status:</span>
              <select
                v-model="statusFilter"
                class="text-xs rounded-full border border-emerald-100 px-3 py-1 bg-emerald-50/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              >
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="in_review">In review</option>
                <option value="reviewed">Reviewed</option>
              </select>
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="loadingApplicants" class="space-y-3">
            <div
              v-for="n in 3"
              :key="n"
              class="animate-pulse rounded-2xl border border-emerald-50 bg-emerald-50/60 h-20"
            />
          </div>

          <!-- Empty state: no applicants at all -->
          <div
            v-else-if="!hasAnyApplicants"
            class="py-10 text-center text-sm text-emerald-900/70"
          >
            No submitted applications yet for this program.
          </div>

          <!-- Empty state: filters hide everything -->
          <div
            v-else-if="hasAnyApplicants && !filteredApplicants.length"
            class="py-10 text-center text-sm text-emerald-900/70"
          >
            No applications match your search or status filter.
          </div>

          <!-- Applicants list -->
          <div v-else class="space-y-3">
            <div
              v-for="app in filteredApplicants"
              :key="app.request_id"
              class="border border-emerald-100 rounded-2xl px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-emerald-50/40 hover:bg-emerald-50 transition-colors"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <p class="font-semibold text-sm text-emerald-900">
                    {{ app.full_name || 'Unnamed senior' }}
                  </p>
                  <span
                    v-if="app.barangay_name"
                    class="inline-flex items-center rounded-full bg-white/80 border border-emerald-100 px-2 py-0.5 text-[11px] text-emerald-800"
                  >
                    {{ app.barangay_name }}
                  </span>
                </div>

                <p class="text-[11px] text-emerald-900/70">
                  Request ID:
                  <span class="font-mono font-semibold text-emerald-800">
                    #{{ app.request_id }}
                  </span>
                </p>

                <div class="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-emerald-900/70">
                  <span>
                    Submitted:
                    <span class="font-medium">
                      {{ formatDateTime(app.submitted_at || app.created_at) }}
                    </span>
                  </span>
                  <span v-if="app.submitted_at && app.created_at">
                    Created:
                    <span class="font-medium">
                      {{ formatDateTime(app.created_at) }}
                    </span>
                  </span>
                </div>
              </div>

              <div class="flex flex-row md:flex-col items-end gap-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize"
                  :class="getStatusBadgeClass(app.status)"
                >
                  {{ app.status || 'Unknown' }}
                </span>

                <button
                  type="button"
                  @click="goToReview(app)"
                  class="inline-flex items-center gap-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1"
                >
                  <span>View Application</span>
                  <span class="text-base leading-none">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase/client'
import Sidebar from '@/components/Sidebar.vue'

const router = useRouter()

/* Programs */
const programs = ref([])
const loadingPrograms = ref(false)

/* Selected program + applicants */
const selectedProgram = ref(null)

const applicants = ref([]) // rows from osca_list_submitted_applicants
const loadingApplicants = ref(false)

/* Filters */
const search = ref('')
const statusFilter = ref('all')

/* 1) Load programs on mount */
onMounted(loadPrograms)

async function loadPrograms() {
  loadingPrograms.value = true
  try {
    const { data, error } = await supabase
      .from('programs') // use the lowercase view
      .select('id, code, name, description')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error loading programs:', error)
      programs.value = []
    } else {
      programs.value = data || []
    }
  } finally {
    loadingPrograms.value = false
  }
}

function resetProgram() {
  selectedProgram.value = null
  applicants.value = []
  search.value = ''
  statusFilter.value = 'all'
}

/* 2) Load applicants – get ALL, then filter by program_id in Vue */
async function fetchApplicants() {
  if (!selectedProgram.value) return

  loadingApplicants.value = true
  applicants.value = []

  try {
    const { data, error } = await supabase.rpc('osca_list_submitted_applicants', {
      p_program_id: null,      // ← let SQL return all programs
      p_barangay_id: null,
      p_query: null
    })

    if (error) {
      console.error('Error loading applicants via osca_list_submitted_applicants:', error)
      return
    }

    console.log('RPC raw data:', data)

    const programId = Number(selectedProgram.value.id)

    // Filter by program here
    applicants.value = (data || [])
      .filter(row => Number(row.program_id) === programId)
      .map(row => ({
        request_id: row.request_id,
        program_id: row.program_id,
        senior_id: row.senior_id,
        status: row.status,
        submitted_at: row.submitted_at,
        created_at: row.created_at,
        full_name: row.full_name,
        barangay_name: row.barangay_name
      }))
  } catch (err) {
    console.error('Unexpected error loading applicants:', err)
  } finally {
    loadingApplicants.value = false
  }
}

async function selectProgram(program) {
  selectedProgram.value = program
  search.value = ''
  statusFilter.value = 'all'
  await fetchApplicants()
}

/* 3) Filtering (client-side) */
const filteredApplicants = computed(() => {
  let items = applicants.value.slice()

  if (statusFilter.value !== 'all') {
    const s = statusFilter.value.toLowerCase()
    items = items.filter(a => (a.status || '').toLowerCase() === s)
  }

  const term = search.value.trim().toLowerCase()
  if (term) {
    items = items.filter(a => {
      const name = (a.full_name || '').toLowerCase()
      const idString = String(a.request_id || '')
      return name.includes(term) || idString.includes(term)
    })
  }

  return items
})

const hasAnyApplicants = computed(() => applicants.value.length > 0)

/* Helpers */
function getStatusBadgeClass(status) {
  const s = (status || '').toLowerCase()

  if (s === 'draft') {
    return 'bg-slate-100 text-slate-800 border border-slate-200'
  }
  if (s === 'submitted') {
    return 'bg-amber-100 text-amber-800 border border-amber-200'
  }
  if (s === 'in_review') {
    return 'bg-blue-100 text-blue-800 border border-blue-200'
  }
  if (s === 'reviewed') {
    return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
  }
  return 'bg-slate-100 text-slate-700 border border-slate-300'
}

function formatDateTime(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function goToReview(app) {
  if (!selectedProgram.value || !app?.request_id) return
  router.push({
    name: 'OscaReview',
    params: {
      programId: selectedProgram.value.id,
      requestId: app.request_id
    }
  })
}
</script>
