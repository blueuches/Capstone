<template>
  <div class="h-screen overflow-hidden bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <main class="flex-1 px-4 pt-4 flex flex-col min-h-0">
      <!-- Breadcrumb -->
      <RouterLink
        to="/senior/dashboard"
        class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4"
      >
        <component :is="Left" class="w-5 h-5 text-yellow-500" />
        <span class="text-gray-500">Dashboard</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900">Applications</span>
      </RouterLink>

      <!-- Title -->
      <div class="mb-3">
        <h1 class="text-xl font-bold text-gray-900">Applications & Programs</h1>
        <p class="text-sm text-gray-500">
          Read and view information about applications and their requirements.
        </p>
      </div>

      <!-- Optional helper / note -->
      <div class="mb-4 rounded-3xl bg-white border border-gray-200 p-4">
        <p class="text-sm text-gray-700 text-center">
          To apply to one of these, 
          <RouterLink to="/senior/dashboard/apply" class="font-semibold text-black">click here</RouterLink>.
        </p>
      </div>

      <!-- ✅ Tile Grid (only this scrolls if ever needed) -->
      <section class="flex-1 min-h-0 overflow-y-auto pr-1">
        <div class="grid grid-cols-2 gap-4 pb-3">
          <ApplyItem
            v-for="item in applyItems"
            :key="item.id"
            :title="item.title"
            :subtitle="item.subtitle"
            :disabled="item.disabled"
            @apply="onApply(item)"
          />
        </div>
      </section>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import ApplyItem from '@/components/Senior/ApplyItem.vue'
import Left from '@/assets/icons/senior/left-arrow.svg'

type ApplyOption = {
  id: string
  title: string
  subtitle?: string
  disabled?: boolean
  route: string
}

const open = ref(false)
const router = useRouter()

// TEMP DATA (replace later with DB-driven services)
const applyItems = ref<ApplyOption[]>([
  {
    id: 'new',
    title: 'NEW\nAPPLICATION',
    subtitle: 'View Info',
    route: '/senior/dashboard/applications/info'
  },
  {
    id: 'lost',
    title: 'LOST ID CARD',
    subtitle: 'View Info',
    route: '/senior/dashboard/applications/info'
  },
  {
    id: 'damaged',
    title: 'CHANGE OR\nDAMAGED\nID CARD',
    subtitle: 'View Info',
    route: '/senior/dashboard/applications/info'
  },
  {
    id: 'transfer',
    title: 'TRANSFEREE\nFROM\nOTHER\nCITY\nMUNICIPALITY',
    subtitle: 'View Info',
    route: '/senior/dashboard/applications/info',
    disabled: false
  }
])

function onApply(item: ApplyOption) {
  if (item.disabled) return

  // Placeholder: you can replace this with "create application then route"
  // For now, just route directly.
  router.push(item.route)
}
</script>
