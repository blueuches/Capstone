<template>
  <section
    class="w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white
           flex flex-col min-h-0"
    :class="cardHeightClass"
  >
    <!-- Green Header -->
    <div class="bg-[#42ad43] text-white px-4 py-3 flex items-center justify-between shrink-0">
      <h3 class="font-extrabold tracking-wide text-sm sm:text-base">
        {{ title }}
      </h3>

      <span class="text-xs font-semibold opacity-95">
        Page {{ page }}
      </span>
    </div>

    <!-- Body: make it a column so footer stays visible -->
    <div class="p-3 sm:p-4 flex flex-col min-h-0 flex-1">
      <!-- Loading -->
      <div v-if="loading" class="text-sm text-gray-500">
        Loading...
      </div>

      <!-- Empty -->
      <div
        v-else-if="rows.length === 0"
        class="text-sm text-gray-500 py-6 text-center flex-1 flex items-center justify-center"
      >
        {{ emptyText }}
      </div>

      <!-- Rows (scroll area) -->
      <div v-else class="flex-1 min-h-0 overflow-y-auto pr-1">
        <ul class="space-y-2">
          <li
            v-for="r in rows"
            :key="r.id"
            class="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
          >
            <div class="min-w-0">
              <div class="font-semibold text-gray-900 truncate">
                {{ r.full_name }}
              </div>
            </div>

            <!-- Row Arrow -->
            <RouterLink
              v-if="r.to"
              :to="r.to"
              class="shrink-0 w-7 h-7 rounded-full bg-[#42ad43] text-white
                     flex items-center justify-center
                     hover:brightness-105 active:brightness-95 transition"
              aria-label="View"
            >
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </RouterLink>

            <!-- Disabled if no route -->
            <button
              v-else
              type="button"
              class="shrink-0 w-7 h-7 rounded-full bg-[#42ad43]/50 text-white
                     flex items-center justify-center cursor-not-allowed"
              title="No route configured"
            >
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </li>
        </ul>
      </div>

      <!-- Footer: Total + Pagination (always pinned) -->
      <div class="mt-4 flex items-center justify-between gap-3 shrink-0">
        <Pagination
          v-model="page"
          :total-items="total"
          :page-size="pageSize"
          :max-buttons="5"
        />
        <div class="text-xs sm:text-sm text-gray-700">
          <span class="font-semibold">Total:</span>
          <span class="font-bold">{{ total }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { supabase } from '@/supabase/client'
import Pagination from '@/components/Staff/Pagination.vue'

type Row = {
  id: string
  full_name: string
  to?: any // vue-router Location
}

const props = withDefaults(
  defineProps<{
    title: string
    barangayId: string
    mode: 'seniors_applying' | 'all_users' | 'staff'
    pageSize?: number
    emptyText?: string

    /**
     * Controls card height so the list becomes scrollable and footer stays visible.
     * You can override per card if needed.
     */
    cardHeightClass?: string
  }>(),
  {
    pageSize: 10,
    emptyText: 'No records yet',
    // tuned for your page layout: Header + back link + paddings
    cardHeightClass: 'h-[calc(100vh-220px)]'
  }
)

const loading = ref(false)
const rows = ref<Row[]>([])
const total = ref(0)
const page = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / props.pageSize)))

function makeFullName(first?: string, last?: string) {
  return [first, last].filter(Boolean).join(' ').trim() || 'Unnamed'
}

/**
 * Seniors Applying:
 * - driven by applications under this barangay
 * - if same senior has multiple applications under the SAME issuance, label as:
 *   Juan Dela Cruz - 1, Juan Dela Cruz - 2
 *
 * Note: We count in the order returned (created_at desc) on the current page.
 * If you want numbering across ALL pages globally, that requires a server-side rank/window function.
 */
async function fetchSeniorsApplying(from: number, to: number) {
  const { data, count, error } = await supabase
    .from('applications')
    .select(
      `
      id,
      senior_id,
      issuance_type_id,
      created_at,
      profiles:profiles!applications_senior_id_fkey (
        last_name
      ),
      issuance_type:issuance_types!applications_issuance_type_id_fkey (
        name
      )
    `,
      { count: 'exact' }
    )
    .eq('barangay_id', props.barangayId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error
  total.value = count ?? 0

  const pageApps = (data ?? []) as any[]

  // --- compute numbering globally (not just within the page) per (senior_id + issuance_type_id)
  // For the keys present on the current page, fetch ALL apps for those keys.
  const keys = Array.from(
    new Set(pageApps.map(a => `${a.senior_id}:${a.issuance_type_id}`))
  )

  let allForKeys: any[] = []
  if (keys.length) {
    const ors = keys
      .map(k => {
        const [sid, itid] = k.split(':')
        return `and(senior_id.eq.${sid},issuance_type_id.eq.${itid})`
      })
      .join(',')

    const { data: allData, error: allErr } = await supabase
      .from('applications')
      .select('id, senior_id, issuance_type_id, created_at')
      .eq('barangay_id', props.barangayId)
      .or(ors)
      .order('created_at', { ascending: false })

    if (allErr) throw allErr
    allForKeys = allData ?? []
  }

  // Build index map: application_id -> position number within its (senior+issuance) group
  const grouped = new Map<string, any[]>()
  for (const a of allForKeys) {
    const k = `${a.senior_id}:${a.issuance_type_id}`
    if (!grouped.has(k)) grouped.set(k, [])
    grouped.get(k)!.push(a)
  }

  const appIndex = new Map<string, number>()
  const groupSize = new Map<string, number>()
  for (const [k, arr] of grouped.entries()) {
    groupSize.set(k, arr.length)
    arr.forEach((a, idx) => appIndex.set(a.id, idx + 1)) // 1-based
  }

  rows.value = pageApps.map((a: any) => {
    const surname = (a?.profiles?.last_name || 'Unnamed').trim()
    const issuanceName = (a?.issuance_type?.name || 'Issuance').trim()

    const k = `${a.senior_id}:${a.issuance_type_id}`
    const n = appIndex.get(a.id) ?? 1
    const size = groupSize.get(k) ?? 1

    // If multiple apps under the same issuance for the same senior → append " 1", " 2", ...
    const suffix = size > 1 ? ` ${n}` : ''

    return {
      id: a.id,
      full_name: `${surname} - ${issuanceName}${suffix}`,
      to: { name: 'ApplicantReview', params: { applicationId: a.id } }
    }
  })
}

async function fetchAllUsers(from: number, to: number) {
  // seniors + barangay_staff under this barangay (with/without applications)
  const { data, count, error } = await supabase
    .from('profiles')
    .select(
      `
      id,
      role,
      first_name,
      last_name,
      applications:applications!applications_senior_id_fkey (
        id,
        created_at,
        barangay_id
      )
    `,
      { count: 'exact' }
    )
    .eq('barangay_id', props.barangayId)
    .in('role', ['senior', 'barangay_staff'])
    .order('last_name', { ascending: true })
    .range(from, to)

  if (error) throw error

  total.value = count ?? 0
  rows.value = (data ?? []).map((p: any) => {
    const apps = Array.isArray(p.applications) ? p.applications : []
    const latest = apps
      .filter((x: any) => x?.barangay_id === props.barangayId)
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]

    return {
      id: p.id,
      full_name: makeFullName(p.first_name, p.last_name),
      to: latest ? { name: 'ApplicantReview', params: { applicationId: latest.id } } : undefined
    }
  })
}

async function fetchStaff(from: number, to: number) {
  const { data, count, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name', { count: 'exact' })
    .eq('barangay_id', props.barangayId)
    .eq('role', 'barangay_staff')
    .order('last_name', { ascending: true })
    .range(from, to)

  if (error) throw error

  total.value = count ?? 0
  rows.value = (data ?? []).map((p: any) => ({
    id: p.id,
    full_name: makeFullName(p.first_name, p.last_name),
    to: undefined
  }))
}

async function fetchRows() {
  if (!props.barangayId) return

  // clamp page
  if (page.value < 1) page.value = 1
  if (page.value > totalPages.value) page.value = totalPages.value

  const from = (page.value - 1) * props.pageSize
  const to = from + props.pageSize - 1

  loading.value = true
  try {
    if (props.mode === 'seniors_applying') await fetchSeniorsApplying(from, to)
    if (props.mode === 'all_users') await fetchAllUsers(from, to)
    if (props.mode === 'staff') await fetchStaff(from, to)
  } catch (e) {
    console.error(`[${props.title}] fetch error:`, e)
    total.value = 0
    rows.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchRows)

watch(
  () => [props.barangayId, props.mode],
  () => {
    page.value = 1
    fetchRows()
  }
)

watch(page, () => fetchRows())
</script>
