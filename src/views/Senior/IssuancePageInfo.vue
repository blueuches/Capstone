<!-- views/Senior/IssuancePageInfo.vue -->
<template>
  <div class="h-screen overflow-hidden bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <main class="flex-1 px-4 pt-4 min-h-0 overflow-y-auto">
      <!-- Breadcrumb -->
      <RouterLink
        to="/senior/dashboard/applications"
        class="flex gap-2 text-sm font-semibold text-gray-700 mb-4"
      >
        <component :is="Left" class="w-5 h-5 text-yellow-500" />
        <span class="text-gray-500">Dashboard</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900">Applications</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900">Info</span>
      </RouterLink>

      <!-- Title -->
      <div class="mb-3">
        <h1 class="text-xl font-bold text-gray-900">
          OSCA ID Application
        </h1>
      </div>

      <!-- Optional helper / note -->
      <div class="mb-4 rounded-3xl bg-white border border-gray-200 p-2">
        <p class="font-semibold text-gray-700 text-center">
          {{ issuanceType?.name || 'New Application' }}
        </p>
      </div>

      <Block title="Description">
        <!-- ✅ Replace only this text with issuance_types.description -->
        <p class="text-sm text-gray-700 leading-relaxed">
          {{ issuanceType?.description || '' }}
        </p>

        <!-- ✅ Keep these unchanged as requested -->
        <div class="mt-3 text-xs text-gray-500 space-y-1">
          <p><strong>Office:</strong> CSWD – Office for Senior Citizens Affairs</p>
          <p><strong>Classification:</strong> Simple</p>
          <p><strong>Transaction Type:</strong> Government to Citizen (G2C)</p>
          <p><strong>Who may avail:</strong> Residents of Butuan City aged 60 years old and above</p>
        </div>
      </Block>

      <Block title="List of Requirements">
        <ul class="space-y-3">
          <li
            v-for="(req, index) in requirements"
            :key="req.id"
            class="border rounded-xl p-3"
          >
            <p class="text-sm font-semibold text-gray-800">
              {{ index + 1 }}. {{ req.name }}
            </p>

            <p class="text-xs text-gray-600 mt-1">
              {{ req.note }}
            </p>
          </li>
        </ul>
      </Block>

      <!-- ✅ Don't change Process part -->
      <Block title="Process">
        <ol class="space-y-4">
          <li
            v-for="(item, index) in processSteps"
            :key="index"
            class="flex gap-3"
          >
            <div class="flex w-7 h-7 rounded-full bg-green-500 text-white text-xs font-bold">
              {{ index + 1 }}
            </div>

            <div>
              <p class="text-sm font-semibold text-gray-800">
                {{ item.step }}
              </p>
              <p class="text-xs text-gray-500">
                Processing Time: {{ item.time }}
              </p>
              <p class="text-xs text-gray-500">
                Person Responsible: {{ item.person }}
              </p>
            </div>
          </li>
        </ol>

        <div class="mt-4 text-xs text-gray-600 font-semibold">
          Total Processing Time: 2 hours and 45 minutes
        </div>
      </Block>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import Left from '@/assets/icons/senior/left-arrow.svg'
import Block from '@/components/Senior/Block.vue'

import { supabase } from '@/supabase/client'

const open = ref(false)

const props = defineProps<{
  id: string // issuance_type_id from route param
}>()

type IssuanceTypeRow = {
  id: string
  name: string
  description: string | null
  active: boolean
}

type RequirementRow = {
  id: string
  name: string
  requirement_kind: string
  notes: string | null
}

type IssuanceTypeRequirementRow = {
  id: string
  issuance_type_id: string
  requirement_id: string
  is_required: boolean
  sort_order: number
  validity_days: number | null
  doc_rules: any | null
  requirements: RequirementRow | null // ✅ single object
}

const issuanceType = ref<IssuanceTypeRow | null>(null)

const requirements = ref<
  Array<{
    id: string
    name: string
    note: string
    copies: string
    source: string
    requirementKind?: string
    isRequired?: boolean
    validityDays?: number | null
  }>
>([])

const processSteps = ref([
  { step: 'Sign in the client logbook', time: '1 minute', person: 'Guard on Duty' },
  { step: 'Submit required documents', time: '2 hours and 18 minutes', person: 'Administrative Assistant (OSCA)' },
  { step: 'Verify information and sign', time: '18 minutes', person: 'OSCA Clerk' },
  { step: 'Receive OSCA ID and provide feedback', time: '9 minutes', person: 'Administrative Assistant (OSCA)' }
])

function pickDocRule(docRules: any, key: string): string | null {
  if (!docRules) return null
  // supports either { copies: "...", source: "..." } or nested formats
  const v = docRules?.[key]
  if (typeof v === 'string' && v.trim()) return v.trim()
  return null
}

async function loadIssuanceType(issuanceTypeId: string) {
  // 1) issuance_types (title + description)
  const { data: it, error: itErr } = await supabase
    .from('issuance_types')
    .select('id, name, description, active')
    .eq('id', issuanceTypeId)
    .single()

  if (itErr) {
    console.error('Failed to load issuance_types:', itErr)
    issuanceType.value = null
  } else {
    issuanceType.value = it as IssuanceTypeRow
  }

  // 2) issuance_type_requirements + requirements (list)
  const { data: itr, error: itrErr } = await supabase
    .from('issuance_type_requirements')
    .select(
      `
      id,
      issuance_type_id,
      requirement_id,
      is_required,
      sort_order,
      validity_days,
      doc_rules,
      requirements:requirements (
        id,
        name,
        requirement_kind,
        notes
      )
    `
    )
    .eq('issuance_type_id', issuanceTypeId)
    .order('sort_order', { ascending: true })

  if (itrErr) {
    console.error('Failed to load issuance_type_requirements:', itrErr)
    requirements.value = []
    return
  }

const rows = (itr ?? []) as unknown as IssuanceTypeRequirementRow[]

requirements.value = rows
  .map((r) => {
    const req = r.requirements
    if (!req) return null

    const note = req.notes ?? ''
    const copies = pickDocRule(r.doc_rules, 'copies') ?? '—'
    const source = pickDocRule(r.doc_rules, 'source') ?? '—'

    return {
      id: req.id,
      name: req.name,
      note,
      copies,
      source,
      requirementKind: req.requirement_kind,
      isRequired: r.is_required,
      validityDays: r.validity_days
    }
  })
  .filter((x): x is NonNullable<typeof x> => Boolean(x))

}

onMounted(() => {
  if (props.id) loadIssuanceType(props.id)
})

watch(
  () => props.id,
  (newId) => {
    if (newId) loadIssuanceType(newId)
  }
)
</script>
