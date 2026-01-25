<!-- views/Staff/Admin/EditIssuanceRequirements.vue -->
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

      <!-- Top row: Back + Title -->
      <div class="flex items-center justify-between mt-2 ml-3 mr-3 mb-4">
        <!-- Back -->
        <RouterLink
          :to="backTo"
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

        <!-- Title -->
        <div class="min-w-0 text-right">
          <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
            Requirements for {{ issuanceName || 'Issuance Type' }}
          </h1>
          <p v-if="loading" class="text-xs text-gray-500 mt-1">Loading…</p>
          <p v-else-if="error" class="text-xs text-red-600 mt-1">{{ error }}</p>
        </div>
      </div>

      <main class="flex-1 overflow-y-auto">
        <div class="px-4 sm:px-8 py-6">
          <div class="max-w-7xl mx-auto">
            <!-- Layout like screenshot: grid left, Add on right -->
            <div class="flex items-start gap-8">
              <!-- Grid of rectangles -->
              <div class="flex-1">
                <div
                  class="grid gap-6
                         grid-cols-1
                         sm:grid-cols-2
                         lg:grid-cols-3
                         xl:grid-cols-4"
                >
                  <Rectangle
                    v-for="r in requirements"
                    :key="r.id"
                    :title="r.title"
                    :to="`/admin/edit/requirements/edit/${r.id}`"
                  />
                </div>

                <!-- Empty state -->
                <div
                  v-if="!loading && requirements.length === 0"
                  class="text-sm text-gray-500 text-center py-16"
                >
                  No requirements linked to this issuance type yet.
                </div>
              </div>

              <!-- Add button (disabled) on the right -->
              <div class="shrink-0 pt-1">
                <button
                  type="button"
                  disabled
                  class="flex flex-col items-center gap-2
                         disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span
                    class="w-14 h-14 rounded-full bg-[#2e6b38] text-white
                           flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </span>

                  <span class="text-sm font-semibold text-gray-600">Add</span>
                </button>
              </div>
            </div>
            <!-- end flex -->
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Admin/Sidebar.vue'
import Header from '@/components/Admin/Header.vue'
import Rectangle from '@/components/Admin/Rectangle.vue'
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

const route = useRoute()
const issuanceTypeId = computed(() => route.params.id as string)

// Back should go to the issuance edit page (the one that has "Edit requirements" link)
const backTo = computed(() => ({
  name: 'EditIssuance', // ✅ change if your route name is different
  params: { id: issuanceTypeId.value }
}))

const issuanceName = ref('')
const loading = ref(false)
const error = ref('')

type RequirementItem = {
  id: string
  title: string
}

const requirements = ref<RequirementItem[]>([])

async function fetchIssuanceAndRequirements() {
  if (!issuanceTypeId.value) return

  loading.value = true
  error.value = ''

  try {
    // 1) Issuance type (for title)
    const { data: issuance, error: e1 } = await supabase
      .from('issuance_types')
      .select('id,name')
      .eq('id', issuanceTypeId.value)
      .maybeSingle()

    if (e1) throw e1
    issuanceName.value = issuance?.name ?? ''

    // 2) Requirements linked to this issuance type
    const { data, error: e2 } = await supabase
      .from('issuance_type_requirements')
      .select(
        `
        sort_order,
        requirements:requirement_id (
          id,
          name
        )
      `
      )
      .eq('issuance_type_id', issuanceTypeId.value)
      .order('sort_order', { ascending: true })

    if (e2) throw e2

    requirements.value =
      (data ?? [])
        .map((row: any) => {
          const req = row?.requirements
          if (!req?.id) return null
          return {
            id: req.id as string,
            title: req.name as string
          }
        })
        .filter(Boolean) as RequirementItem[]
  } catch (err: any) {
    requirements.value = []
    error.value = err?.message || 'Failed to load issuance requirements.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchIssuanceAndRequirements)
watch(issuanceTypeId, () => fetchIssuanceAndRequirements())
</script>
