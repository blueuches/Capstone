<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">

    <Sidebar role="osca" />

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
import Sidebar from '@/components/Sidebar.vue'

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
