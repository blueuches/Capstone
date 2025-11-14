<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <Sidebar role="osca" />

       <main class="flex-1 p-7 md:ml-100">

      <!-- Filter -->
      <section class="bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 class="text-lg font-semibold text-gray-800">Filter Applications</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Select Barangay</label>
<select class="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-emerald-600"
        v-model.number="filters.barangayId">
  <option :value="0">-- Choose Barangay --</option>
  <option v-for="b in barangays" :key="b.id" :value="b.id">{{ b.name }}</option>
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

      <!-- Table -->
      <section class="bg-white shadow-lg rounded-xl overflow-hidden mt-6">
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
              <tr v-if="loading">
                <td colspan="6" class="px-4 py-6 text-center text-sm text-gray-500">
                  Loading applications…
                </td>
              </tr>

              <tr
                v-for="app in filteredApps"
                :key="app.id"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-3 font-semibold text-gray-800">{{ app.name }}</td>
                <td class="px-4 py-3">{{ app.age ?? '—' }}</td>
                <td class="px-4 py-3">{{ app.barangay || '—' }}</td>
                <td class="px-4 py-3">{{ app.submitted }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 text-xs rounded-full" :class="badgeClass(app.status)">
                    {{ app.status }}
                  </span>
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

                  >
                    Approve
                  </button>
                  <button
                    class="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Decline
                  </button>
                  <button
                    class="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                  >
                    Follow-Up
                  </button>
                </td>
              </tr>

              <tr v-if="!loading && filteredApps.length === 0">
                <td colspan="6" class="px-4 py-6 text-center text-sm text-gray-500">
                  No matching applications.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <!-- Modal (kept, will show basic info) -->
    <div v-if="modal.open" class="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="closeModal"></div>

      <div class="relative max-w-3xl mx-auto mt-16 sm:mt-24 bg-white/90 backdrop-blur rounded-2xl shadow-2xl ring-1 ring-emerald-100 animate-pop">
        <div class="px-5 py-4 border-b flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-xl bg-emerald-600/10 text-emerald-700 grid place-items-center ring-1 ring-emerald-200">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11.5 7.5 10l-1 1 2.5 2.5L17 6.5l-1-1z"/></svg>
            </div>
            <div>
              <h3 class="text-lg font-extrabold text-emerald-700">
                Requirements — {{ modal.app?.name }}
              </h3>
              <p class="text-xs text-gray-500">
                SR-ID: {{ modal.app?.id }} • Barangay {{ modal.app?.barangay || '—' }}
              </p>
            </div>
          </div>
          <button class="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50" @click="closeModal">✕</button>
        </div>

        <!-- Body (leave simple; the full answers are in Review Workspace) -->
        <div class="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          <section class="md:col-span-1 rounded-xl border p-4 bg-white">
            <h4 class="text-sm font-semibold text-emerald-700 mb-2">Applicant</h4>
            <div class="text-sm text-gray-700 space-y-1">
              <div><b>Name:</b> {{ modal.app?.name }}</div>
              <div><b>Age:</b> {{ modal.app?.age ?? '—' }}</div>
              <div><b>Barangay:</b> {{ modal.app?.barangay || '—' }}</div>
              <div><b>Status:</b> {{ modal.app?.status }}</div>
            </div>
          </section>
          <section class="md:col-span-2 rounded-xl border p-4 bg-white">
            <h4 class="text-sm font-semibold text-emerald-700 mb-2">What’s next</h4>
            <p class="text-sm text-gray-700">
              Use <b>Open in Review Workspace</b> to see the senior’s actual form answers and documents.
            </p>
          </section>
        </div>

        <div class="px-5 py-4 border-t bg-white/80 rounded-b-2xl flex items-center justify-between">
          <div class="text-xs text-gray-500">Review the application and proceed.</div>
          <div class="flex items-center gap-2">
<RouterLink
  class="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
  :to="{ name: 'OscaReview', params: { programId: modal.app?.programId, requestId: modal.app?.id } }"
>
  Open in Review Workspace
</RouterLink>

            <button class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200" @click="closeModal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { RouterLink } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/supabase/client'

/* ----------------- Types ----------------- */
type AppRow = {
  id: number
  programId: number
  seniorId: number
  name: string
  age: number | string
  barangay: string
  submitted: string
  status: string
}

type BrgyRow = { id: number; name: string }

/* ----------------- State ----------------- */
const applications = ref<AppRow[]>([])
const loading = ref(false)
const loadError = ref<string | null>(null)

/** Filters (bind barangay dropdown to ID via v-model.number) */
const filters = ref<{ barangayId: number; query: string; programId: number | null }>({
  barangayId: 0,
  query: '',
  programId: null, // set to a specific program id if you want to scope
})

/** Real Barangays for dropdown */
const barangays = ref<BrgyRow[]>([])

/* ----------------- Helpers ----------------- */
function ageFromDOB(dob?: string | null) {
  if (!dob) return '—'
  const d = new Date(dob)
  if (isNaN(+d)) return '—'
  const t = new Date()
  let a = t.getFullYear() - d.getFullYear()
  const m = t.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && t.getDate() < d.getDate())) a--
  return a
}
function fmtDate(s?: string | null) {
  if (!s) return '—'
  const d = new Date(s)
  return isNaN(+d)
    ? '—'
    : d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: '2-digit' })
}
function toUiStatus(dbStatus: string) {
  const s = String(dbStatus || '').toLowerCase()
  if (s === 'approved') return 'Approved'
  if (s === 'declined') return 'Declined'
  if (s === 'for_pickup' || s === 'released') return 'For Pickup'
  if (['submitted','in_review','pending'].includes(s)) return 'Pending'
  return 'Pending'
}

/* ----------------- Load Barangays (real) ----------------- */
async function loadBarangays() {
  const { data, error } = await supabase
    .from('Barangays')
    .select('id, name')
    .order('name', { ascending: true })
  if (error) {
    console.warn('loadBarangays:', error.message)
    barangays.value = []
    return
  }
  barangays.value = (data || []) as BrgyRow[]
}

/* ----------------- Load Applications via RPC -----------------
   RPC: osca_list_submitted_applicants(p_program_id, p_barangay_id, p_query)
---------------------------------------------------------------- */
async function loadApplications() {
  loading.value = true
  loadError.value = null
  applications.value = []
  try {
    const { barangayId, query, programId } = filters.value
    const { data, error } = await supabase.rpc('osca_list_submitted_applicants', {
      p_program_id:  programId ?? null,
      p_barangay_id: barangayId && barangayId !== 0 ? barangayId : null,
      p_query:       query?.trim() ? query.trim() : null,
    })
    if (error) throw error

    applications.value = (data || []).map((r: any): AppRow => ({
      id: r.request_id,
      programId: r.program_id,
      seniorId: r.senior_id,
      name: r.full_name || '—',
      age: ageFromDOB(r.birthdate),
      barangay: r.barangay_name || '—',
      submitted: fmtDate(r.submitted_at || r.created_at),
      status: toUiStatus(r.status),
    }))
  } catch (e: any) {
    console.error('loadApplications error:', e)
    loadError.value = e?.message || 'Failed to load applications'
  } finally {
    loading.value = false
  }
}

/* ----------------- Table wiring ----------------- */
const filteredApps = computed(() => applications.value) // server already filters

function badgeClass(status: string) {
  return {
    'Pending':    'bg-yellow-100 text-yellow-700',
    'Approved':   'bg-green-100 text-green-700',
    'Declined':   'bg-red-100 text-red-700',
    'For Pickup': 'bg-blue-100 text-blue-700',
  }[status] || 'bg-gray-100 text-gray-700'
}

/* ----------------- Modal (keep your existing template) ----------------- */
const modal = ref<{ open: boolean; app: AppRow | null; remarks: string }>({ open: false, app: null, remarks: '' })
function openModal(app: AppRow) { modal.value = { open: true, app, remarks: '' } }
function closeModal() { modal.value.open = false }
const progressTotal = computed(() => 0)
const progressOk = computed(() => 0)
const progressPct = computed(() => 0)

/* ----------------- Lifecycle ----------------- */
onMounted(async () => {
  await loadBarangays()
  await loadApplications()
})

// Re-run when filters change
watch(filters, () => { loadApplications() }, { deep: true })

// ESC to close modal
function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && modal.value.open) closeModal() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>




