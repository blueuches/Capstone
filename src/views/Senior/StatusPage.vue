<template>
  <div class="min-h-screen bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <main class="flex-1 px-4 pt-4">
      <!-- Breadcrumb -->
      <RouterLink
        to="/senior/dashboard"
        class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4"
      >
        <component
          :is="Left"
          class="w-5 h-5 text-yellow-500"
        />
        <span class="text-gray-500">Dashboard</span>
        <span>/</span>
        <span class="text-gray-900">My Status</span>
      </RouterLink>

      <!-- Empty state -->
      <p
        v-if="applications.length === 0"
        class="text-center text-gray-500 mt-12"
      >
        You have no application yet
      </p>

      <!-- Status list -->
      <div v-else class="space-y-4">
        <StatusItem
          v-for="app in applications"
          :key="app.id"
          :title="app.title"
          :status-label="app.statusLabel"
          :started-at="app.startedAt"
          :requirements-link="app.requirementsLink"
          :update="app.update"
          :unread-count="app.unreadCount"
        />
      </div>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import StatusItem from '@/components/Senior/StatusItem.vue'
import Left from '@/assets/icons/senior/left-arrow.svg'

const open = ref(false)

const applications = ref([
  {
    id: 1,
    title: 'NEW APPLICATION',
    statusLabel: 'Draft',
    startedAt: 'January 15, 2026',
    requirementsLink: '/senior/dashboard/myrequirements/list',
    update: '/senior/dashboard/mystatus/updates',
    unreadCount: 0
  },
  {
    id: 2,
    title: 'LOST ID CARD',
    statusLabel: 'Needs Correction',
    startedAt: 'January 15, 2026',
    requirementsLink: '/senior/dashboard/myrequirements/list',
    update: '/senior/dashboard/mystatus/updates',
    unreadCount: 1
  }
])
</script>
