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
            <section
              class="bg-white border-[5px] border-[#2e6b38] overflow-hidden flex flex-col"
              style="border-radius: 2px"
            >
              <div class="bg-white border-b-[5px] border-[#2e6b38] shrink-0">
                <div class="py-3 text-center font-extrabold tracking-wide text-gray-800">
                  Audit and Logs
                </div>
              </div>

              <div class="p-3 sm:p-4 flex flex-col min-h-0">
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

                <div class="mt-4 shrink-0">
                  <Pagination
                    v-model="page"
                    :totalItems="totalItems"
                    :pageSize="pageSize"
                  />
                </div>
              </div>
            </section>

            <div v-if="errorMsg" class="max-w-6xl mx-auto mt-3 text-sm text-red-600">
              {{ errorMsg }}
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Sidebar from '@/components/Admin/Sidebar.vue'
import Header from '@/components/Admin/Header.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import { useAuth } from '@/composables/useAuth'
import { supabase } from '@/supabase/client'

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

const staffName = computed(() => {
  const p = profile.value as any
  const full = [p?.first_name, p?.last_name].filter(Boolean).join(' ').trim()
  return full || 'Lando Norris'
})

/** Pagination state */
const page = ref(1)
const pageSize = 10
const totalItems = ref(0)

/** UI state */
const loading = ref(false)
const errorMsg = ref('')

/** Render rows */
type LogRow = {
  _key: string
  actor_id: string
  action: string
  table: string
  changes: string
}

const logs = ref<LogRow[]>([])

function safeStringify(v: any) {
  try {
    if (v === null || v === undefined) return '—'
    // keep it readable (not super long)
    const s = JSON.stringify(v)
    return s.length > 280 ? s.slice(0, 280) + '…' : s
  } catch {
    return '—'
  }
}

async function fetchTotalCount() {
  // HEAD query for count only
  const { count, error } = await supabase
    .from('audit_logs')
    .select('id', { count: 'exact', head: true })

  if (error) throw error
  totalItems.value = count ?? 0
}

async function fetchPageRows() {
  const from = (page.value - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error } = await supabase
    .from('audit_logs')
    .select('id, actor_id, action, entity, changes, created_at')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  logs.value =
    (data ?? []).map((r: any) => ({
      _key: r.id,
      actor_id: r.actor_id ?? '—',
      action: r.action ?? '—',
      table: r.entity ?? '—',
      changes: safeStringify(r.changes)
    }))
}

async function refresh() {
  loading.value = true
  errorMsg.value = ''
  try {
    await fetchTotalCount()
    await fetchPageRows()

    // If user is on a page beyond the last page (e.g., logs deleted), clamp
    const lastPage = Math.max(1, Math.ceil(totalItems.value / pageSize))
    if (page.value > lastPage) page.value = lastPage
  } catch (e: any) {
    errorMsg.value = e?.message || 'Failed to load logs.'
    logs.value = []
    totalItems.value = 0
  } finally {
    loading.value = false
  }
}

const visibleRows = computed(() => logs.value)

watch(page, () => {
  refresh()
})

onMounted(() => {
  refresh()
})
</script>
