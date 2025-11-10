<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <Sidebar role="brgy" />

    <!-- Main Content -->
    <main class="flex-1 p-6 md:ml-64">
      <!-- Topbar -->
      <div class="flex items-center justify-between mb-6">
        <button
          class="md:hidden text-emerald-700 focus-ring"
          aria-label="Toggle menu"
          @click="sidebarOpen = !sidebarOpen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-extrabold text-emerald-700 tracking-tight">
            Barangay {{ loading ? 'Loading…' : (barangayName || 'Barangay') }}
          </h1>          <span class="hidden sm:inline text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">Design-only</span>
        </div>
      </div>

      <!-- Welcome -->
      <div class="bg-white/90 backdrop-blur rounded-3xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between animate-float">
        <p class="text-gray-700 text-base">
          Welcome, <span class="font-semibold text-emerald-700">Barangay Personnel</span>
        </p>
        <div class="mt-3 md:mt-0 flex items-center gap-2">
          <span class="text-xs text-gray-500">Quick actions:</span>
          <button class="px-3 py-1.5 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 hover:bg-emerald-100">Refresh</button>
          <button class="px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700">Guide</button>
        </div>
      </div>

      <!-- Stats Section -->
      <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <!-- Total Seniors -->
        <div
          class="group relative overflow-hidden rounded-2xl shadow bg-white p-6 text-center ring-1 ring-emerald-100 hover:ring-emerald-200 hover:shadow-xl transition cursor-pointer focus-within:ring-2 focus-within:ring-emerald-400 animate-float"
          role="button" tabindex="0" title="View the total seniors"
        >
          <span class="ribbon"></span>
          <div class="corner-bubble"></div>
          <div class="mx-auto mb-2 h-10 w-10 rounded-xl grid place-items-center bg-emerald-50 ring-1 ring-emerald-100">
            <svg class="h-5 w-5 text-emerald-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5m0 2c-5.33 0-8 2.667-8 5v1h16v-1c0-2.333-2.67-5-8-5"/>
            </svg>
          </div>
          <h2 class="text-emerald-700 text-4xl font-extrabold group-hover:scale-105 transition">50</h2>
          <p class="text-gray-600 mt-1">Total Seniors</p>
          <div class="mt-3">
            <div class="w-full h-2 bg-emerald-100 rounded-full">
              <div class="h-2 bg-emerald-500 rounded-full w-[65%]"></div>
            </div>
            <p class="text-[11px] text-gray-500 mt-1">Growth this quarter: +12%</p>
          </div>
          <router-link to="/barangay/senior-queue" class="mt-3 inline-flex items-center gap-1 text-sm text-emerald-700">
            View the total seniors
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 10a1 1 0 0 1 1-1h6.586l-2.293-2.293A1 1 0 0 1 12.707 5.293l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 1 1-1.414-1.414L13.586 11H7a1 1 0 0 1-1-1z" clip-rule="evenodd"/></svg>
          </router-link>
        </div>

        <!-- OSCA-Validated -->
        <div
          class="group relative overflow-hidden rounded-2xl shadow bg-white p-6 text-center ring-1 ring-emerald-100 hover:ring-emerald-200 hover:shadow-xl transition cursor-pointer focus-within:ring-2 focus-within:ring-emerald-400 animate-float"
          role="button" tabindex="0" title="View seniors validated by OSCA from the barangay who submitted"
        >
          <span class="ribbon"></span>
          <div class="corner-bubble"></div>
          <div class="mx-auto mb-2 h-10 w-10 rounded-xl grid place-items-center bg-emerald-50 ring-1 ring-emerald-100">
            <svg class="h-5 w-5 text-emerald-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1.75a10.25 10.25 0 1 0 10.25 10.25A10.262 10.262 0 0 0 12 1.75Zm-1.03 14.28-4-4a1 1 0 1 1 1.41-1.42l3.29 3.3 6.29-6.3a1 1 0 0 1 1.42 1.42l-7 7a1 1 0 0 1-1.41 0Z"/>
            </svg>
          </div>
          <h2 class="text-emerald-700 text-4xl font-extrabold group-hover:scale-105 transition">25</h2>
          <p class="text-gray-600 mt-1">OSCA-Validated (From Submitted)</p>
          <div class="mt-3">
            <div class="w-full h-2 bg-emerald-100 rounded-full">
              <div class="h-2 bg-emerald-500 rounded-full w-[80%]"></div>
            </div>
            <p class="text-[11px] text-gray-500 mt-1">80% of submitted are Eligible</p>
          </div>
          <router-link to="/barangay/senior-queue" class="mt-3 inline-flex items-center gap-1 text-sm text-emerald-700">
            View validated by OSCA from submitted
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 10a1 1 0 0 1 1-1h6.586l-2.293-2.293A1 1 0 0 1 12.707 5.293l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 1 1-1.414-1.414L13.586 11H7a1 1 0 0 1-1-1z" clip-rule="evenodd"/></svg>
          </router-link>
        </div>

        <!-- Current Applicants -->
        <div
          class="group relative overflow-hidden rounded-2xl shadow bg-white p-6 text-center ring-1 ring-emerald-100 hover:ring-emerald-200 hover:shadow-xl transition cursor-pointer focus-within:ring-2 focus-within:ring-emerald-400 animate-float"
          role="button" tabindex="0" title="View the current applicants"
        >
          <span class="ribbon"></span>
          <div class="corner-bubble"></div>
          <div class="mx-auto mb-2 h-10 w-10 rounded-xl grid place-items-center bg-emerald-50 ring-1 ring-emerald-100">
            <svg class="h-5 w-5 text-emerald-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 6h-3.586l-1.707-1.707A.996.996 0 0 0 14 4h-4a.996.996 0 0 0-.707.293L7.586 6H4a2 2 0 0 0-2 2v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8a2 2 0 0 0-2-2Zm-1 11h-3.382a2 2 0 0 1-1.789-1.106l-.658-1.316a1 1 0 0 0-.894-.578h-1.574a1 1 0 0 0-.894.553l-.71 1.42A2 2 0 0 1 6.382 17H3v-6h18v6Z"/>
            </svg>
          </div>
          <h2 class="text-emerald-700 text-4xl font-extrabold group-hover:scale-105 transition">25</h2>
          <p class="text-gray-600 mt-1">Current Applications</p>
          <p class="text-[11px] text-gray-500 mt-1">Awaiting OSCA action</p>
          <router-link to="/barangay/senior-queue" class="mt-3 inline-flex items-center gap-1 text-sm text-emerald-700">
            View the current applicants
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 10a1 1 0 0 1 1-1h6.586l-2.293-2.293A1 1 0 0 1 12.707 5.293l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 1 1-1.414-1.414L13.586 11H7a1 1 0 0 1-1-1z" clip-rule="evenodd"/></svg>
          </router-link>
        </div>
      </section>

      <!-- Timeline / Posts -->
      <section class="bg-white/90 backdrop-blur rounded-3xl shadow p-6 ring-1 ring-emerald-100 animate-float">
        <div class="flex items-center gap-2 mb-6">
          <div class="h-9 w-9 rounded-xl bg-emerald-600/10 text-emerald-700 grid place-items-center ring-1 ring-emerald-200">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3zm0 5h12v2H3zm0 5h18v2H3z"/></svg>
          </div>
          <h2 class="text-2xl font-bold text-emerald-700">Events and Announcements</h2>
        </div>

        <div class="space-y-6 border-l-4 border-emerald-400 pl-6">
          <div class="relative">
            <span class="absolute -left-[34px] top-1 h-6 w-6 rounded-full bg-emerald-500 grid place-items-center text-white text-xs shadow">1</span>
            <h3 class="font-bold text-lg text-emerald-700">Applications Forwarded</h3>
            <p class="text-gray-700">All submitted applications from your barangay have been forwarded to OSCA for review.</p>
            <p class="text-sm text-gray-500 mt-1">Today • 10:30 AM</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <span class="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">Forwarded</span>
              <span class="text-[11px] px-2 py-1 rounded-full bg-white text-gray-600 ring-1 ring-gray-200">Batch A-12</span>
            </div>
          </div>

          <div class="relative">
            <span class="absolute -left-[34px] top-1 h-6 w-6 rounded-full bg-emerald-500 grid place-items-center text-white text-xs shadow">2</span>
            <h3 class="font-bold text-lg text-emerald-700">Eligibility Status</h3>
            <p class="text-gray-700">OSCA marked 8 out of 12 as <span class="font-semibold text-emerald-700">Eligible</span>. Others pending requirements.</p>
            <p class="text-sm text-gray-500 mt-1">Yesterday • 3:15 PM</p>
            <div class="mt-3 flex gap-2">
              <span class="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">Eligible 8</span>
              <span class="text-[11px] px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200">Pending 4</span>
            </div>
          </div>

          <div class="relative">
            <span class="absolute -left-[34px] top-1 h-6 w-6 rounded-full bg-emerald-500 grid place-items-center text-white text-xs shadow">3</span>
            <h3 class="font-bold text-lg text-emerald-700">System Maintenance</h3>
            <p class="text-gray-700">SeniorGo will undergo scheduled maintenance on March 10 at 9:00 AM.</p>
            <p class="text-sm text-gray-500 mt-1">2 days ago • 8:00 AM</p>
            <div class="mt-3 flex gap-2">
              <span class="text-[11px] px-2 py-1 rounded-full bg-white text-gray-600 ring-1 ring-gray-200">Notice</span>
              <span class="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">No downtime for queue</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/supabase/client'
import { useBarangayContext } from '@/composables/useBarangayContext'

const sidebarOpen = ref(false)
const route = useRoute()

// Active nav helper (adds bg + bold + indicator bar)
const navActive = (path) => {
  const isActive = route.path === path
  return isActive
    ? 'bg-emerald-50 text-emerald-900 font-extrabold relative before:content-[\'\'] before:absolute before:-left-1 before:h-6 before:w-1 before:rounded-full before:bg-emerald-500'
    : ''
}

const stats = ref({ seniors: 0, validatedFromSubmitted: 0, currentApplicants: 0 })
const { loading, orgId, barangayId, barangayName, fetchContext } = useBarangayContext()

onMounted(async () => {
  // 1) Resolve barangay + org context
  const ctx = await fetchContext()

  // 2) Load KPIs scoped to barangay/org
  await Promise.all([
    loadSeniorsCount(),           // by barangay_id
    loadValidatedFromSubmitted(), // by orgId & status
    loadCurrentApplicants(),      // by orgId & status
  ])
})

// Seniors that belong to this barangay
async function loadSeniorsCount() {
  if (!barangayId.value) return
  const { count } = await supabase
    .from('SeniorCitizens')
    .select('id', { count: 'exact', head: true })
    .eq('barangay_id', barangayId.value)
  stats.value.seniors = count || 0
}

// Requests validated (example: status 'approved') from those submitted by this org
async function loadValidatedFromSubmitted() {
  if (!orgId.value) return
  const { count } = await supabase
    .from('Requests')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', orgId.value)
    .eq('status', 'approved')
  stats.value.validatedFromSubmitted = count || 0
}

// Requests currently awaiting OSCA action (example: 'submitted'/'in_review')
async function loadCurrentApplicants() {
  if (!orgId.value) return
  const { count } = await supabase
    .from('Requests')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', orgId.value)
    .in('status', ['submitted', 'in_review'])
  stats.value.currentApplicants = count || 0
}
</script>

<style>
/* Tailwind is assumed to be included in your app build */
/* tasteful micro-animations */
@keyframes float-in {
  0% { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.animate-float { animation: float-in .2s ease-out both; }

/* focus ring for keyboard users */
.focus-ring:focus { outline: none; box-shadow: 0 0 0 3px rgba(16,185,129,.35); }

/* kpi ribbon */
.ribbon {
  position: absolute; left: -32px; top: 14px;
  transform: rotate(-30deg);
  background: linear-gradient(90deg, #ecfdf5, #d1fae5);
  color: #065f46; font-weight: 700; font-size: 10px;
  padding: 4px 28px; border-radius: 999px; box-shadow: 0 1px 0 rgba(16,185,129,.2);
}

/* decorative corner */
.corner-bubble {
  position: absolute; right: -36px; top: -36px; width: 110px; height: 110px;
  border-radius: 9999px; background: #ecfdf5;
}
</style>
