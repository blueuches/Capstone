<template>
  <div class="min-h-screen flex bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-[1.05rem] leading-relaxed">
    <!-- 🟩 Sidebar -->
    <aside class="w-72 bg-emerald-700 text-emerald-50 flex flex-col justify-between p-6 sticky top-0 h-screen shadow-xl text-[1rem]">
      <div>
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow overflow-hidden">
            <img 
              src="/logo.png" 
              alt="OSCA Logo" 
              class="w-8 h-8 object-contain"
            />
          </div>
          <h1 class="text-2xl font-bold tracking-wide text-white">OSCA Admin</h1>
        </div>

        <!-- Navigation -->
        <nav class="space-y-1 font-medium text-[1.05rem]">
          <router-link to="/admin/dashboard" class="block px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition">Dashboard</router-link>
          <router-link to="/admin/programconfig" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">Programs</router-link>
          <router-link to="/admin/formbuilder" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">Application Forms</router-link>
          <router-link to="/admin/users" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">Users</router-link>
          <router-link to="/admin/complaints" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">Complaints</router-link>        </nav>
      </div>

      <!-- Footer -->
      <div class="px-4 text-sm text-emerald-200 text-center leading-snug mt-6 border-t border-emerald-600 pt-4">
        © 2025 <span class="font-semibold text-white">SeniorGo</span><br/>
        Made for Butuan Seniors<br/>
        Powered by Barangay &amp; OSCA
      </div>
    </aside>

    <!-- 🟨 Main Content -->
    <main class="flex-1 p-8 flex flex-col items-center overflow-y-auto">
      <!-- HEADER -->
      <div class="w-full max-w-5xl flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-emerald-700">Program Editor</h1>
        <select
          v-model="selectedProgramId"
          class="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-white"
        >
          <option disabled value="">Select a Program</option>
          <option v-for="p in programs" :key="p.id ?? 0" :value="p.id ?? 0">{{ p.name }}</option>
        </select>
      </div>

      <!-- PROGRAM DETAILS -->
      <div
        v-if="selectedProgramId"
        class="w-full max-w-5xl bg-white border border-emerald-100 rounded-2xl shadow-xl p-6 space-y-4"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="label">Program Code</label>
            <input v-model="program.code" class="form-input" />
          </div>
          <div>
            <label class="label">Program Name</label>
            <input v-model="program.name" class="form-input" />
          </div>
        </div>

        <div>
          <label class="label">Description</label>
          <textarea v-model="program.description" rows="3" class="form-input"></textarea>
        </div>

        <div>
          <label class="label">Process / Steps</label>
          <textarea v-model="program.process" rows="3" class="form-input"></textarea>
        </div>

        <div>
          <label class="label">Requirements (comma-separated)</label>
          <input v-model="requirementsText" class="form-input" placeholder="e.g. OSCA ID, Birth Certificate" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="label">Eligibility</label>
            <textarea v-model="program.eligibility" rows="2" class="form-input"></textarea>
          </div>
          <div>
            <label class="label">Benefits</label>
            <textarea v-model="program.benefits" rows="2" class="form-input"></textarea>
          </div>
        </div>

        <div>
          <label class="label">Contact Information</label>
          <input v-model="program.contact_info" class="form-input" />
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button @click="resetForm" class="btn-secondary">Reset</button>
          <button @click="saveProgram" class="btn-primary">💾 Save Changes</button>
        </div>
      </div>

      <div v-else class="text-gray-500 mt-20 text-center">
        Select a program to edit its details.
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { supabase } from '@/supabase/client'

interface Program {
  id: number | null
  code: string
  name: string
  description: string
  process: string
  requirements: string[]
  eligibility: string
  benefits: string
  contact_info: string
}

const programs = ref<Program[]>([])
const selectedProgramId = ref<number | null>(null)
const program = reactive<Program>({
  id: null,
  code: '',
  name: '',
  description: '',
  process: '',
  requirements: [],
  eligibility: '',
  benefits: '',
  contact_info: ''
})
const requirementsText = ref('')

onMounted(async () => {
  const { data, error } = await supabase.from('Programs').select('id, name')
  if (error) console.error(error)
  else programs.value = (data as Program[]) || []
})

watch(() => selectedProgramId.value, async (id) => {
  if (id == null) return
  const { data, error } = await supabase.from('Programs').select('*').eq('id', Number(id)).single()
  if (error) console.error(error)
  else if (data) {
    Object.assign(program, data)
    requirementsText.value = Array.isArray(data.requirements)
      ? data.requirements.join(', ')
      : ''
  }
})

function resetForm() {
  Object.assign(program, {
    id: null,
    code: '',
    name: '',
    description: '',
    process: '',
    requirements: [],
    eligibility: '',
    benefits: '',
    contact_info: ''
  })
  requirementsText.value = ''
}

async function saveProgram() {
  program.requirements = requirementsText.value
    ? requirementsText.value.split(',').map(r => r.trim())
    : []

  const id = Number(selectedProgramId.value)
  if (!id) return alert('Please select a program to update.')

  const { error } = await supabase
    .from('Programs')
    .update({
      code: program.code,
      name: program.name,
      description: program.description,
      process: program.process,
      requirements: program.requirements,
      eligibility: program.eligibility,
      benefits: program.benefits,
      contact_info: program.contact_info,
      last_updated: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error(error)
    alert('❌ Error saving program.')
  } else {
    alert('✅ Program updated successfully!')
  }
}
</script>

<style scoped>
.label {
  @apply text-sm font-semibold text-emerald-800 mb-1 block;
}
.form-input {
  @apply w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition;
}
.btn-primary {
  @apply bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition;
}
.btn-secondary {
  @apply border border-gray-300 px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition;
}
</style>
