<template>
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
        <span class="text-gray-900">Apply</span>
      </RouterLink>

      <div class="mb-3">
        <h1 class="text-xl font-bold text-gray-900">Choose an application</h1>
        <p class="text-sm text-gray-500">Select which submission you want to continue.</p>
      </div>

      <section class="flex-1 min-h-0 overflow-y-auto pr-1">
        <div class="grid grid-cols-2 gap-4 pb-3">
          <ApplyItem
            v-for="item in appItems"
            :key="item.id"
            :title="item.title"
            :subtitle="item.subtitle"
            :disabled="item.disabled"
            @apply="goToSubmit(item.id)"
          />
        </div>
      </section>
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
import ApplyItem from '@/components/Senior/ApplyItem.vue'
import Left from '@/assets/icons/senior/left-arrow.svg'

import { supabase } from '@/supabase/client'

const props = defineProps<{ issuanceTypeId: string }>()

type AppCard = {
  id: string // application_id
  title: string
  subtitle: string
  disabled?: boolean
}

const open = ref(false)
const router = useRouter()

const appItems = ref<AppCard[]>([])

function prettyDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(async () => {
  const { data: authRes, error: authErr } = await supabase.auth.getUser()
  if (authErr) return console.error(authErr)

  const seniorId = authRes.user?.id
  if (!seniorId) return

  const { data, error } = await supabase
    .from('applications')
    .select('id, status, created_at')
    .eq('senior_id', seniorId)
    .eq('issuance_type_id', props.issuanceTypeId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to load applications:', error)
    appItems.value = []
    return
  }

  const apps = data ?? []

  appItems.value = apps.map((a, index) => ({
    id: a.id,
    title: `Application ${index + 1}`,
    subtitle: `${(a.status ?? 'draft').toString().toUpperCase()} • ${prettyDate(a.created_at)}`
  }))
})

function goToSubmit(applicationId: string) {
  router.push({ name: 'ApplyPageSubmit', params: { applicationId } })
}
</script>
