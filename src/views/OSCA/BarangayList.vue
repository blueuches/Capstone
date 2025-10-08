<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">

<aside
  class="fixed inset-y-0 left-0 bg-white/95 backdrop-blur shadow-lg flex flex-col justify-between py-6 z-50 transform transition-transform duration-300 w-64 md:relative md:translate-x-0 md:w-64"
  :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
>
  <div>
    <div class="px-4 flex items-center gap-2 mb-6">
      <h4 class="font-extrabold tracking-tight text-emerald-700">SeniorGo</h4>
    </div>

    <nav class="flex flex-col gap-2 w-full items-start px-2" id="nav">
      <!-- Dashboard -->
      <RouterLink
        to="/osca/dashboard"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/osca/dashboard')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Home / Dashboard Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-6v-6H10v6H4a1 1 0 0 1-1-1V9.5z" />
          </svg>
        </span>
        <span class="font-bold text-base">Dashboard</span>
      </RouterLink>

      <!-- View Barangays -->
      <RouterLink
        to="/osca/barangays"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/osca/barangays')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Map / Barangay Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6zM9 7.74v10.52l4 1.33V9.07L9 7.74z" />
          </svg>
        </span>
        <span class="font-bold text-base">View Barangays</span>
      </RouterLink>

      <!-- Review Seniors -->
      <RouterLink
        to="/osca/review"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/osca/review')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Checklist / Review Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 11.5L7.5 10l-1 1 2.5 2.5L17 6.5l-1-1L9 11.5zM4 4h16v2H4V4zm0 4h10v2H4V8zm0 4h6v2H4v-2zm0 4h8v2H4v-2z" />
          </svg>
        </span>
        <span class="font-bold text-base">Review Seniors</span>
      </RouterLink>

      <!-- Applicants -->
      <RouterLink
        to="/osca/applications"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/osca/applications')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Users Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5S5 6.34 5 8s1.34 3 3 3zm8 2c-1.5 0-4.5.75-4.5 2.25V18h9v-2.75C20.5 13.75 17.5 13 16 13zm-8 0c-1.5 0-4.5.75-4.5 2.25V18h9v-2.75C12.5 13.75 9.5 13 8 13z" />
          </svg>
        </span>
        <span class="font-bold text-base">Applicants</span>
      </RouterLink>

      <!-- Post Announcement -->
      <RouterLink
        to="/osca/messaging"
        class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
        :class="navActive('/osca/messaging')"
      >
        <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <!-- Megaphone / Announcement Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 14V6h2v8H2zm4 2V4l12 5v2l-12 5zm14-3a1 1 0 1 1 0-2a1 1 0 0 1 0 2z" />
          </svg>
        </span>
        <span class="font-bold text-base">Post Announcement</span>
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

  <div class="px-4 text-xs text-gray-500 text-center leading-snug">
    © 2025 <span class="font-semibold text-emerald-700">SeniorGo</span><br />
    Made for Butuan Seniors<br />
    Powered by Barangay &amp; OSCA
  </div>
</aside>


    <!-- Main -->
    <main class="flex-1 p-6 md:ml-60">
      <h1 class="text-2xl font-extrabold text-emerald-700 mb-6">
        Barangays in Butuan City
      </h1>

      <!-- Barangay Tiles -->
      <div v-if="!selectedBarangay" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="brgy in barangays"
          :key="brgy.id"
          @click="selectBarangay(brgy)"
          class="bg-white hover:bg-emerald-50 border border-emerald-100 rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
        >
          <h2 class="text-lg font-bold text-emerald-700">{{ brgy.name }}</h2>
          <p class="text-sm text-gray-600 mt-1">Click to view seniors</p>
        </div>
      </div>

      <!-- Seniors List -->
      <div v-else>
        <div class="flex items-center justify-between mb-4">
          <button
            @click="selectedBarangay = null"
            class="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            ← Back
          </button>
          <h2 class="text-xl font-bold text-emerald-700">
            Seniors in {{ selectedBarangay.name }}
          </h2>
        </div>

        <div v-if="loadingSeniors" class="text-gray-500">Loading seniors…</div>

        <div v-else-if="seniors.length === 0" class="text-gray-500">
          No senior records found in this barangay.
        </div>

        <div v-else class="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-[#0B1320]">
              <tr>
                <th class="px-4 py-3 text-left font-semibold">#</th>
                <th class="px-4 py-3 text-left font-semibold">Name</th>
                <th class="px-4 py-3 text-left font-semibold">Age</th>
                <th class="px-4 py-3 text-left font-semibold">Sex</th>
                <th class="px-4 py-3 text-left font-semibold">Contact</th>
                <th class="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(senior, i) in seniors" :key="senior.id" class="hover:bg-slate-50">
                <td class="px-4 py-3">{{ i + 1 }}</td>
                <td class="px-4 py-3">{{ senior.full_name }}</td>
                <td class="px-4 py-3">{{ senior.age }}</td>
                <td class="px-4 py-3">{{ senior.sex }}</td>
                <td class="px-4 py-3">{{ senior.contact }}</td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-emerald-100 text-emerald-700': senior.status === 'Active',
                      'bg-amber-100 text-amber-700': senior.status === 'Pending',
                      'bg-red-100 text-red-700': senior.status === 'Inactive'
                    }"
                  >
                    {{ senior.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase/client'
import { useRoute } from 'vue-router'

const route = useRoute()

// Active nav helper (adds bg + bold + indicator bar)
const navActive = (path) => {
  const isActive = route.path === path
  return isActive
    ? 'bg-emerald-50 text-emerald-900 font-extrabold relative before:content-[\'\'] before:absolute before:-left-1 before:h-6 before:w-1 before:rounded-full before:bg-emerald-500'
    : ''
}

const sidebarOpen = ref(true)
const barangays = ref([])
const seniors = ref([])
const selectedBarangay = ref(null)
const loadingSeniors = ref(false)

onMounted(async () => {
  const { data, error } = await supabase.from('Barangays').select('*').order('name')
  if (error) console.error('Error loading barangays:', error)
  else barangays.value = data
})

async function selectBarangay(brgy) {
  selectedBarangay.value = brgy
  loadingSeniors.value = true
  seniors.value = []

  const { data, error } = await supabase
    .from('SeniorCitizens')
    .select('*')
    .eq('barangay_id', brgy.id)

  if (error) console.error('Error loading seniors:', error)
  else seniors.value = data || []

  loadingSeniors.value = false
}
</script>
