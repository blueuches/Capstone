<template>
  <!-- LOCK the page scroll -->
  <div class="h-screen overflow-hidden bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <main class="flex-1 px-4 pt-4 flex flex-col min-h-0">
      <!-- Breadcrumb -->
      <RouterLink
        to="/senior/dashboard/apply"
        class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4"
      >
        <component :is="Left" class="w-5 h-5 text-yellow-500" />
        <span class="text-gray-500">Dashboard</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-500">Apply</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900">Submit</span>
      </RouterLink>

      <!-- Title -->
      <div class="mb-3">
        <h1 class="text-xl font-bold text-gray-900">Submission</h1>
        <p class="text-sm text-gray-500">
          Submit your documents and form for this application.
        </p>
      </div>

      <!-- Small status card (optional but aligned with your style) -->
      <div class="mb-4 rounded-3xl bg-white border border-gray-200 p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-bold text-gray-900">OSCA ID Issuance</p>
            <p class="text-xs text-gray-500 mt-1">
              Status: <span class="font-semibold text-emerald-700">Draft</span>
            </p>
          </div>
        </div>
      </div>

      <!-- ✅ ONLY SCROLLABLE AREA -->
      <div class="flex-1 min-h-0 overflow-y-auto pr-1">
        <ApplyList :items="requirements" @action="onAction" />

        <div class="mt-4 text-xs text-gray-500 pb-3">
          Tip: Complete all items before final submission.
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
import ApplyList from '@/components/Senior/ApplyList.vue'
import Left from '@/assets/icons/senior/left-arrow.svg'

type ReqKind = 'form' | 'file'

type RequirementItem = {
  id: string
  title: string
  subtitle?: string
  kind: ReqKind // ✅ determines button label (Answer vs Submit)
  hasRecord: boolean // placeholder: completed or not
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
      subtitle: 'Fill out the form fields required for your application.',
      kind: 'form',
      hasRecord: true
    },
    {
      id: 'req-2',
      title: 'Proof of Birthdate',
      subtitle: 'View the list of what you can send.',
      kind: 'file',
      hasRecord: false
    },
    {
      id: 'req-3',
      title: '1x1 ID Picture',
      subtitle: 'Upload a clear photo with white background.',
      kind: 'file',
      hasRecord: false
    },
    {
      id: 'req-4',
      title: 'Proof of Residency',
      subtitle: 'Barangay certification or any valid proof.',
      kind: 'file',
      hasRecord: true
    }
  ]
}

function refreshList() {
  loadTempRequirements()
}

function onAction(item: RequirementItem) {
  // Placeholder navigation based on type
  if (item.kind === 'form') {
    router.push(`/senior/dashboard/apply/form/${item.id}`)
    return
  }
  router.push(`/senior/apply/upload/${item.id}`)
}

onMounted(() => loadTempRequirements())
</script>
