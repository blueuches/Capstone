<!-- views/Staff/Admin/Edit.vue -->
<template>
  <!-- Entire page locked; only main content scrolls -->
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <!-- Sidebar (fixed height, not scrollable) -->
    <Sidebar
      :collapsed="sidebarCollapsed"
      :navItems="navItems"
      footerText="OSCA - CSU © 2026"
    />

    <!-- Right side -->
    <div class="flex-1 min-w-0 flex flex-col">
      <Header
        :showSearch="false"
        :notificationCount="3"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
      />

      <!-- Main scroll area -->
      <main class="flex-1 overflow-y-auto">
        <div class="px-4 sm:px-8 py-6">
          <div class="max-w-6xl mx-auto">
            
            <!-- ✅ Cards + Add button in ONE ROW -->
            <div class="flex items-start justify-between gap-6">
              
              <!-- Cards -->
              <div class="flex-1">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 place-items-center">
                  <Card
                    v-for="it in formKind"
                    :key="it.id"
                    title="OSCA ID Application Form"
                    :to="`/admin/formbuilder/workaround/${it.id}`"
                  />
                </div>

                <div v-if="loading" class="mt-6 text-sm text-gray-500">
                  Loading forms
                </div>
                <div
                  v-else-if="!loading && formKind.length === 0"
                  class="mt-6 text-sm text-gray-500"
                >
                  No forms found.
                </div>
              </div>

              <!-- ✅ Add button on the RIGHT -->
              <div class="shrink-0 pt-2">
                <button
                  type="button"
                  disabled
                  class="flex flex-col items-center gap-2
                         text-gray-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-disabled="true"
                >
                  <div
                    class="w-12 h-12 rounded-full bg-[#2e6b38] text-white
                           flex items-center justify-center
                           opacity-80"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      class="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                  <span class="text-sm font-semibold">Add</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed,onMounted, ref } from 'vue'
import Sidebar from '@/components/Admin/Sidebar.vue'
import Header from '@/components/Admin/Header.vue'
import Card from '@/components/Admin/Card.vue'
import { useAuth } from '@/composables/useAuth'
import { supabase } from '@/supabase/client'

import IconDashboard from '/public/admin/dashboard.png'
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

type FormKind = {
  id: string
  name: string
  version: number
  pdf_template_storage_path: string | null
  is_active: boolean
}

const formKind = ref<FormKind[]>([])
const loading = ref(false)
const error = ref<string>('')

async function fetchForm() {
  loading.value = true
  error.value = ''
  try {
    // ✅ You said “call the 4 issuance type from the database”
    const { data, error: e } = await supabase
      .from('forms')
      .select('id,name,version,pdf_template_storage_path,is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (e) throw e
    formKind.value = data ?? []
  } catch (err: any) {
    formKind.value = []
    error.value = err?.message || 'Failed to load issuance types.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchForm()
})
</script>
