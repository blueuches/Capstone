<template>
  <div class="w-full">
    <!-- Header row (like prototype) -->
    <div class="rounded-lg border border-gray-200 overflow-hidden">
      <!-- Scroll only inside the table -->
<!-- fixed height: ALWAYS fits on typical laptops -->
<div class="h-[260px] sm:h-[320px] overflow-auto">
  <table class="w-full border-collapse text-[12px] table-fixed">

          <thead class="sticky top-0 z-10 bg-white">
            <tr class="border-b border-gray-200">
              <!-- arrows column -->
              <th class="w-12 py-2 px-2 text-left"></th>
              <th class="py-1 px-3 font-semibold text-gray-700">Section</th>
              <th class="py-1 px-3 font-semibold text-gray-700">Order</th>
              <th class="py-1 px-3 font-semibold text-gray-700">Label</th>
              <th class="py-1 px-3 font-semibold text-gray-700">field_key</th>
              <th class="py-1 px-3 font-semibold text-gray-700">required</th>
              <th class="py-1 px-3 font-semibold text-gray-700">Option</th>
              <th class="py-1 px-3 font-semibold text-gray-700">Depends On</th>
            </tr>
          </thead>

          <tbody v-if="!loading && rows.length">
            <tr
              v-for="(r, i) in rows"
              :key="r.id"
              class="border-b border-gray-100 hover:bg-gray-50"
            >
              <!-- arrows -->
              <td class="py-2 px-2 align-top">
                <div class="flex flex-col items-center gap-1">
<button class="w-6 h-6 rounded-md ...">▲</button>
<button class="w-6 h-6 rounded-md ...">▼</button>

                </div>
              </td>

              <!-- read-only cells (workaround = reorder-focused) -->
<td class="py-1 px-2 text-gray-800 truncate">{{ r.section }}</td>
<td class="py-1 px-2 text-gray-800 font-mono truncate">{{ r.sort_order }}</td>
<td class="py-1 px-2 text-gray-800 truncate">{{ r.label }}</td>
<td class="py-1 px-2 text-gray-800 font-mono truncate">{{ r.field_key }}</td>
              <td class="py-2 px-3 text-gray-800">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                  :class="r.required ? 'bg-green-50 text-[#2e6b38] border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'"
                >
                  {{ r.required ? 'true' : 'false' }}
                </span>
              </td>
<td class="py-1 px-2 text-gray-700">
  <span class="font-mono text-[11px] truncate block">
    {{ formatJson(r.options) }}
  </span>
</td>
<td class="py-1 px-2 text-gray-700">
  <span class="font-mono text-[11px] truncate block">
    {{ formatJson(r.depends_on) }}
  </span>
</td>

            </tr>
          </tbody>

          <!-- Loading / Empty states -->
          <tbody v-else>
            <tr v-if="loading">
              <td colspan="8" class="py-10 text-center text-gray-500">
                Loading fields…
              </td>
            </tr>
            <tr v-else>
              <td colspan="8" class="py-10 text-center text-gray-500">
                No fields found for this form.
              </td>
            </tr>

            <tr v-if="error">
              <td colspan="8" class="py-3 text-center text-red-600 text-sm border-t">
                {{ error }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Row = {
  id: string
  section: string
  label: string
  field_key: string
  required: boolean
  sort_order: number
  options: any | null
  depends_on: any | null
}

defineProps<{
  rows: Row[]
  loading?: boolean
  error?: string
}>()

defineEmits<{
  (e: 'move-up', index: number): void
  (e: 'move-down', index: number): void
}>()

function formatJson(val: any) {
  if (val === null || val === undefined) return '—'
  try {
    const s = JSON.stringify(val)
    // keep it compact
    return s.length > 40 ? s.slice(0, 40) + '…' : s
  } catch {
    return String(val)
  }
}
</script>
