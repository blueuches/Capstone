<!-- views/Staff/Admin/EditRequirementsOptionEdit.vue -->
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

      <div class="flex items-center justify-between mt-2 ml-3 mr-3 mb-4">
        <!-- Back -->
        <RouterLink
          to="/admin/edit/requirements"
          class="inline-flex items-center gap-2
                 text-gray-700 hover:text-[#2e6b38]
                 group shrink-0"
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

        <!-- Page title -->
        <div class="min-w-0 text-right">
          <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
            Edit '{{ requirementName || 'Requirement' }}'
          </h1>
          <p v-if="loading" class="text-xs text-gray-500 mt-1">Loading…</p>
          <p v-else-if="error" class="text-xs text-red-600 mt-1">{{ error }}</p>
        </div>
      </div>

      <main class="flex-1 overflow-y-auto">
        <div class="px-4 sm:px-8 py-10">
          <div class="max-w-6xl mx-auto">
            <div class="flex flex-col lg:flex-row items-start justify-between gap-10">
              <!-- Left: fields (disabled for now if you want read-only) -->
              <EditFields
                v-model:name="form.name"
                v-model:requirementKind="form.requirement_kind"
                v-model:notes="form.notes"
                :disabled="false"
              />
              <!-- Right: Save button (disabled for now) -->
              <div class="w-full lg:w-auto flex justify-start lg:justify-end pt-2 lg:pt-10">
                <button
                  type="button"
                  disabled
                  class="px-12 py-4 rounded-xl bg-[#2e6b38] text-white font-extrabold
                         disabled:opacity-70 disabled:cursor-not-allowed
                         shadow-sm"
                >
                  Save
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
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Admin/Sidebar.vue'
import Header from '@/components/Admin/Header.vue'
import EditFields from '@/components/Admin/EditFieldsRequirements.vue'
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

type RequirementKind = 'document' | 'form' | 'info_only'

const route = useRoute()
const requirementId = computed(() => route.params.id as string)

const form = ref<{
  name: string
  requirement_kind: RequirementKind
  notes: string
}>({
  name: '',
  requirement_kind: 'document',
  notes: ''
})

const requirementName = ref('')
const loading = ref(false)
const error = ref('')

async function fetchRequirement() {
  if (!requirementId.value) return
  loading.value = true
  error.value = ''
  try {
    const { data, error: e } = await supabase
      .from('requirements')
      .select('id,name,requirement_kind,notes')
      .eq('id', requirementId.value)
      .maybeSingle()

    if (e) throw e
    if (!data) {
      requirementName.value = ''
      form.value = { name: '', requirement_kind: 'document', notes: '' }
      error.value = 'Requirement not found.'
      return
    }

    requirementName.value = data.name ?? ''
    form.value = {
      name: data.name ?? '',
      requirement_kind: (data.requirement_kind ?? 'document') as RequirementKind,
      notes: data.notes ?? ''
    }
  } catch (err: any) {
    error.value = err?.message || 'Failed to load requirement.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchRequirement)
watch(requirementId, () => fetchRequirement())

const staffName = computed(() => {
  const p = profile.value as any
  const full = [p?.first_name, p?.last_name].filter(Boolean).join(' ').trim()
  return full || 'Lando Norris'
})
</script>
