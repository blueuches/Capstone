<template>
  <section class="bg-white rounded-2xl shadow-sm border-4 border-[#42ad43] overflow-hidden">
    <!-- Green header bar -->
    <div class="bg-[#42ad43] text-white px-4 py-3">
      <p class="text-center font-extrabold text-sm sm:text-base tracking-wide">
        {{ title }}
      </p>
    </div>

    <!-- Rows -->
    <div class="divide-y divide-gray-100">
      <div
        v-for="row in rows"
        :key="row.id"
        class="flex items-center justify-between gap-3 px-4 py-3"
      >
        <!-- Left: primary text -->
        <p class="font-semibold text-gray-900 truncate">
          {{ row.primary }}
        </p>

        <!-- Middle: status -->
        <p class="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
          {{ row.status }}
        </p>

        <!-- Right: action -->
        <button
          type="button"
          class="shrink-0 bg-[#42ad43] text-white font-bold text-[10px] sm:text-xs
                 px-3 py-2 rounded-md hover:brightness-105 active:scale-[0.99] transition"
          @click="$emit('action', row)"
        >
          {{ actionLabel }}
        </button>
      </div>
    </div>

    <!-- Optional empty state -->
    <div v-if="!rows?.length" class="px-4 py-6 text-center text-sm text-gray-500">
      {{ emptyText }}
    </div>
  </section>
</template>

<script setup lang="ts">
type TableRow = {
  id: string
  primary: string
  status: string
  // add any extra fields you want later (e.g., applicant_id, barangay_id, etc.)
  [key: string]: any
}

defineProps<{
  title: string
  rows: TableRow[]
  actionLabel?: string
  emptyText?: string
}>()

defineEmits<{
  (e: 'action', row: TableRow): void
}>()
</script>
