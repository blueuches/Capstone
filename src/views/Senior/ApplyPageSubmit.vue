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

      <!-- Small status card (aligned with your style) -->
      <div class="mb-4 rounded-3xl bg-white border border-gray-200 p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-bold text-gray-900">
              {{ issuanceName || 'Issuance' }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Status:
              <span class="font-semibold" :class="statusClass">
                {{ prettyStatus(applicationStatus) }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- ✅ ONLY SCROLLABLE AREA -->
      <div class="flex-1 min-h-0 overflow-y-auto pr-1">
        <ApplyList :items="requirements" @action="onAction" />

        <div v-if="loadError" class="mt-3 text-xs text-red-600 pb-3">
          {{ loadError }}
        </div>

        <div v-else class="mt-4 text-xs text-gray-500 pb-3">
          Tip: Complete all items before final submission.
        </div>
      </div>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import ApplyList from '@/components/Senior/ApplyList.vue'
import Left from '@/assets/icons/senior/left-arrow.svg'

import { supabase } from '@/supabase/client'

const props = defineProps<{ applicationId: string }>()

type ReqKind = 'form' | 'file'

type RequirementItem = {
  id: string // ✅ application_requirement_id (important for next pages)
  title: string
  subtitle?: string
  kind: ReqKind
  hasRecord: boolean
}

const open = ref(false)
const router = useRouter()

const requirements = ref<RequirementItem[]>([])
const issuanceName = ref<string>('')
const applicationStatus = ref<string>('draft')
const loadError = ref<string>('')

function prettyStatus(s?: string) {
  if (!s) return 'Unknown'
  return s
    .toString()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

const statusClass = computed(() => {
  const s = applicationStatus.value
  if (s === 'approved') return 'text-emerald-700'
  if (s === 'rejected') return 'text-red-600'
  if (s === 'submitted' || s === 'in_review') return 'text-amber-700'
  return 'text-emerald-700' // draft/pending-ish
})

function toKind(requirementKind: string | null | undefined): ReqKind {
  // Your enum is USER-DEFINED; common values are 'form' and 'document'/'file'.
  // We only need to decide between form vs file.
  const k = (requirementKind ?? '').toLowerCase()
  return k === 'form' ? 'form' : 'file'
}

async function loadHeader() {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      issuance_type:issuance_type_id (
        name
      )
    `)
    .eq('id', props.applicationId)
    .single()

  if (error) throw error

  issuanceName.value = (data as any)?.issuance_type?.name ?? ''
  applicationStatus.value = (data as any)?.status ?? 'draft'
}

async function loadRequirements() {
  // Pull application_requirements for THIS application
  // Then join: issuance_type_requirements -> requirements
  // Then check completion via form_submissions and document_submissions
  const { data, error } = await supabase
    .from('application_requirements')
    .select(`
      id,
      status,
      remarks,
      issuance_type_requirement:issuance_type_requirement_id (
        id,
        sort_order,
        is_required,
        requirement:requirement_id (
          id,
          name,
          requirement_kind,
          notes
        )
      ),
      form_submissions (
        id,
        status
      ),
      document_submissions (
        id
      )
    `)
    .eq('application_id', props.applicationId)

  if (error) throw error

  const rows = (data ?? []) as any[]

  // Sort by issuance_type_requirements.sort_order (client-side)
  rows.sort((a, b) => {
    const sa = a?.issuance_type_requirement?.sort_order ?? 0
    const sb = b?.issuance_type_requirement?.sort_order ?? 0
    return sa - sb
  })

  requirements.value = rows.map((r) => {
    const req = r?.issuance_type_requirement?.requirement
    const title = req?.name ?? 'Requirement'
    const subtitle = req?.notes ?? undefined
    const kind = toKind(req?.requirement_kind)

    // Completion rules:
    // - form: has form_submissions row
    // - file: has at least 1 document_submissions row
    const hasForm = Array.isArray(r?.form_submissions) && r.form_submissions.length > 0
    const hasDocs = Array.isArray(r?.document_submissions) && r.document_submissions.length > 0

    const hasRecord = kind === 'form' ? hasForm : hasDocs

    return {
      id: r.id, // ✅ application_requirement_id
      title,
      subtitle,
      kind,
      hasRecord
    } satisfies RequirementItem
  })
}

function onAction(item: RequirementItem) {
  // item.id is application_requirement_id (from ApplyPageSubmit list)
  if (item.kind === 'form') {
    router.push({
      name: 'ApplyForm',
      params: { id: item.id }, // ✅ route param :id = application_requirement_id
      query: { applicationId: props.applicationId } // ✅ so back button can return correctly
    })
    return
  }

  // uploads also benefit from having applicationId, optional but recommended
  router.push({
    path: `/senior/apply/upload/${item.id}`,
    query: { applicationId: props.applicationId }
  })
}

onMounted(async () => {
  loadError.value = ''
  requirements.value = []

  try {
    await loadHeader()
    await loadRequirements()
  } catch (e: any) {
    console.error(e)
    loadError.value = e?.message ?? 'Failed to load requirements.'
  }
})
</script>
