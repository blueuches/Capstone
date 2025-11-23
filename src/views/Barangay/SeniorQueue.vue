<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <!-- Sidebar -->
    <Sidebar role="brgy" />

    <!-- Main -->
    <main class="flex-1 flex flex-col px-4 sm:px-6 py-4 gap-4">
      <!-- Header -->
      <header
        class="bg-white/90 backdrop-blur rounded-2xl shadow-sm px-5 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border border-emerald-100"
      >
        <div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-emerald-700 tracking-tight">
            Senior Management
          </h1>
          <p class="text-xs sm:text-sm text-emerald-800/80">

            · Manage senior list
          </p>
        </div>

        <div class="flex items-center gap-3 mt-2 sm:mt-0">
          <p class="hidden sm:block text-xs text-emerald-800/70">
            Total seniors in system:
            <span class="font-semibold text-emerald-900">{{ seniors.length }}</span>
          </p>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/80 transition"
            @click="refreshSeniors"
            :disabled="seniorsLoading || ctxLoading"
          >
            <svg class="h-4 w-4 animate-spin" v-if="seniorsLoading || ctxLoading" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8v4l3-3-3-3v4a10 10 0 0 0-10 10h4z"
              />
            </svg>
            <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 4v6h6M20 20v-6h-6M5 19a8 8 0 0 0 13.657-2M19 5A8 8 0 0 0 5.343 7"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Refresh
          </button>
        </div>
      </header>

      <!-- Content -->
      <div class="grid lg:grid-cols-3 gap-4 lg:gap-6 items-start">
        <!-- Senior Registry -->
        <section
          class="lg:col-span-2 bg-white/95 backdrop-blur rounded-2xl shadow-sm border border-emerald-100 p-4 md:p-6 space-y-4"
        >
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-xl md:text-2xl font-bold text-emerald-800">Senior Registry</h2>
              <p class="text-xs sm:text-sm text-emerald-800/70">
                Seniors already registered in the system for this barangay.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <div class="relative">
                <input
                  v-model="searchTerm"
                  type="text"
                  class="w-48 sm:w-60 rounded-xl border border-emerald-100 bg-emerald-50/40 px-3 py-2 pl-8 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  placeholder="Search name or address…"
                />
                <svg
                  class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-500"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.7" />
                  <path d="m16 16 3.5 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Loading / error / empty -->
          <div v-if="seniorsLoading || ctxLoading" class="py-10 flex items-center justify-center">
            <p class="text-sm text-emerald-800/80">Loading seniors for your barangay…</p>
          </div>
          <div v-else-if="seniorsError" class="py-8 text-center">
            <p class="text-sm text-red-600">{{ seniorsError }}</p>
          </div>
          <div
            v-else-if="filteredSeniors.length === 0"
            class="py-10 flex flex-col items-center justify-center gap-2 text-center"
          >
            <p class="text-sm font-medium text-emerald-800">No seniors found.</p>
            <p class="text-xs text-emerald-800/70 max-w-sm">
              Once seniors from your barangay register or are encoded in the system, they will appear in this list.
            </p>
          </div>

          <!-- Table -->
          <div v-else class="rounded-2xl border border-emerald-100 overflow-hidden bg-emerald-50/40">
            <div class="max-h-[420px] overflow-auto custom-scroll">
              <table class="min-w-full text-xs sm:text-sm">
                <thead class="bg-emerald-50/70 sticky top-0 z-10">
                  <tr>
                    <th class="px-4 py-2 text-left font-semibold text-emerald-900">Name</th>
                    <th class="px-3 py-2 text-left font-semibold text-emerald-900">Age</th>
                    <th class="px-3 py-2 text-left font-semibold text-emerald-900">Contact</th>
                    <th class="px-3 py-2 text-center font-semibold text-emerald-900">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-emerald-100/70 bg-white">
                  <tr
                    v-for="senior in filteredSeniors"
                    :key="senior.id"
                    class="hover:bg-emerald-50/60 transition"
                  >
                    <td class="px-4 py-2 font-medium text-emerald-900">
                      <div class="flex flex-col">
                        <span>{{ senior.name || 'Unnamed Senior' }}</span>
                        <span class="text-[11px] text-emerald-800/70">
                          OSCA: {{ senior.osca_id || '—' }} · RRN: {{ senior.rrn || '—' }}
                        </span>
                      </div>
                    </td>
                    <td class="px-3 py-2 text-emerald-800">
                      {{ senior.age ?? '—' }}
                    </td>
                    <td class="px-3 py-2 text-emerald-800/90">
                      {{ formatAddress(senior) || '—' }}
                    </td>
                    <td class="px-3 py-2 text-emerald-800/90">
                      {{ senior.phone || '—' }}
                    </td>
                    <td class="px-3 py-2 text-center">
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition"
                        @click="openRequirementsModal(senior)"
                      >
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M4 12s2.5-5 8-5 8 5 8 5-2.5 5-8 5-8-5-8-5Z"
                            stroke="currentColor"
                            stroke-width="1.6"
                          />
                          <circle cx="12" cy="12" r="2.4" stroke="currentColor" stroke-width="1.6" />
                        </svg>
                        View Requirements
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- To Submit to OSCA (Manual List) -->
        <section
          class="lg:col-span-1 bg-white/95 backdrop-blur rounded-2xl shadow-sm border border-emerald-100 p-4 md:p-6 space-y-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-xl font-bold text-emerald-800">Senior List</h2>
              <p class="text-xs sm:text-sm text-emerald-800/75">
                This is a
                <span class="font-semibold">manual list</span> for seniors in your barangay
                <span class="italic">with or without</span> a SeniorGo account.
              </p>
            </div>
            <span
              class="inline-flex items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-[11px] px-3 py-1 border border-emerald-100"
            >
              {{ manualList.length }} in list
            </span>
          </div>

          <!-- Manual add form -->
          <div class="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3 space-y-3">
            <div class="grid grid-cols-1 gap-2">
              <div class="space-y-1">
                <label class="block text-[11px] font-semibold text-emerald-900">Senior name</label>
                <input
                  v-model="manualName"
                  type="text"
                  class="w-full rounded-xl border border-emerald-100 bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  placeholder="e.g. Juan Dela Cruz"
                />
              </div>

              <div class="space-y-1">
                <label class="block text-[11px] font-semibold text-emerald-900">
                  Notes / Reference (optional)
                </label>
                <input
                  v-model="manualNotes"
                  type="text"
                  class="w-full rounded-xl border border-emerald-100 bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  placeholder="e.g. Purok 3 · OSCA temp ID, etc."
                />
              </div>
            </div>

            <button
              type="button"
              class="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold py-2 hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              @click="addManualEntry"
              :disabled="!manualName.trim()"
            >
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
              </svg>
              Add to manual list
            </button>
          </div>

          <!-- Manual list display -->
          <div
            v-if="manualList.length"
            class="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3 space-y-3 max-h-[260px] overflow-auto custom-scroll"
          >
            <p class="text-[11px] text-emerald-800/80">
              These names will be included in your next OSCA submission form.
            </p>

            <ul class="space-y-2">
              <li
                v-for="item in manualList"
                :key="item.id"
                class="flex items-start justify-between gap-2 rounded-xl bg-white px-3 py-2 border border-emerald-100"
              >
                <div class="flex-1">
                  <p class="text-xs font-semibold text-emerald-900 leading-tight">
                    {{ item.name }}
                  </p>
                  <p v-if="item.notes" class="text-[11px] text-emerald-800/75 mt-0.5">
                    {{ item.notes }}
                  </p>
                </div>
                <button
                  type="button"
                  class="mt-0.5 inline-flex items-center justify-center h-6 w-6 rounded-full text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100"
                  @click="removeManualEntry(item.id)"
                >
                  ✕
                </button>
              </li>
            </ul>
          </div>

          <div v-else class="pt-2 text-[11px] text-emerald-800/70">
            No names added yet. Use this section for seniors who are not yet in the system but are already
            eligible.
          </div>
        </section>
      </div>

      <!-- Requirements Modal -->
      <transition name="fade-zoom">
        <div
          v-if="showRequirementsModal"
          class="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto"
        >
          <div
            class="absolute inset-0 bg-black/30 backdrop-blur-sm"
            @click="closeRequirementsModal"
          ></div>

          <div
            class="relative max-w-3xl w-full mx-auto mt-16 sm:mt-20 mb-10 bg-white/95 backdrop-blur rounded-2xl shadow-2xl ring-1 ring-emerald-100 animate-pop"
          >
            <!-- Header -->
            <div class="px-5 py-4 border-b flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div
                  class="h-9 w-9 rounded-xl bg-emerald-600/10 text-emerald-700 grid place-items-center ring-1 ring-emerald-200"
                >
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 4h14v16H5z"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9 8h6M9 12h6M9 16h3"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base sm:text-lg font-extrabold text-emerald-800">
                    Requirements —
                    <span>{{ activeSenior?.name || 'Senior' }}</span>
                  </h3>
                  <p class="text-[11px] text-emerald-800/70">
                    OSCA: {{ activeSenior?.osca_id || '—' }} · RRN: {{ activeSenior?.rrn || '—' }}
                  </p>
                </div>
              </div>

              <button
                class="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50"
                @click="closeRequirementsModal"
              >
                ✕
              </button>
            </div>

            <!-- Body -->
            <div class="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
              <!-- Summary -->
              <section class="md:col-span-1 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-3">
                <h4 class="text-xs font-semibold text-emerald-900 tracking-wide uppercase">
                  Latest Request
                </h4>

                <div v-if="requirementsLoading" class="py-6 text-xs text-emerald-800/80">
                  Loading submitted requirements…
                </div>

                <div v-else-if="requirementsError" class="py-4 text-xs text-red-600">
                  {{ requirementsError }}
                </div>

                <div v-else-if="!activeRequestSummary">
                  <p class="text-xs text-emerald-800/80">
                    No request found yet for this senior. Once they submit an application, their uploaded
                    documents will appear here.
                  </p>
                </div>

                <div v-else class="space-y-2 text-xs text-emerald-900">
                  <p class="flex items-center justify-between">
                    <span class="text-emerald-800/75">Request ID</span>
                    <span class="font-semibold">{{ activeRequestSummary.id }}</span>
                  </p>
                  <p class="flex items-center justify-between">
                    <span class="text-emerald-800/75">Status</span>
                    <span
                      class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      :class="statusBadgeClass(activeRequestSummary.status)"
                    >
                      <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                      {{ activeRequestSummary.status || '—' }}
                    </span>
                  </p>
                  <p class="flex items-center justify-between">
                    <span class="text-emerald-800/75">Submitted at</span>
                    <span class="font-semibold">
                      {{ formatDateTime(activeRequestSummary.submitted_at) || '—' }}
                    </span>
                  </p>
                </div>
              </section>

              <!-- Requirements list -->
              <section class="md:col-span-2 rounded-xl border border-emerald-100 bg-white p-4 space-y-3">
                <div class="flex items-center justify-between gap-3">
                  <h4 class="text-xs font-semibold text-emerald-900 tracking-wide uppercase">
                    Uploaded Documents
                  </h4>
                </div>

                <div v-if="requirementsLoading" class="py-6 text-xs text-emerald-800/80">
                  Please wait…
                </div>

                <div
                  v-else-if="!requirements.length && activeRequestSummary"
                  class="py-6 text-xs text-emerald-800/80"
                >
                  No files uploaded yet for this request.
                </div>

                <div
                  v-else-if="!requirements.length && !activeRequestSummary"
                  class="py-6 text-xs text-emerald-800/80"
                >
                  No requirements found.
                </div>

                <ul v-else class="space-y-2 max-h-72 overflow-auto custom-scroll">
                  <li
                    v-for="doc in requirements"
                    :key="doc.id"
                    class="flex items-start justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50/40 px-3 py-2.5"
                  >
                    <div class="flex items-start gap-2">
                      <div
                        class="h-7 w-7 rounded-lg bg-emerald-600/10 text-emerald-700 grid place-items-center ring-1 ring-emerald-200"
                      >
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M7 4h7l4 4v12H7z"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M14 4v4h4"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <p class="text-xs font-semibold text-emerald-900">
                          {{ doc.kind || 'Requirement' }}
                        </p>
                        <p class="text-[11px] text-emerald-800/75 break-all">
                          {{ doc.file_path || '—' }}
                        </p>
                      </div>
                    </div>
                    <div class="text-right text-[11px] text-emerald-800/70">
                      <p class="font-medium">
                        {{ formatDateTime(doc.uploaded_at) || '—' }}
                      </p>
                    </div>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/supabase/client'
import { useBarangayContext } from '@/composables/useBarangayContext'

type SeniorProfile = {
  id: number
  name: string | null
  age: number | null
  purok?: string | null
  phone: string | null
  osca_id: string | null
  rrn: string | null
  house_no: string | null
  street: string | null
  city: string | null
  province: string | null
  zip: string | null
  _raw?: any
}

type RequestSummary = {
  id: number
  status: string | null
  submitted_at: string | null
  created_at?: string | null
}

type RequirementDoc = {
  id: number
  kind: string | null
  file_path: string | null
  uploaded_at: string | null
}

/* Barangay context */
const { loading: ctxLoading, barangayId, barangayName, fetchContext } = useBarangayContext()

/* Senior registry from Supabase */
const seniors = ref<SeniorProfile[]>([])
const seniorsLoading = ref(false)
const seniorsError = ref<string | null>(null)

const searchTerm = ref('')

function calculateAge(birthdate: string | null): number | null {
  if (!birthdate) return null
  const d = new Date(birthdate)
  if (Number.isNaN(d.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) {
    age--
  }
  return age
}

async function loadSeniors() {
  seniorsError.value = null
  seniorsLoading.value = true
  try {
    if (!barangayId.value) {
      const ctx = await fetchContext()
      if (!ctx.barangayId) throw new Error('No barangay context found for this user.')
    }

    const { data, error } = await supabase
      .from('SeniorProfiles_v1')
      .select(
        `
        user_id,
        full_name,
        username,
        phone,
        senior_id,
        osca_id,
        rrn,
        birthdate,
        sex,
        house_no,
        street,
        barangay_id,
        city,
        province,
        zip,
        senior_created_at,
        age
      `
      )
      .eq('barangay_id', barangayId.value)

    if (error) throw error

    seniors.value = (data || []).map((row: any) => ({
      id: row.senior_id,
      name: row.full_name,
      age: row.age ?? calculateAge(row.birthdate),
      purok: row.street || row.house_no || null,
      phone: row.phone,
      osca_id: row.osca_id,
      rrn: row.rrn,
      house_no: row.house_no,
      street: row.street,
      city: row.city,
      province: row.province,
      zip: row.zip,
      _raw: row
    }))
  } catch (err: any) {
    console.error(err)
    seniorsError.value = err?.message || 'Failed to load seniors.'
  } finally {
    seniorsLoading.value = false
  }
}

const filteredSeniors = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return seniors.value
  return seniors.value.filter(s => {
    const name = (s.name || '').toLowerCase()
    const addr = (formatAddress(s) || '').toLowerCase()
    return name.includes(term) || addr.includes(term)
  })
})

function formatAddress(s: SeniorProfile): string {
  const parts = [s.house_no, s.street, s.city, s.province, s.zip].filter(Boolean)
  return parts.join(', ')
}

function refreshSeniors() {
  loadSeniors()
}

/* Manual To Submit list */
const manualName = ref('')
const manualNotes = ref('')
const manualList = ref<{ id: number; name: string; notes: string }[]>([])
let manualIdCounter = 1

function addManualEntry() {
  if (!manualName.value.trim()) return
  manualList.value.push({
    id: manualIdCounter++,
    name: manualName.value.trim(),
    notes: manualNotes.value.trim()
  })
  manualName.value = ''
  manualNotes.value = ''
}

function removeManualEntry(id: number) {
  manualList.value = manualList.value.filter(item => item.id !== id)
}

/* Requirements modal */
const showRequirementsModal = ref(false)
const activeSenior = ref<(SeniorProfile & { osca_id?: string | null; rrn?: string | null }) | null>(null)
const activeRequestSummary = ref<RequestSummary | null>(null)
const requirements = ref<RequirementDoc[]>([])
const requirementsLoading = ref(false)
const requirementsError = ref<string | null>(null)

async function openRequirementsModal(senior: SeniorProfile) {
  activeSenior.value = senior
  showRequirementsModal.value = true
  requirementsLoading.value = true
  requirementsError.value = null
  activeRequestSummary.value = null
  requirements.value = []

  try {
    // 1) Get latest request for this senior
    const { data: reqs, error: rErr } = await supabase
      .from('requests')
      .select('id, status, submitted_at, created_at')
      .eq('senior_id', senior.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (rErr) throw rErr

    const req = reqs && reqs.length > 0 ? (reqs[0] as RequestSummary) : null
    activeRequestSummary.value = req

    if (!req) {
      requirements.value = []
      return
    }

    // 2) Get documents for that request
    const { data: docs, error: dErr } = await supabase
      .from('request_documents')
      .select('id, kind, file_path, uploaded_at')
      .eq('request_id', req.id)

    if (dErr) throw dErr

    requirements.value = (docs || []) as RequirementDoc[]
  } catch (err: any) {
    console.error(err)
    requirementsError.value = err?.message || 'Failed to load requirements.'
  } finally {
    requirementsLoading.value = false
  }
}

function closeRequirementsModal() {
  showRequirementsModal.value = false
}

function formatDateTime(value: string | null): string | null {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function statusBadgeClass(status: string | null) {
  const s = (status || '').toLowerCase()
  if (s === 'approved' || s === 'ok') {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  }
  if (s === 'pending' || s === 'submitted') {
    return 'bg-amber-50 text-amber-700 border border-amber-200'
  }
  if (s === 'rejected' || s === 'returned') {
    return 'bg-rose-50 text-rose-700 border border-rose-200'
  }
  return 'bg-slate-50 text-slate-700 border border-slate-200'
}

onMounted(loadSeniors)
</script>

<style scoped>
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(16, 185, 129, 0.6) transparent;
}
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.6);
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}

@keyframes pop-in {
  0% {
    transform: translateY(8px) scale(0.96);
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

.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>