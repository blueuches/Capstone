<template>
  <!-- LOCK the page scroll -->
  <div class="h-screen overflow-hidden bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <!-- main must be flex column and allow children to shrink -->
    <main class="flex-1 px-4 pt-4 flex flex-col min-h-0">
      <!-- Breadcrumb -->
      <RouterLink
        to="/senior/dashboard/myrequirements"
        class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4"
      >
        <component :is="Left" class="w-5 h-5 text-yellow-500" />
        <span class="text-gray-500">Dashboard</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-500">My Requirements</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900">Requirement List</span>
      </RouterLink>

      <!-- Title -->
      <div class="mb-3">
        <h1 class="text-xl font-bold text-gray-900">Requirement List</h1>
        <p class="text-sm text-gray-500">
          View and manage the files you submitted for this application.
        </p>
      </div>

      <!-- Application summary -->
      <div class="mb-4 rounded-3xl bg-white border border-gray-200 p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-bold text-gray-900 mt-1">OSCA ID Issuance</p>
            <p class="text-xs text-gray-500 mt-1">
              Status: <span class="font-semibold text-emerald-700">Draft</span>
            </p>
          </div>

          <button
            class="px-3 py-2 rounded-2xl text-sm font-semibold bg-gray-50 border border-gray-200 active:scale-[0.99]"
            @click="refreshList"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- ✅ ONLY SCROLLABLE AREA -->
      <div class="flex-1 min-h-0 overflow-y-auto pr-1">
        <RequirementList
          :items="requirements"
          @view="onView"
          @edit="onEdit"
          @delete="onDelete"
        />

        <div class="mt-4 text-xs text-gray-500 pb-3">
          Tip: Requirements without a checkmark mean there is no uploaded record yet.
        </div>
      </div>
    </main>

    <BottomNav />
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import RequirementList from '@/components/Senior/RequirementList.vue'
import Left from '@/assets/icons/senior/left-arrow.svg'

type RequirementItem = {
  id: string
  title: string
  subtitle?: string
  // ✅ if false => no checkmark
  hasRecord: boolean
  // placeholder fields you can map later from DB
  recordCount?: number
  updatedAt?: string
}

const open = ref(false)
const router = useRouter()

const requirements = ref<RequirementItem[]>([])

function loadTempRequirements() {
  // TEMP DATA — replace later with Supabase fetch
  requirements.value = [
    {
      id: 'req-1',
      title: 'Duly Accomplished OSCA ID Application Form',
      subtitle: 'Uploaded: 1 file • Updated: Jan 17, 2026',
      hasRecord: true,
      recordCount: 1,
      updatedAt: '2026-01-17'
    },
    {
      id: 'req-2',
      title: 'Proof of Birthdate',
      subtitle: 'View the list of what you can send',
      hasRecord: false, // ✅ no checkmark
      recordCount: 0
    },
    {
      id: 'req-3',
      title: '1x1 ID Picture',
      subtitle: 'No file yet',
      hasRecord: false
    },
    {
      id: 'req-4',
      title: 'Proof of Residency',
      subtitle: 'Uploaded: 2 files • Updated: Jan 16, 2026',
      hasRecord: true,
      recordCount: 2,
      updatedAt: '2026-01-16'
    }
  ]
}

function refreshList() {
  // Placeholder "refresh"
  loadTempRequirements()
}

function onView(item: RequirementItem) {
  // Placeholder: route to a future requirement view page
  // e.g. /senior/requirements/app-001/req-1
  router.push(`/senior/requirements/view/${item.id}`)
}

function onEdit(item: RequirementItem) {
  // Placeholder: route to a future requirement upload/edit page
  router.push(`/senior/requirements/edit/${item.id}`)
}

function onDelete(item: RequirementItem) {
  // Placeholder delete action
  const ok = confirm(`Delete record for "${item.title}"?`)
  if (!ok) return

  // pretend we deleted it: remove record/checkmark
  requirements.value = requirements.value.map((r) =>
    r.id === item.id
      ? { ...r, hasRecord: false, recordCount: 0, subtitle: 'No file yet' }
      : r
  )
}

onMounted(() => {
  loadTempRequirements()
})
</script>
