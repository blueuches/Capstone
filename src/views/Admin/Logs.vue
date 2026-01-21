<!-- views/Staff/Admin/Logs.vue -->
<template>
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <Sidebar
      :collapsed="sidebarCollapsed"
      :navItems="navItems"
      footerText="OSCA - CSU © 2026"
    />

    <div class="flex-1 min-w-0 flex flex-col">
      <Header
        :showSearch="false"
        :notificationCount="3"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
      />

      <main class="flex-1 overflow-y-auto">
        <div class="px-4 sm:px-8 py-6">
          <div class="max-w-6xl mx-auto">
            <!-- ✅ make the whole card height-controlled and flex column -->
            <section
              class="bg-white border-[5px] border-[#2e6b38] overflow-hidden flex flex-col"
              style="border-radius: 2px"
            >
              <!-- Title bar (fixed) -->
              <div class="bg-white border-b-[5px] border-[#2e6b38] shrink-0">
                <div class="py-3 text-center font-extrabold tracking-wide text-gray-800">
                  Audit and Logs
                </div>
              </div>

              <!-- ✅ content area with controlled height -->
              <div class="p-3 sm:p-4 flex flex-col min-h-0">
                <!-- ✅ table area scrolls, pagination stays visible -->
                <div
                  class="min-h-0 overflow-y-auto border border-gray-300"
                  style="max-height: calc(100vh - 240px);"
                >
                  <div class="overflow-x-auto">
                    <table class="w-full border-collapse">
                      <thead class="sticky top-0 bg-white z-10">
                        <tr class="text-gray-800">
                          <th class="px-3 py-3 text-left text-sm font-extrabold border border-gray-400">
                            Actor ID
                          </th>
                          <th class="px-3 py-3 text-left text-sm font-extrabold border border-gray-400">
                            Action
                          </th>
                          <th class="px-3 py-3 text-left text-sm font-extrabold border border-gray-400">
                            Table (s)
                            <div class="text-xs font-extrabold leading-3">Affected</div>
                          </th>
                          <th class="px-3 py-3 text-left text-sm font-extrabold border border-gray-400">
                            Changes
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="row in visibleRows"
                          :key="row._key"
                          class="text-gray-700"
                        >
                          <td class="px-3 py-3 text-sm border border-gray-400 whitespace-nowrap">
                            {{ row.actor_id }}
                          </td>
                          <td class="px-3 py-3 text-sm border border-gray-400 whitespace-nowrap">
                            {{ row.action }}
                          </td>
                          <td class="px-3 py-3 text-sm border border-gray-400 whitespace-nowrap">
                            {{ row.table }}
                          </td>
                          <td class="px-3 py-3 text-sm border border-gray-400">
                            <span class="text-gray-500">{{ row.changes }}</span>
                          </td>
                        </tr>

                        <tr v-if="visibleRows.length === 0">
                          <td class="px-3 py-10 text-center text-sm text-gray-500 border border-gray-400" colspan="4">
                            No logs to display.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- ✅ pagination pinned under the table -->
                <div class="mt-4 shrink-0">
                  <Pagination
                    v-model="page"
                    :totalItems="logs.length"
                    :pageSize="pageSize"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Sidebar from '@/components/Admin/Sidebar.vue'
import Header from '@/components/Admin/Header.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import { useAuth } from '@/composables/useAuth'

import IconDashboard  from '/public/admin/dashboard.png'
import IconLogs from '/public/admin/logs.png'
import IconUsers from '/public/admin/users.png'
import IconEdit from '/public/admin/edit.png'
import IconForm from '/public/admin/form.png'
import IconBackup from '/public/admin/backup.png'

const navItems = computed(() => [
  { label: 'Dashboard', to: '/admin/dashboard', icon: IconDashboard },
  { label: 'Logs', to: '/admin/logs', icon: IconLogs },
  { label: 'Users', to: '/admin/users', icon: IconUsers },
  { label: 'Edit', to: '/admin/edit', icon: IconEdit },
  { label: 'Form Builder', to: '/admin/formbuilder', icon: IconForm },
  { label: 'Backups', to: '/admin/backup', icon: IconBackup }

])

const { profile } = useAuth()
const sidebarCollapsed = ref(false)

// (Optional) keeping your pattern, in case you’ll show “who is logged in” later
const staffName = computed(() => {
  const p = profile.value as any
  const full = [p?.first_name, p?.last_name].filter(Boolean).join(' ').trim()
  return full || 'Lando Norris'
})

/** Pagination state */
const page = ref(1)
const pageSize = 10

/** Placeholder data (replace with real audit_logs later) */
type LogRow = {
  _key: string
  actor_id: string
  action: string
  table: string
  changes: string
}

const logs = ref<LogRow[]>(
  Array.from({ length: 50 }).map((_, i) => ({
    _key: `log-${i + 1}`,
    actor_id: i % 3 === 0 ? 'OSCA-1029' : i % 3 === 1 ? 'BRGY-4410' : 'ADMIN-0001',
    action: i % 4 === 0 ? 'INSERT' : i % 4 === 1 ? 'UPDATE' : i % 4 === 2 ? 'DELETE' : 'LOGIN',
    table: i % 3 === 0 ? 'applications' : i % 3 === 1 ? 'profiles' : 'requests',
    changes: '— placeholder for diff JSON / summary —'
  }))
)

const totalPages = computed(() => Math.max(1, Math.ceil(logs.value.length / pageSize)))

const visibleRows = computed(() => {
  // clamp page just in case
  const p = Math.min(Math.max(1, page.value), totalPages.value)
  const start = (p - 1) * pageSize
  return logs.value.slice(start, start + pageSize)
})
</script>
