<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <!-- Sidebar -->
    <Sidebar role="osca" />

    <!-- MAIN CONTENT -->
    <main class="flex-1 p-7 md:ml-100 space-y-6">
      <!-- PROGRAMS GRID (STEP 1) -->
      <section v-if="!selectedProgram">
        <header class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-2xl font-extrabold text-emerald-700">Application Review</h1>
            <p class="text-sm text-emerald-900/70 mt-1">
              Choose a program to see all senior applications submitted city-wide.
            </p>
          </div>
        </header>

        <div
          v-if="programs.length === 0 && !loadingPrograms"
          class="mt-8 text-sm text-slate-500"
        >
          No programs found. Please check your BAAS configuration.
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <button
            v-for="program in programs"
            :key="program.id"
            type="button"
            @click="selectProgram(program)"
            class="bg-white border border-emerald-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer transition-all text-left flex flex-col justify-between min-h-[140px]"
          >
            <div>
              <p class="text-[11px] uppercase tracking-wide text-emerald-500 font-semibold mb-1">
                {{ program.code }}
              </p>
              <h2 class="text-lg font-bold text-emerald-700 line-clamp-2">
                {{ program.name }}
              </h2>
              <p class="text-gray-600 text-sm mt-2 line-clamp-3">
                {{ program.description || 'No description provided.' }}
              </p>
            </div>
            <div class="mt-3 flex items-center justify-between text-[11px] text-emerald-900/70">
              <span class="inline-flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Ready for review
              </span>
            </div>
          </button>
        </div>
      </section>

      <!-- APPLICANTS LIST (STEP 2) -->
      <section v-else>
        <!-- Header + Filters -->
        <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div class="flex items-start gap-3">
            <button
              type="button"
              @click="resetProgram"
              class="mt-1 inline-flex items-center gap-2 bg-white border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full text-sm hover:bg-emerald-50 shadow-sm"
            >
              <span class="text-lg leading-none">←</span>
              Back to Programs
            </button>
            <div>
              <p class="text-xs uppercase tracking-wide text-emerald-500 font-semibold">
                Program
              </p>
              <h2 class="text-xl md:text-2xl font-extrabold text-emerald-800">
                {{ selectedProgram?.name }}
              </h2>
              <p class="text-xs md:text-sm text-emerald-900/70 mt-1">
                Showing
                <span class="font-semibold">{{ filteredApplicants.length }}</span>
                application<span v-if="filteredApplicants.length !== 1">s</span>
                from all barangays.
              </p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
            <!-- Search -->
            <div class="relative">
              <input
                v-model="search"
                type="text"
                placeholder="Search by name or Request ID"
                class="w-full sm:w-64 pl-9 pr-3 py-2 rounded-full border border-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-white shadow-sm"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                🔍
              </span>
            </div>

            <!-- Status filter (client-side) -->
            <select
              v-model="statusFilter"
              class="w-full sm:w-40 border border-emerald-200 rounded-full py-2 px-3 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="in_review">In review</option>
              <option value="reviewed">Reviewed</option>
              <option value="approved">Approved</option>
              <option value="needs_correction">Needs correction</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </header>

        <!-- Loading / Empty states -->
        <div v-if="loadingApplicants" class="mt-6 text-sm text-slate-500 flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></span>
          Loading applications…
        </div>

        <div
          v-else-if="filteredApplicants.length === 0"
          class="mt-8 text-sm text-slate-500 bg-white/70 border border-dashed border-emerald-200 rounded-2xl p-6 text-center"
        >
          <p class="font-semibold text-emerald-800 mb-1">No applications found</p>
          <p>
            There are no requests for this program
            <span v-if="search">matching your search and filters.</span>
            <span v-else>yet.</span>
          </p>
        </div>

        <!-- Applicants list -->
        <div v-else class="mt-4 space-y-3">
          <div
            v-for="app in filteredApplicants"
            :key="app.request_id"
            class="bg-white rounded-2xl shadow-sm border border-emerald-100 px-4 py-3 md:px-5 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <!-- Left: avatar + basic info -->
            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 md:w-11 md:h-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-sm md:text-base shrink-0"
              >
                {{ app.full_name ? app.full_name[0] : '?' }}
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <p class="font-semibold text-emerald-900 text-sm md:text-base">
                    {{ app.full_name || 'Unnamed senior' }}
                  </p>
                  <span class="text-[11px] text-slate-500">
                    #{{ app.request_id }}
                  </span>
                </div>
                <p class="text-xs text-slate-600 mt-0.5">
                  Barangay:
                  <span class="font-medium text-emerald-800">
                    {{ app.barangay_name || 'Not set' }}
                  </span>
                </p>
                <p class="text-xs text-slate-500 mt-0.5">
                  Submitted:
                  <span v-if="app.submitted_at">
                    {{ formatDate(app.submitted_at) }}
                  </span>
                  <span v-else>
                    {{ formatDate(app.created_at) }} (not yet submitted)
                  </span>
                </p>
              </div>
            </div>

            <!-- Right: status + action -->
            <div class="flex items-end md:items-center justify-between gap-3 md:gap-4">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide"
                :class="statusChipClass(app.status)"
              >
                {{ prettyStatus(app.status) }}
              </span>

              <button
                type="button"
                @click="goToReview(app)"
                class="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1"
              >
                <span>View Application</span>
                <span class="text-base leading-none">→</span>
              </button>
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

const programs = ref([])
const loadingPrograms = ref(false)

const selectedProgram = ref(null)

// applicants = normalized objects:
// { request_id, program_id, senior_id, status, submitted_at, created_at, full_name, barangay_name }
const applicants = ref([])
const loadingApplicants = ref(false)

// filters
const search = ref('')
const statusFilter = ref('all')

/* 1) Load programs */
onMounted(async () => {
  loadingPrograms.value = true
  const { data, error } = await supabase
    .from('Programs')
    .select('id, code, name, description')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error loading programs:', error)
  } else {
    programs.value = data || []
  }
  loadingPrograms.value = false
})

function resetProgram() {
  selectedProgram.value = null
  applicants.value = []
  search.value = ''
  statusFilter.value = 'all'
}

/* 2) Load applicants per program
   Simpler + more reliable: use Requests table directly.
*/
async function fetchApplicants() {
  if (!selectedProgram.value) return

  loadingApplicants.value = true
  applicants.value = []

  try {
    const programId = Number(selectedProgram.value.id)

    // Basic requests for this program (OSCA has osca_read_request policy)
    const { data: reqs, error: reqErr } = await supabase
      .from('Requests')
      .select('id, program_id, senior_id, status, submitted_at, created_at')
      .eq('program_id', programId)
      .order('submitted_at', { ascending: false })

    if (reqErr) {
      console.error('Error loading Requests:', reqErr)
      loadingApplicants.value = false
      return
    }

    const rows = reqs || []
    if (!rows.length) {
      loadingApplicants.value = false
      return
    }

    // Try to enrich with senior name + barangay using SeniorProfiles_v1 view.
    // If something fails, we still show the list (with "Unnamed senior").
    const seniorIds = Array.from(
      new Set(
        rows
          .map(r => r.senior_id)
          .filter(id => id !== null && id !== undefined)
      )
    )

    const profilesBySeniorId = {}

    if (seniorIds.length > 0) {
      try {
        const { data: profiles, error: profErr } = await supabase
          .from('SeniorProfiles_v1')
          // BAAS shows this view exists; we assume it exposes senior_id + barangay_name + full_name.
          .select('senior_id, full_name, barangay_name')
          .in('senior_id', seniorIds)

        if (profErr) {
          console.error('Error loading SeniorProfiles_v1:', profErr)
        } else if (profiles) {
          for (const p of profiles) {
            profilesBySeniorId[p.senior_id] = p
          }
        }
      } catch (err) {
        console.error('SeniorProfiles_v1 lookup failed, falling back to minimal data:', err)
      }
    }

    applicants.value = rows.map(r => {
      const prof = profilesBySeniorId[r.senior_id] || {}
      return {
        request_id: r.id,
        program_id: r.program_id,
        senior_id: r.senior_id,
        status: r.status,
        submitted_at: r.submitted_at,
        created_at: r.created_at,
        full_name: prof.full_name || null,
        barangay_name: prof.barangay_name || null
      }
    })
  } catch (err) {
    console.error('Error loading applicants:', err)
    applicants.value = []
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

/* 4) Helpers */
function formatDate(value) {
  if (!value) return '—'
  try {
    const d = new Date(value)
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return value
  }
}

function prettyStatus(status) {
  if (!status) return 'Unknown'
  const s = status.toLowerCase()
  if (s === 'draft') return 'Draft'
  if (s === 'submitted') return 'Submitted'
  if (s === 'in_review') return 'In review'
  if (s === 'reviewed') return 'Reviewed'
  if (s === 'approved') return 'Approved'
  if (s === 'needs_correction') return 'Needs correction'
  if (s === 'rejected') return 'Rejected'
  return status
}

function statusChipClass(status) {
  const s = (status || '').toLowerCase()
  if (s === 'approved') {
    return 'bg-emerald-100 text-emerald-800 border border-emerald-300'
  }
  if (s === 'submitted') {
    return 'bg-sky-100 text-sky-800 border border-sky-300'
  }
  if (s === 'in_review') {
    return 'bg-amber-100 text-amber-800 border border-amber-300'
  }
  if (s === 'needs_correction') {
    return 'bg-orange-100 text-orange-800 border border-orange-300'
  }
  if (s === 'rejected') {
    return 'bg-rose-100 text-rose-800 border border-rose-300'
  }
  if (s === 'draft') {
    return 'bg-slate-100 text-slate-700 border border-slate-300'
  }
  return 'bg-slate-100 text-slate-700 border border-slate-300'
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
