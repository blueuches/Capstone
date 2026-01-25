<template>
  <!-- Entire page locked; only main content scrolls -->
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <Sidebar
      :collapsed="sidebarCollapsed"
      :navItems="navItems"
      footerText="OSCA - CSU © 2026"
    />

    <!-- Right side -->
    <div class="flex-1 min-w-0 flex flex-col min-h-0">
      <Header
        :showSearch="false"
        :notificationCount="3"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
      />

      <!-- Top row: Back + Title -->
<div class="mt-2 ml-3 mr-3 mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
  <RouterLink
    to="/admin/formbuilder"
    class="inline-flex items-center gap-2 text-gray-700 hover:text-[#2e6b38] group w-fit"
  >
    <span
      class="shrink-0 w-7 h-7 rounded-full bg-[#2e6b38] flex items-center justify-center text-white transition group-hover:brightness-105"
      aria-hidden="true"
    >
      <svg
        class="w-4 h-4 -rotate-180"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </span>
    <span class="text-sm font-semibold">Back</span>
  </RouterLink>

  <div class="min-w-0 sm:text-right">
    <h1 class="text-lg sm:text-2xl font-extrabold text-gray-900 leading-tight truncate">
      Edit {{ formNameDisplay }}
    </h1>
  </div>
</div>

      <!-- Main scroll area -->
<main class="flex-1 min-h-0 overflow-hidden">
<div class="px-3 sm:px-6 py-3">
  <!-- fixed small card height so it never overflows -->
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">

      <!-- Table area: fills remaining height -->
      <div class="p-2 sm:p-3">
        <Table
          :rows="fields"
          :loading="loading"
          :error="errorMsg"
          @move-up="moveUp"
          @move-down="moveDown"
        />
      </div>

      <!-- Buttons pinned -->
<div class="px-3 sm:px-4 py-3 border-t border-gray-100 flex items-center justify-center gap-4">

        <RouterLink
          :to="addFieldTo"
          class="inline-flex items-center justify-center rounded-xl px-8 sm:px-10 py-3 text-sm font-semibold
                 bg-[#2e6b38] text-white hover:brightness-110 shadow-sm active:brightness-95"
        >
          Add field
        </RouterLink>

        <button
          type="button"
          class="inline-flex items-center justify-center rounded-xl px-10 sm:px-12 py-3 text-sm font-semibold
                 bg-[#2e6b38] text-white shadow-sm hover:brightness-110 active:brightness-95
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
          :disabled="!hasChanges || saving || loading"
          @click="save"
        >
          <span v-if="saving">Saving…</span>
          <span v-else>Save</span>
        </button>
      </div>
    </div>

    <p v-if="hasChanges" class="mt-2 text-xs text-gray-500">
      You have unsaved changes (row order updated).
    </p>
  </div>
</main>


    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Admin/Sidebar.vue'
import Header from '@/components/Admin/Header.vue'
import Table from '@/components/Admin/Table.vue'
import { useAuth } from '@/composables/useAuth'
import { supabase } from '@/supabase/client'

import IconDashboard  from '/public/admin/dashboard.png'
import IconLogs from '/public/admin/logs.png'
import IconUsers from '/public/admin/users.png'
import IconEdit from '/public/admin/edit.png'
import IconForm from '/public/admin/form.png'
import IconBackup from '/public/admin/backup.png'

type FormFieldRow = {
  id: string
  form_id: string
  section: string
  label: string
  field_key: string
  required: boolean
  sort_order: number
  options: any | null
  depends_on: any | null
}

const navItems = computed(() => [
  { label: 'Dashboard', to: '/admin/dashboard', icon: IconDashboard },
  { label: 'Logs', to: '/admin/logs', icon: IconLogs },
  { label: 'Users', to: '/admin/users', icon: IconUsers },
  { label: 'Edit', to: '/admin/edit', icon: IconEdit },
  { label: 'Form Builder', to: '/admin/formbuilder', icon: IconForm },
  { label: 'Backups', to: '/admin/backup', icon: IconBackup }
])

useAuth() // keep for role/auth side effects if your app needs it
const sidebarCollapsed = ref(false)

const route = useRoute()
const formId = computed(() => route.params.id as string)

const formName = ref<string>('')
const loading = ref(false)
const saving = ref(false)
const errorMsg = ref<string>('')

const fields = ref<FormFieldRow[]>([])
const originalSnapshot = ref<string>('')

const formNameDisplay = computed(() => formName.value || 'FORM')

/**
 * Add Field route (workaround):
 * Change this anytime to match your real “Add Field” page route.
 */
const addFieldTo = computed(() => `/admin/formbuilder/workaround/${formId.value}/add-field`)

const hasChanges = computed(() => {
  return JSON.stringify(fields.value.map(pickComparable)) !== originalSnapshot.value
})

function pickComparable(row: FormFieldRow) {
  // Only track things that matter for “Save enabled”.
  // Here: order + ids (because we’re primarily reordering)
  return {
    id: row.id,
    sort_order: row.sort_order
  }
}

async function fetchFormAndFields() {
  loading.value = true
  errorMsg.value = ''
  try {
    // form name
    const { data: formData, error: formErr } = await supabase
      .from('forms')
      .select('id,name')
      .eq('id', formId.value)
      .single()

    if (formErr) throw formErr
    formName.value = formData?.name ?? ''

    // fields
    const { data: fieldData, error: fieldErr } = await supabase
      .from('form_fields')
      .select('id,form_id,section,label,field_key,required,sort_order,options,depends_on')
      .eq('form_id', formId.value)
      .order('sort_order', { ascending: true })

    if (fieldErr) throw fieldErr

    fields.value = (fieldData ?? []) as FormFieldRow[]
    // normalize sort_order just in case there are duplicates / gaps
    normalizeSortOrders()
    originalSnapshot.value = JSON.stringify(fields.value.map(pickComparable))
  } catch (e: any) {
    errorMsg.value = e?.message ?? 'Failed to load form fields.'
  } finally {
    loading.value = false
  }
}

function normalizeSortOrders() {
  fields.value = fields.value
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((row, idx) => ({
      ...row,
      sort_order: (idx + 1) * 10 // spaced, so inserting later is easier
    }))
}

function moveUp(rowIndex: number) {
  if (rowIndex <= 0) return
  const arr = fields.value.slice()
  ;[arr[rowIndex - 1], arr[rowIndex]] = [arr[rowIndex], arr[rowIndex - 1]]
  fields.value = arr
  normalizeSortOrders()
}

function moveDown(rowIndex: number) {
  if (rowIndex >= fields.value.length - 1) return
  const arr = fields.value.slice()
  ;[arr[rowIndex], arr[rowIndex + 1]] = [arr[rowIndex + 1], arr[rowIndex]]
  fields.value = arr
  normalizeSortOrders()
}

async function save() {
  if (!hasChanges.value) return
  saving.value = true
  errorMsg.value = ''
  try {
    // Update only sort_order (workaround page)
    const payload = fields.value.map(f => ({
      id: f.id,
      sort_order: f.sort_order
    }))

    const { error } = await supabase
      .from('form_fields')
      .upsert(payload, { onConflict: 'id' })

    if (error) throw error

    originalSnapshot.value = JSON.stringify(fields.value.map(pickComparable))
  } catch (e: any) {
    errorMsg.value = e?.message ?? 'Failed to save changes.'
  } finally {
    saving.value = false
  }
}

onMounted(fetchFormAndFields)
watch(formId, fetchFormAndFields)
</script>
