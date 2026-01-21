<!-- views/Staff/Admin/EditIssuanceOption.vue -->
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

      <RouterLink
        to="/admin/edit"
        class="inline-flex items-center gap-2
              text-gray-700 hover:text-[#2e6b38]
              mt-2 ml-3 group w-fit"
      >
        <span
          class="shrink-0 w-7 h-7 rounded-full bg-[#2e6b38]
                flex items-center justify-center text-white
                transition group-hover:brightness-105"
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

      <main class="flex-1 overflow-y-auto">
        <div class="px-4 sm:px-8 py-6">
          <div class="max-w-6xl mx-auto">
            <!-- Layout: cards left, add button right -->
            <div class="flex items-start gap-8">
              <!-- Cards grid -->
              <div class="flex-1">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <CardEdit
                    v-for="it in issuanceTypes"
                    :key="it.id"
                    :title="it.name"
                    :to="`/admin/edit/issuance/edit/${it.id}`"
                  />
                </div>

                <!-- Loading / empty states -->
                <div v-if="loading" class="mt-6 text-sm text-gray-500">
                  Loading issuance types…
                </div>
                <div v-else-if="!loading && issuanceTypes.length === 0" class="mt-6 text-sm text-gray-500">
                  No issuance types found.
                </div>
              </div>

              <!-- Add button (disabled) -->
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
                    <svg viewBox="0 0 24 24" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                  <span class="text-sm font-semibold">Add</span>
                </button>
              </div>
            </div>

            <!-- Error -->
            <div v-if="error" class="mt-6 text-sm text-red-600">
              {{ error }}
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Sidebar from '@/components/Admin/Sidebar.vue'
import Header from '@/components/Admin/Header.vue'
import CardEdit from '@/components/Admin/CardEdit.vue'
import { useAuth } from '@/composables/useAuth'

// ✅ Use your Supabase client path (adjust if your project uses a different import)
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

type IssuanceType = {
  id: string
  name: string
  description: string | null
  active: boolean
}

const issuanceTypes = ref<IssuanceType[]>([])
const loading = ref(false)
const error = ref<string>('')

async function fetchIssuanceTypes() {
  loading.value = true
  error.value = ''
  try {
    // ✅ You said “call the 4 issuance type from the database”
    const { data, error: e } = await supabase
      .from('issuance_types')
      .select('id,name,description,active')
      .eq('active', true)
      .order('created_at', { ascending: true })
      .limit(4)

    if (e) throw e
    issuanceTypes.value = data ?? []
  } catch (err: any) {
    issuanceTypes.value = []
    error.value = err?.message || 'Failed to load issuance types.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchIssuanceTypes()
})
</script>
