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
        </div>
        
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
