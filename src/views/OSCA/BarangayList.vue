<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 bg-white shadow-lg flex flex-col justify-between py-6 z-50 transform transition-transform duration-300',
        sidebarOpen ? 'translate-x-0 w-60' : '-translate-x-full w-60',
        'md:relative md:translate-x-0 md:w-60'
      ]"
    >
      <div>
        <h4 class="font-bold text-emerald-700 mb-8 px-4">SeniorGo</h4> 

        <nav class="flex flex-col gap-6 w-full items-start px-4">
          <router-link to="/osca/dashboard" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.625 2.75a3.875 3.875 0 1 0 0 7.75a3.875 3.875 0 0 0 0-7.75m10.75 0a3.875 3.875 0 1 0 0 7.75a3.875 3.875 0 0 0 0-7.75M6.625 13.5a3.875 3.875 0 1 0 0 7.75a3.875 3.875 0 0 0 0-7.75m10.75 0a3.875 3.875 0 1 0 0 7.75a3.875 3.875 0 0 0 0-7.75"/></svg>
            <span class="font-bold text-lg">Dashboard</span>
          </router-link>

          <router-link to="/osca/barangays" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fill="currentColor" d="M0 0h4v4H0zm6 1h10v2H6zM0 6h4v4H0zm6 1h10v2H6zm-6 5h4v4H0zm6 1h10v2H6z"/></svg>
            <span class="font-bold text-lg">View Lists</span>
          </router-link>

          <router-link  to="/osca/review" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fill="currentColor" fill-rule="evenodd" d="M4 4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm10 5c0-.6.4-1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1m0 3c0-.6.4-1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1m0 3c0-.6.4-1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1m-8-5a3 3 0 1 1 6 0a3 3 0 0 1-6 0m2 4a3 3 0 0 0-3 2v.2c0 .1-.1.2 0 .2v.2c.3.2.6.4.9.4h6c.3 0 .6-.2.8-.4l.2-.2v-.2l-.1-.1A3 3 0 0 0 10 14H7.9Z" clip-rule="evenodd"/></svg>
            <span class="font-bold text-lg">Review Seniors</span>
          </router-link>

          <router-link to="/osca/applications" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9h6M9 13h4m-8 4h12"/></svg>
            <span class="font-bold text-lg">Applicants</span>
          </router-link>

          <router-link to="/osca/messaging" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fill="currentColor" fill-rule="evenodd" d="M7.933.767a.75.75 0 0 0-1.5 0v.754a.75.75 0 0 0 1.5 0zM6.595 2.928a.75.75 0 0 1 1.024.275l3.858 6.681a.75.75 0 0 1-1.299.75l-.055-.096l-3.092.718a2.171 2.171 0 0 1-3.97 1.664l-.002-.003l-.376-.651l-1.454.337a.5.5 0 0 1-.546-.237l-.609-1.055a.5.5 0 0 1 .068-.591l6.235-6.67l-.057-.097a.75.75 0 0 1 .275-1.025M4.21 11.911l1.357-.315a.671.671 0 0 1-1.21.57zm9.78-5.088a.75.75 0 0 1-.75.75h-.754a.75.75 0 0 1 0-1.5h.753a.75.75 0 0 1 .75.75Zm-12.108.75a.75.75 0 1 0 0-1.5h-.754a.75.75 0 1 0 0 1.5zm2.182-3.868a.75.75 0 0 1-1.06 0l-.634-.634a.75.75 0 1 1 1.06-1.06l.635.633a.75.75 0 0 1 0 1.061Zm7.932-.634a.75.75 0 0 0-1.06-1.06l-.642.64a.75.75 0 1 0 1.061 1.061z" clip-rule="evenodd"/></svg>
          <span class="font-bold text-lg">Post</span>      
          </router-link>

          <router-link to="/logout" class="flex items-center gap-3 text-emerald-700 hover:text-emerald-900 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"/></svg>
            <span class="font-bold text-lg">Logout</span>
          </router-link>
        </nav>
      </div>

      <div class="px-4 text-xs text-gray-500 text-center leading-snug">
        © 2025 <span class="font-semibold text-emerald-700">SeniorGo</span><br/>
        Made for Butuan Seniors<br/>
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
