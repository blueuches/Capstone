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
        <component :is="Left" class="w-5 h-5 text-yellow-500" />
        <span class="text-gray-500">Dashboard</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900">My Requirements</span>
      </RouterLink>

      <!-- Page Title -->
      <div class="mb-3">
        <h1 class="text-xl font-bold text-gray-900">My Requirements</h1>
        <p class="text-sm text-gray-500">
          Track your applications and the requirements you’ve submitted.
        </p>
      </div>

      <!-- Optional quick filter (placeholder functionality) -->
      <div class="mb-4 flex items-center gap-2">
        <button
          class="px-3 py-2 rounded-xl text-sm font-semibold border"
          :class="filter === 'all' ? 'bg-white border-gray-300 text-gray-900' : 'bg-transparent border-gray-200 text-gray-600'"
          @click="filter = 'all'"
        >
          All
        </button>
        <button
          class="px-3 py-2 rounded-xl text-sm font-semibold border"
          :class="filter === 'ongoing' ? 'bg-white border-gray-300 text-gray-900' : 'bg-transparent border-gray-200 text-gray-600'"
          @click="filter = 'ongoing'"
        >
          Ongoing
        </button>
        <button
          class="px-3 py-2 rounded-xl text-sm font-semibold border"
          :class="filter === 'completed' ? 'bg-white border-gray-300 text-gray-900' : 'bg-transparent border-gray-200 text-gray-600'"
          @click="filter = 'completed'"
        >
          Completed
        </button>
      </div>

      <!-- List -->
      <div v-if="loading" class="space-y-3">
        <div
          v-for="i in 3"
          :key="i"
          class="h-20 rounded-2xl bg-white border border-gray-200 overflow-hidden relative"
        >
          <div class="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100"></div>
        </div>
      </div>

      <div v-else>
        <div v-if="filteredApplications.length" class="space-y-3">
          <RequirementItem
            v-for="app in filteredApplications"
            :key="app.id"
            :tag="app.tag"
            :service="app.service"
            :requirements-sent="app.requirementsSent"
            :requirements-total="app.requirementsTotal"
            :route="app.route"
            :status="app.status"
          />
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="mt-10 bg-white border border-gray-200 rounded-3xl p-6 text-center"
        >
          <div
            class="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3"
          >
            <span class="text-2xl">📄</span>
          </div>
          <h2 class="text-lg font-bold text-gray-900">No Application To Show</h2>
          <p class="text-sm text-gray-500 mt-1">
            Once you start an application, it will appear here for tracking.
          </p>

          <!-- Placeholder CTA -->
          <RouterLink
            to="/senior/services"
            class="inline-flex items-center justify-center mt-4 px-4 py-2 rounded-2xl bg-[#42ad43] text-white font-semibold text-sm active:scale-[0.99]"
          >
            Browse Services
          </RouterLink>
        </div>
      </div>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import RequirementItem from '@/components/Senior/RequirementItem.vue'
import { useAuth } from '@/composables/useAuth'
import Left from '@/assets/icons/senior/left-arrow.svg'

type AppStatus = 'ongoing' | 'completed'

type ApplicationCard = {
  id: string
  tag: string // e.g., "NEW APPLICATION", "LOST ID CARD"
  service: string // e.g., "OSCA ID Issuance"
  requirementsSent: number
  requirementsTotal: number
  status: AppStatus
  route: string
}

const { profile } = useAuth()
const open = ref(false)

const loading = ref(true)
const filter = ref<'all' | 'ongoing' | 'completed'>('all')

// TEMP DATA (replace later with real Supabase fetch)
const applications = ref<ApplicationCard[]>([])

const filteredApplications = computed(() => {
  if (filter.value === 'all') return applications.value
  return applications.value.filter(a => a.status === filter.value)
})

// Placeholder “fetch”
async function loadApplications() {
  loading.value = true

  // simulate network delay so UI skeleton is visible
  await new Promise((r) => setTimeout(r, 450))

  // ✅ TEMP cards matching your screenshot
  applications.value = [
    {
      id: 'app-001',
      tag: 'NEW APPLICATION',
      service: 'OSCA ID Issuance',
      requirementsSent: 1,
      requirementsTotal: 7,
      status: 'ongoing',
      route: '/senior/dashboard/myrequirements/list'
    },
    {
      id: 'app-002',
      tag: 'LOST ID CARD',
      service: 'OSCA ID Issuance',
      requirementsSent: 6,
      requirementsTotal: 7,
      status: 'ongoing',
      route: '/senior/dashboard/myrequirements/list'
    }
  ]

  // If you want to test the empty state, just set:
  // applications.value = []

  loading.value = false
}

onMounted(() => {
  loadApplications()
})
</script>
