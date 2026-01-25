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
        <span class="text-gray-900">Apply</span>
      </RouterLink>

      <!-- Title -->
      <div class="mb-3">
        <h1 class="text-xl font-bold text-gray-900">Apply</h1>
        <p class="text-sm text-gray-500">
          Choose the service you want to apply for.
        </p>
      </div>

      <!-- Optional helper / note -->
      <div class="mb-4 rounded-3xl bg-white border border-gray-200 p-4">
        <p class="text-sm text-gray-700">
          Tip: If you already have an ongoing application, you can continue it in
          <RouterLink to="/senior/dashboard/myrequirements" class="font-semibold text-black">My Requirements</RouterLink>.
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
  id: string
  title: string
  subtitle?: string
  disabled?: boolean
}

type IssuanceTypeRow = {
  id: string
  name: string
  description: string | null
  active: boolean
}

const open = ref(false)
const router = useRouter()

const applyItems = ref<ApplyOption[]>([])

// ConfirmModal state
const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmText = ref('Apply')
const pendingAction = ref<null | (() => Promise<void>)>(null)

function askConfirm(
  title: string,
  message: string,
  onConfirm: () => Promise<void>,
  confirmBtnText = 'Apply'
) {
  confirmTitle.value = title
  confirmMessage.value = message
  confirmText.value = confirmBtnText
  pendingAction.value = onConfirm
  confirmOpen.value = true
}

onMounted(async () => {
  const { data, error } = await supabase
    .from('issuance_types')
    .select('id, name, description, active')
    .eq('active', true)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to load issuance_types:', error)
    applyItems.value = []
    return
  }

  const rows = (data ?? []) as IssuanceTypeRow[]
  applyItems.value = rows.map((row) => ({
    id: row.id,
    title: row.name,
    subtitle: 'Click to Apply',
    disabled: false
  }))
})

async function onApply(item: ApplyOption) {
  if (item.disabled) return

  const { data: authRes, error: authErr } = await supabase.auth.getUser()
  if (authErr) {
    console.error('auth error:', authErr)
    return
  }

  const seniorId = authRes.user?.id
  if (!seniorId) return

  // check existing applications under this issuance type
  const { data: existingApps, error } = await supabase
    .from('applications')
    .select('id, status,barangay_id, created_at')
    .eq('senior_id', seniorId)
    .eq('issuance_type_id', item.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('existingApps error:', error)
    return
  }

  if ((existingApps?.length ?? 0) === 0) {
    // confirm → create → go submit
    askConfirm(
      'Apply',
      'Do you want to apply for this?',
      async () => {
        const appId = await createApplication(seniorId, item.id)
        if (appId) {
          router.push({ name: 'ApplyPageSubmit', params: { applicationId: appId } })
        }
      },
      'Apply'
    )
    return
  }

  // has existing → go option page for that issuance type
  router.push({ name: 'ApplyPageOption', params: { issuanceTypeId: item.id } })
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

async function handleConfirm() {
  confirmOpen.value = false
  if (pendingAction.value) await pendingAction.value()
}
</script>
