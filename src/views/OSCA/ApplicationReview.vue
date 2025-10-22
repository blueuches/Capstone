<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <!-- Sidebar -->
    <Sidebar role="osca" />

    <!-- MAIN CONTENT -->
    <main class="flex-1 p-6 md:ml-60">
      <!-- PROGRAMS GRID -->
      <div v-if="!selectedProgram">
        <h1 class="text-2xl font-extrabold text-emerald-700 mb-6">Available Programs</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="program in programs"
            :key="program.id"
            @click="selectProgram(program)"
            class="bg-white border border-emerald-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:bg-emerald-50 cursor-pointer transition-all"
          >
            <h2 class="text-lg font-bold text-emerald-700">{{ program.name }}</h2>
            <p class="text-gray-600 text-sm mt-1 line-clamp-2">{{ program.description }}</p>
          </div>
        </div>
      </div>

      <!-- SENIORS APPLYING TO PROGRAM -->
      <div v-else>
        <div class="flex items-center justify-between mb-5">
          <button
            @click="selectedProgram = null"
            class="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            ← Back
          </button>
          <h2 class="text-xl font-bold text-emerald-700">
            Seniors Applying for: {{ selectedProgram.name }}
          </h2>
        </div>

        <div v-if="loading" class="text-gray-500">Loading applicants…</div>

        <div v-else-if="applicants.length === 0" class="text-gray-500">
          No senior applications found for this program.
        </div>

        <div v-else class="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-[#0B1320]">
              <tr>
                <th class="px-4 py-3 text-left font-semibold">#</th>
                <th class="px-4 py-3 text-left font-semibold">Name</th>
                <th class="px-4 py-3 text-left font-semibold">Barangay</th>
                <th class="px-4 py-3 text-left font-semibold">Contact</th>
                <th class="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(app, i) in applicants" :key="app.id" class="hover:bg-slate-50">
                <td class="px-4 py-3">{{ i + 1 }}</td>
                <td class="px-4 py-3">{{ app.users.full_name }}</td>
                <td class="px-4 py-3">{{ app.barangay }}</td>
                <td class="px-4 py-3">{{ app.contact }}</td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-emerald-100 text-emerald-700': app.status === 'Approved',
                      'bg-amber-100 text-amber-700': app.status === 'Pending',
                      'bg-red-100 text-red-700': app.status === 'Rejected'
                    }"
                  >
                    {{ app.status }}
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

const sidebarOpen = ref(true)
const programs = ref([])
const applicants = ref([])
const selectedProgram = ref(null)
const loading = ref(false)
const route = useRoute()

// Fetch programs on page load
onMounted(async () => {
  const { data, error } = await supabase.from('Programs').select('*').order('name')
  if (error) console.error('Error loading programs:', error)
  else programs.value = data
})

// Active nav helper (adds bg + bold + indicator bar)
const navActive = (path) => {
  const isActive = route.path === path
  return isActive
    ? 'bg-emerald-50 text-emerald-900 font-extrabold relative before:content-[\'\'] before:absolute before:-left-1 before:h-6 before:w-1 before:rounded-full before:bg-emerald-500'
    : ''
}

// When a program is selected
async function selectProgram(program) {
  selectedProgram.value = program
  applicants.value = []
  loading.value = true

const { data, error } = await supabase
  .from('Requests')
  .select(`
    id,
    status,
    submitted_at,
    SeniorCitizens (
      id,
      barangay_id,
      sex,
      Users (
        full_name
      )
    )
  `)
  .eq('program_id', selectedProgram.id)


  if (error) console.error('Error loading applicants:', error)
  else applicants.value = data || []

  loading.value = false
}
</script>
