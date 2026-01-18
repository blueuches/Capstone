<template>
  <!-- Entire page locked; only main content scrolls -->
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <!-- Sidebar (fixed height, not scrollable) -->
    <Sidebar :collapsed="sidebarCollapsed" />

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
          <!-- Center area like your prototype -->
          <div class="max-w-5xl mx-auto">
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
              <div class="text-center">
                <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                  SeniorGo
                </h1>

                <p class="mt-6 text-sm sm:text-base text-gray-700">
          
                  <span class="font-semibold">
                   Admin
                  </span>
                </p>

                <!-- Buttons row -->
                <div class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                  <DashboardRectangle label="View logs and activities" to="/admin/logs" />
                  <DashboardRectangle label="View users within the system" to="/admin/users" />
                  <DashboardRectangle label="View and do backups" to="/admin/backup" />
                </div>
              </div>
            </div>
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
import DashboardRectangle from '@/components/Admin/DashboardRectangle.vue'
import { useAuth } from '@/composables/useAuth'

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
