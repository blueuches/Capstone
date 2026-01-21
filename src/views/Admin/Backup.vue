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
              <!-- Title bar -->
              <div class="bg-white border-b-[5px] border-[#2e6b38] shrink-0">
                <div class="py-3 px-4 sm:px-6 flex items-center justify-between gap-3">
                  <!-- Left: description -->
                  <div class="font-extrabold tracking-wide text-gray-800 text-sm sm:text-base">
                    Backup History : Last Backup at January 26, 2026
                  </div>

                  <!-- Right: button -->
                  <button
                    type="button"
                    class="shrink-0 px-4 py-1.5 rounded-full bg-[#2e6b38] text-white font-semibold text-xs
                          hover:brightness-105 active:brightness-95 transition"
                    @click=""
                  >
                    Backup now
                  </button>
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
      File Size
    </th>
    <th class="px-3 py-3 text-left text-sm font-extrabold border border-gray-400">
      Type
    </th>
    <th class="px-3 py-3 text-center text-sm font-extrabold border border-gray-400">
      Download
    </th>
  </tr>
</thead>

<tbody>
  <tr v-for="row in visibleRows" :key="row._key" class="text-gray-700">
    <td class="px-3 py-3 text-sm border border-gray-400 whitespace-nowrap">
      {{ row.file_size }}
    </td>
    <td class="px-3 py-3 text-sm border border-gray-400 whitespace-nowrap">
      {{ row.type }}
    </td>
    <td class="px-3 py-3 text-sm border border-gray-400">
      <div class="flex justify-center">
        <button
          type="button"
          class="px-4 py-1.5 rounded-full bg-[#2e6b38] text-white font-semibold text-xs
                 hover:brightness-105 active:brightness-95 transition"
          @click="download(row)"
        >
          Download
        </button>
      </div>
    </td>
  </tr>

  <tr v-if="visibleRows.length === 0">
    <td
      class="px-3 py-10 text-center text-sm text-gray-500 border border-gray-400"
      colspan="3"
    >
      No files to display.
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
  file_size: string
  type: string
  url?: string // placeholder for later
}

const logs = ref<LogRow[]>(
  Array.from({ length: 40 }).map((_, i) => ({
    _key: `file-${i + 1}`,
    file_size:
      i % 4 === 0 ? '120 KB'
      : i % 4 === 1 ? '1.4 MB'
      : i % 4 === 2 ? '8.2 MB'
      : '24.6 MB',
    type:
      i % 4 === 0 ? 'PDF'
      : i % 4 === 1 ? 'PNG'
      : i % 4 === 2 ? 'CSV'
      : 'ZIP',
    url: '#'
  }))
)

// Placeholder handler (wire this to Supabase Storage later)
function download(row: LogRow) {
  // For now: just a placeholder action
  console.log('Download:', row)
}


const totalPages = computed(() => Math.max(1, Math.ceil(logs.value.length / pageSize)))

const visibleRows = computed(() => {
  // clamp page just in case
  const p = Math.min(Math.max(1, page.value), totalPages.value)
  const start = (p - 1) * pageSize
  return logs.value.slice(start, start + pageSize)
})
</script>
