<template>
  <section class="w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
    <!-- Green Header -->
    <div class="bg-[#42ad43] text-white px-4 py-3 flex items-center justify-between">
      <h3 class="font-extrabold tracking-wide text-sm sm:text-base">
        {{ title }}
      </h3>

      <span class="text-xs font-semibold opacity-95">
        Page {{ page }}
      </span>
    </div>

    <!-- List Area -->
    <div class="p-3 sm:p-4">
      <!-- Loading -->
      <div v-if="loading" class="text-sm text-gray-500">
        Loading...
      </div>

      <!-- Empty -->
      <div v-else-if="rows.length === 0" class="text-sm text-gray-500 py-6 text-center">
        {{ emptyText }}
      </div>

      <!-- Rows -->
      <ul v-else class="space-y-2">
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
            v-if="rowToName"
            :to="{ name: rowToName, params: { [rowParamKey]: r.id } }"
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

          <!-- If no route provided -->
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

      <!-- Footer: Total + Pagination -->
      <div class="mt-4 flex items-center justify-between gap-3">
        <div class="text-xs sm:text-sm text-gray-700">
          <span class="font-semibold">Total:</span>
          <span class="font-bold">{{ total }}</span>
        </div>

        <Pagination
          v-if="totalPages > 1"
          v-model="page"
          :total-items="total"
          :page-size="pageSize"
          :max-buttons="5"
        />
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
}

const props = withDefaults(
  defineProps<{
    title: string
    barangayId: string
    roles: string[] // ex: ['senior'] or ['senior','barangay_staff']
    pageSize?: number
    emptyText?: string

    /**
     * Where each row arrow goes:
     * Example:
     * rowToName="osca-profile-info"
     * rowParamKey="profileId"
     */
    rowToName?: string
    rowParamKey?: string
  }>(),
  {
    pageSize: 10,
    emptyText: 'No records yet',
    rowParamKey: 'profileId'
  }
)

const loading = ref(false)
const rows = ref<Row[]>([])
const total = ref(0)
const page = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / props.pageSize)))

async function fetchRows() {
  if (!props.barangayId) return

  // clamp page
  if (page.value < 1) page.value = 1
  if (page.value > totalPages.value) page.value = totalPages.value

  const from = (page.value - 1) * props.pageSize
  const to = from + props.pageSize - 1

  loading.value = true
  try {
    const { data, count, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name', { count: 'exact' })
      .eq('barangay_id', props.barangayId)
      .in('role', props.roles)
      .order('last_name', { ascending: true })
      .range(from, to)

    if (error) throw error

    total.value = count ?? 0
    rows.value =
      (data ?? []).map((x: any) => ({
        id: x.id,
        full_name: [x.first_name, x.last_name].filter(Boolean).join(' ').trim() || 'Unnamed'
      })) ?? []
  } catch (e) {
    console.error(`[${props.title}] fetch error:`, e)
    total.value = 0
    rows.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchRows)

// refetch when barangay changes or roles change
watch(
  () => [props.barangayId, props.roles.join('|')],
  () => {
    page.value = 1
    fetchRows()
  }
)

// refetch when page changes
watch(page, () => fetchRows())
</script>
