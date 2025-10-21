<template>
  <div class="min-h-screen flex bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-[1.05rem] leading-relaxed">
    <!-- 🟩 Sidebar -->
    <aside class="w-72 bg-emerald-700 text-emerald-50 flex flex-col justify-between p-6 sticky top-0 h-screen shadow-xl text-[1rem]">
      <div>
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow overflow-hidden">
            <img src="/logo.png" alt="OSCA Logo" class="w-8 h-8 object-contain" />
          </div>
          <h1 class="text-2xl font-bold tracking-wide text-white">OSCA Admin</h1>
        </div>

        <nav class="space-y-1 font-medium text-[1.05rem]">
          <router-link to="/admin/dashboard" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">Dashboard</router-link>
          <router-link to="/admin/programconfig" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">Programs</router-link>
          <router-link to="/admin/formbuilder" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">Application Forms</router-link>
          <router-link to="/admin/usermanagement" class="block px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition">Users</router-link>
          <router-link to="/admin/complaints" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">Complaints</router-link>
        </nav>
      </div>

      <div class="px-4 text-sm text-emerald-200 text-center leading-snug mt-6 border-t border-emerald-600 pt-4">
        © 2025 <span class="font-semibold text-white">SeniorGo</span><br/>
        Made for Butuan Seniors<br/>
        Powered by Barangay &amp; OSCA
      </div>
    </aside>

    <!-- 🟨 Main Content -->
    <main class="flex-1 p-8 overflow-y-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 class="text-3xl font-bold text-emerald-700">User Management</h1>

        <!-- Search + Filter -->
        <div class="flex flex-wrap gap-3">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or username..."
            class="form-input w-64"
          />
          <select v-model="selectedRole" class="form-input w-40">
            <option value="">All Roles</option>
            <option value="senior">Senior</option>
            <option value="brgy_staff">Barangay Staff</option>
            <option value="osca_staff">OSCA Staff</option>
          </select>
        </div>
      </div>

      <!-- User Table -->
      <div class="bg-white rounded-2xl border border-emerald-100 shadow-lg overflow-hidden">
        <table class="w-full text-left text-sm">
          <thead class="bg-emerald-50 text-emerald-800">
            <tr>
              <th class="px-6 py-3">Name</th>
              <th class="px-6 py-3">Username</th>
              <th class="px-6 py-3">Role</th>
              <th class="px-6 py-3">Barangay</th>
              <th class="px-6 py-3 text-center">Status</th>
              <th class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="u in filteredUsers"
              :key="u.user_id"
              class="border-t hover:bg-emerald-50/50 transition"
            >
              <td class="px-6 py-3 font-medium text-gray-800">{{ u.full_name || '—' }}</td>
              <td class="px-6 py-3 text-gray-600">{{ u.username || '—' }}</td>

              <!-- Role Badge -->
              <td class="px-6 py-3">
                <span
                  class="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                  :class="{
                    'bg-emerald-100 text-emerald-800': u.role === 'osca_staff',
                    'bg-blue-100 text-blue-800': u.role === 'brgy_staff',
                    'bg-gray-100 text-gray-700': u.role === 'senior',
                  }"
                >
                  {{ u.role || '—' }}
                </span>
              </td>

              <td class="px-6 py-3">{{ u.barangay || '—' }}</td>

              <!-- Status toggle -->
              <td class="px-6 py-3 text-center">
                <span
                  class="px-3 py-1 rounded-full text-xs font-semibold cursor-pointer"
                  :class="u.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-200 text-gray-600'"
                  @click="toggleStatus(u)"
                >
                  {{ u.status }}
                </span>
              </td>

              <td class="px-6 py-3 text-right flex justify-end gap-3">
                <button
                  @click="resetPassword(u)"
                  class="text-emerald-600 hover:text-emerald-800"
                  title="Reset Password"
                >
                  🔑
                </button>
                <button
                  @click="deleteUser(u)"
                  class="text-red-500 hover:text-red-700"
                  title="Delete User"
                >
                  🗑️
                </button>
              </td>
            </tr>

            <tr v-if="!filteredUsers.length">
              <td colspan="6" class="text-center py-6 text-gray-500">No users found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabase/client'

interface User {
  user_id: string
  full_name: string
  username: string
  role: string
  barangay: string
  status: string
}

const users = ref<User[]>([])
const searchQuery = ref('')
const selectedRole = ref('')

onMounted(async () => {
  // Get USERS + their memberships + seniors
  const { data, error } = await supabase
    .from('Users')
    .select(`
      user_id,
      full_name,
      username,
      SeniorCitizens!left (id),
      Memberships!left (
        status,
        Roles!left (code),
        Organizations!left (
          kind,
          name,
          Barangays!left (name)
        )
      )
    `)

  if (error) {
    console.error('❌ Supabase error:', error)
    return
  }

  const allUsers: User[] = []

  data.forEach((u: any) => {
    // 🔹 SENIOR CITIZENS
    if (u.SeniorCitizens && u.SeniorCitizens.id) {
      allUsers.push({
        user_id: u.user_id,
        full_name: u.full_name,
        username: u.username,
        role: 'senior',
        barangay: '—',
        status: 'active',
      })
    }

    // 🔹 OSCA + BARANGAY STAFF
    if (Array.isArray(u.Memberships) && u.Memberships.length > 0) {
      u.Memberships.forEach((m: any) => {
        const orgKind = m.Organizations?.kind
        const roleCode = m.Roles?.code

        // Determine role based on organization kind
        const role =
          roleCode ||
          (orgKind === 'osca'
            ? 'osca_staff'
            : orgKind === 'barangay'
            ? 'brgy_staff'
            : 'staff')

        allUsers.push({
          user_id: u.user_id,
          full_name: u.full_name,
          username: u.username,
          role,
          barangay:
            m.Organizations?.Barangays?.name ||
            m.Organizations?.name ||
            '—',
          status: m.status || 'active',
        })
      })
    }
  })

  // ✅ remove duplicates (same user + role)
  const uniqueUsers = new Map()
  allUsers.forEach(u => uniqueUsers.set(`${u.user_id}-${u.role}`, u))

  users.value = Array.from(uniqueUsers.values())

  console.log('✅ Loaded users:', users.value)
})


const filteredUsers = computed(() =>
  users.value.filter(u => {
    const matchesRole = selectedRole.value ? u.role === selectedRole.value : true
    const matchesSearch =
      u.full_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesRole && matchesSearch
  })
)

async function toggleStatus(u: User) {
  u.status = u.status === 'active' ? 'disabled' : 'active'
  await supabase.from('Memberships').update({ status: u.status }).eq('user_id', u.user_id)
}

async function deleteUser(u: User) {
  if (!confirm(`Delete ${u.full_name}? This cannot be undone.`)) return
  users.value = users.value.filter(x => x.user_id !== u.user_id)
  await supabase.from('Users').delete().eq('user_id', u.user_id)
}

function resetPassword(u: User) {
  alert(`🔑 Password reset link sent to ${u.username || u.full_name}`)
}
</script>

<style scoped>
.form-input {
  @apply border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition;
}
</style>
