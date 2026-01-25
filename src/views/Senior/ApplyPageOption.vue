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

      <!-- Title -->
      <div class="mb-3">
        <h1 class="text-xl font-bold text-gray-900">Choose what application to continue</h1>
        <p class="text-sm text-gray-500">
          Continue submitting
        </p>
      </div>

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

      <ConfirmModal
        :open="confirmOpen"
        :title="confirmTitle"
        :message="confirmMessage"
        :confirmText="confirmText"
        cancelText="Cancel"
        @cancel="confirmOpen=false"
        @confirm="handleConfirm"
      />
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
import ConfirmModal from '@/components/ConfirmModal.vue'
import Left from '@/assets/icons/senior/left-arrow.svg'

import { supabase } from '@/supabase/client'

type ApplyOption = {
  id: 'continue' | 'another'
  title: string
  subtitle?: string
  disabled?: boolean
}

const props = defineProps<{ issuanceTypeId: string }>()

const open = ref(false)
const router = useRouter()

const latestAppId = ref<string | null>(null)

// 2 cards only
const applyItems = ref<ApplyOption[]>([
  { id: 'continue', title: 'Continue Submission', subtitle: 'Continue Submission', disabled: false },
  { id: 'another', title: 'Apply For Another', subtitle: 'Apply For Another', disabled: false }
])

// ConfirmModal state
const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmText = ref('Confirm')
const pendingAction = ref<null | (() => Promise<void>)>(null)

function askConfirm(
  title: string,
  message: string,
  onConfirm: () => Promise<void>,
  confirmBtnText = 'Confirm'
) {
  confirmTitle.value = title
  confirmMessage.value = message
  confirmText.value = confirmBtnText
  pendingAction.value = onConfirm
  confirmOpen.value = true
}

async function handleConfirm() {
  confirmOpen.value = false
  if (pendingAction.value) await pendingAction.value()
}

onMounted(async () => {
  const { data: authRes, error: authErr } = await supabase.auth.getUser()
  if (authErr) return console.error(authErr)

  const seniorId = authRes.user?.id
  if (!seniorId) return

  const { data, error } = await supabase
    .from('applications')
    .select('id, created_at')
    .eq('senior_id', seniorId)
    .eq('issuance_type_id', props.issuanceTypeId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) return console.error(error)
  latestAppId.value = data?.[0]?.id ?? null

  // if for some reason none exists, disable "Continue"
  if (!latestAppId.value) {
    applyItems.value = applyItems.value.map((x) =>
      x.id === 'continue' ? { ...x, disabled: true } : x
    )
  }
})

function onApply(item: ApplyOption) {
  if (item.disabled) return

  if (item.id === 'continue') {
  onContinue()
  return
  }

  // Apply For Another → confirm → create new → go submit
  askConfirm(
    'Apply for Another',
    'You have an existing application, continue for another?',
    async () => {
      const { data: authRes, error: authErr } = await supabase.auth.getUser()
      if (authErr) return console.error(authErr)

      const seniorId = authRes.user?.id
      if (!seniorId) return

      const appId = await createApplication(seniorId, props.issuanceTypeId)
      if (appId) router.push({ name: 'ApplyPageSubmit', params: { applicationId: appId } })
    },
    'Apply'
  )
}

function onContinue() {
  router.push({
    name: 'ApplyPageContinueList',
    params: { issuanceTypeId: props.issuanceTypeId }
  })
}


async function createApplication(seniorId: string, issuanceTypeId: string) {
  // 1) get barangay_id of senior from profiles
  const { data: profile, error: profErr } = await supabase
    .from('profiles')
    .select('barangay_id')
    .eq('id', seniorId)
    .single()

  if (profErr) {
    console.error('Failed to load profile barangay_id:', profErr)
    return null
  }

  const barangayId = profile?.barangay_id
  if (!barangayId) {
    console.error('No barangay_id found for this senior profile.')
    return null
  }

  // 2) create application with barangay_id
  const { data: app, error } = await supabase
    .from('applications')
    .insert({
      senior_id: seniorId,
      issuance_type_id: issuanceTypeId,
      barangay_id: barangayId,
      status: 'draft'
    })
    .select('id')
    .single()

  if (error) {
    console.error('createApplication error:', error)
    return null
  }

  // 3) seed requirements (correct FK)
  try {
    await seedApplicationRequirements(app.id, issuanceTypeId)
  } catch (e) {
    console.warn('seedApplicationRequirements skipped:', e)
  }

  return app.id as string
}

async function seedApplicationRequirements(applicationId: string, issuanceTypeId: string) {
  // Get the issuance_type_requirements rows for this issuance type
  const { data: itReqs, error: itErr } = await supabase
    .from('issuance_type_requirements')
    .select('id, is_required')
    .eq('issuance_type_id', issuanceTypeId)
    .order('sort_order', { ascending: true })

  if (itErr) throw itErr
  if (!itReqs?.length) return

  // Usually we only seed required ones
  const requiredRows = itReqs.filter((r: any) => r.is_required)

  if (!requiredRows.length) return

  const payload = requiredRows.map((r: any) => ({
    application_id: applicationId,
    issuance_type_requirement_id: r.id, // ✅ correct FK
    status: 'pending'
  }))

  const { error: insErr } = await supabase
    .from('application_requirements')
    .insert(payload)

  if (insErr) throw insErr
}

</script>
