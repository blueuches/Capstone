<!-- views/Staff/BRGY/SeniorManagementBuilder.vue -->
<template>
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <Sidebar
      :collapsed="sidebarCollapsed"
      :navItems="oscaNavItems"
      footerText="Barangay - CSU © 2026"
    />

    <div class="flex-1 min-w-0 flex flex-col">
      <Header
        :showSearch="false"
        :notificationCount="3"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
      />

      <main class="flex-1 overflow-hidden">
        <div class="h-full px-4 sm:px-6 py-4 flex flex-col">
          <section
            class="bg-white rounded-2xl shadow-sm border-4 flex flex-col max-h-[520px] w-full"
            :style="{ borderColor: brand }"
          >
            <!-- Header -->
            <div
              class="px-4 sm:px-6 py-2 border-b-4 rounded-t-xl shrink-0"
              :style="{ borderColor: brand }"
            >
              <div class="flex items-center gap-3">
                <button
                  class="px-3 py-2 rounded-lg font-extrabold text-white hover:brightness-105 active:brightness-95 transition"
                  :style="{ backgroundColor: brand }"
                  @click="goBack"
                >
                  Back
                </button>

                <div class="flex-1 min-w-0">
                  <input
                    v-model="title"
                    class="w-full px-3 py-2 rounded-lg border-2 font-extrabold text-gray-800"
                    :style="{ borderColor: brand }"
                    placeholder="List title"
                  />
                  <p class="mt-1 text-[11px] text-gray-500">
                    Updated: {{ updatedLabel }} • Created: {{ createdLabel }}
                  </p>
                </div>

                <button
                  class="px-4 py-2 rounded-lg font-extrabold text-white hover:brightness-105 active:brightness-95 transition"
                  :style="{ backgroundColor: brand }"
                  @click="save"
                  :disabled="saving || loading"
                >
                  {{ saving ? 'Saving…' : 'Save' }}
                </button>
              </div>
            </div>

            <!-- Toolbar -->
            <div class="px-3 sm:px-4 py-3 border-b shrink-0">
              <div class="flex flex-wrap items-center gap-2">
                <button
                  class="px-3 py-2 rounded-lg text-sm font-extrabold text-white hover:brightness-105 active:brightness-95 transition"
                  :style="{ backgroundColor: brand }"
                  @click="promptAddColumn"
                >
                  Add Column
                </button>

                <button
                  class="px-3 py-2 rounded-lg text-sm font-extrabold text-white hover:brightness-105 active:brightness-95 transition"
                  :style="{ backgroundColor: brand }"
                  @click="addRow"
                >
                  Add Row
                </button>

                <span v-if="dirty" class="text-xs font-bold text-yellow-600">
                  Unsaved changes
                </span>

                <span v-if="errorMsg" class="text-xs font-bold text-red-600">
                  {{ errorMsg }}
                </span>
              </div>
            </div>

            <!-- Table area -->
            <div class="flex-1 min-h-0 overflow-auto px-3 sm:px-4 pb-4">
              <div v-if="loading" class="py-10 text-center text-gray-500">
                Loading list…
              </div>

              <div v-else class="min-w-[640px]">
                <table class="w-full border-collapse">
                  <thead>
                    <tr>
                      <th class="w-12 text-left text-xs text-gray-500 py-2">#</th>

                      <th
                        v-for="col in sheet.columns"
                        :key="col.id"
                        class="text-left text-xs text-gray-700 py-2"
                      >
                        <div class="flex items-center gap-2">
                          <span class="font-extrabold">{{ col.label }}</span>

                          <button
                            class="text-[11px] px-2 py-1 rounded-md border font-bold hover:bg-gray-50"
                            :style="{ borderColor: brand }"
                            @click="renameColumn(col.id)"
                          >
                            Rename
                          </button>

                          <button
                            class="text-[11px] px-2 py-1 rounded-md border font-bold text-red-600 hover:bg-red-50"
                            :style="{ borderColor: '#ef4444' }"
                            @click="deleteColumn(col.id)"
                          >
                            Delete
                          </button>
                        </div>
                      </th>

                      <th class="w-24 text-left text-xs text-gray-500 py-2">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(row, rIndex) in sheet.rows"
                      :key="row.id"
                      class="border-t"
                    >
                      <td class="py-2 text-xs text-gray-500">
                        {{ rIndex + 1 }}
                      </td>

                      <td
                        v-for="col in sheet.columns"
                        :key="col.id"
                        class="py-2 pr-2"
                      >
                        <input
                          v-model="row.cells[col.id]"
                          class="w-full px-2 py-2 rounded-md border-2 text-sm"
                          :style="{ borderColor: brand }"
                          @input="dirty = true"
                        />
                      </td>

                      <td class="py-2">
                        <button
                          class="px-3 py-2 rounded-lg text-xs font-extrabold text-white hover:brightness-105 active:brightness-95 transition"
                          :style="{ backgroundColor: '#ef4444' }"
                          @click="deleteRow(row.id)"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div v-if="sheet.rows.length === 0" class="py-10 text-center text-gray-500">
                  No rows yet. Click <b>Add Row</b>.
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/BRGY/Header.vue'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

// ✅ Change this import to your actual supabase client file
import { supabase } from '@/supabase/client'

const brand = '#42ad43'
const sidebarCollapsed = ref(false)
const router = useRouter()
const route = useRoute()

const listId = String(route.params.listId || '')

type Column = { id: string; label: string; type: 'text' | 'boolean' | 'number' | 'date' }
type Row = { id: string; cells: Record<string, any> }

const title = ref('')
const createdLabel = ref('')
const updatedLabel = ref('')
const loading = ref(false)
const saving = ref(false)
const errorMsg = ref('')
const dirty = ref(false)

const sheet = reactive<{ columns: Column[]; rows: Row[] }>({
  columns: [],
  rows: []
})

function safeUUID() {
  // crypto.randomUUID() is supported in modern browsers
  return crypto.randomUUID()
}

function normalizeColumnId(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 32) || `col_${Math.random().toString(16).slice(2, 8)}`
}

function ensureSheetShape(raw: any) {
  const columns: Column[] = Array.isArray(raw?.columns) ? raw.columns : []
  const rows: Row[] = Array.isArray(raw?.rows) ? raw.rows : []
  return { columns, rows }
}

function goBack() {
  router.push('/barangay/management')
}

function promptAddColumn() {
  const label = window.prompt('Column name:', 'New Column')
  if (!label) return
  addColumn(label)
}

function addColumn(label: string) {
  const id = normalizeColumnId(label)
  if (sheet.columns.some(c => c.id === id)) {
    errorMsg.value = 'Column id already exists. Try a different name.'
    return
  }

  sheet.columns.push({ id, label, type: 'text' })
  sheet.rows.forEach(r => {
    r.cells[id] = ''
  })
  dirty.value = true
}

function renameColumn(colId: string) {
  const col = sheet.columns.find(c => c.id === colId)
  if (!col) return
  const newLabel = window.prompt('Rename column to:', col.label)
  if (!newLabel) return
  col.label = newLabel
  dirty.value = true
}

function deleteColumn(colId: string) {
  const col = sheet.columns.find(c => c.id === colId)
  if (!col) return
  const ok = window.confirm(`Delete column "${col.label}"? This removes all values under it.`)
  if (!ok) return

  sheet.columns = sheet.columns.filter(c => c.id !== colId) as any
  sheet.rows.forEach(r => {
    delete r.cells[colId]
  })
  dirty.value = true
}

function addRow() {
  const row: Row = { id: safeUUID(), cells: {} }
  sheet.columns.forEach(c => (row.cells[c.id] = ''))
  sheet.rows.push(row)
  dirty.value = true
}

function deleteRow(rowId: string) {
  sheet.rows = sheet.rows.filter(r => r.id !== rowId) as any
  dirty.value = true
}

async function load() {
  loading.value = true
  errorMsg.value = ''
  try {
    const { data, error } = await supabase
      .from('barangay_lists')
      .select('id, title, sheet, created_at, updated_at')
      .eq('id', listId)
      .single()

    if (error) throw error

    title.value = data.title
    createdLabel.value = new Date(data.created_at).toLocaleString()
    updatedLabel.value = new Date(data.updated_at).toLocaleString()

    const normalized = ensureSheetShape(data.sheet)
    sheet.columns = normalized.columns as any
    sheet.rows = normalized.rows as any

    // If empty sheet, give a small starter template
    if (sheet.columns.length === 0) {
      sheet.columns = [
        { id: 'name', label: 'Name', type: 'text' },
        { id: 'contact', label: 'Contact', type: 'text' }
      ] as any
    }
    if (!Array.isArray(sheet.rows)) sheet.rows = [] as any

    dirty.value = false
  } catch (e: any) {
    errorMsg.value = e?.message ?? 'Failed to load list.'
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  errorMsg.value = ''
  try {
    const payload = {
      title: title.value.trim() || 'Untitled List',
      sheet: {
        columns: sheet.columns,
        rows: sheet.rows
      },
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('barangay_lists')
      .update(payload)
      .eq('id', listId)

    if (error) throw error

    updatedLabel.value = new Date().toLocaleString()
    dirty.value = false
  } catch (e: any) {
    errorMsg.value = e?.message ?? 'Failed to save.'
  } finally {
    saving.value = false
  }
}

onMounted(load)

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/barangay/dashboard', icon: DashboardIcon },
  { label: 'List', to: '/barangay/management', icon: BarangaysIcon },
  { label: 'Seniors', to: '/barangay/users', icon: ApplicationIcon },
  { label: 'Message', to: '/barangay/message', icon: ActivityIcon },
  { label: 'Announcement', to: '/barangay/announcement', icon: AnnouncementIcon }
]
</script>
