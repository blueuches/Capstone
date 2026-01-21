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

            <RouterLink
        to="/admin/edit/issuance"
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


      <!-- Main scroll area -->
      <main class="flex-1 overflow-y-auto">
        <div class="px-4 sm:px-8 py-6">
        </div>
        Hhh
        
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Sidebar from '@/components/Admin/Sidebar.vue'
import Header from '@/components/Admin/Header.vue'
import DashboardRectangle from '@/components/Admin/DashboardRectangle.vue'
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

const { logout, profile } = useAuth()

const sidebarCollapsed = ref(false)

// If you have staff name in profile, this will show it.
// Fallback keeps your prototype text style.
const staffName = computed(() => {
  const p = profile.value as any
  const full = [p?.first_name, p?.last_name].filter(Boolean).join(' ').trim()
  return full || 'Lando Norris'
})
</script>
