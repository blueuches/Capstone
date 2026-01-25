<template>
  <div>
    <!-- Empty state -->
    <div
      v-if="!items.length"
      class="mt-10 bg-white border border-gray-200 rounded-3xl p-6 text-center"
    >
      <div
        class="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3"
      >
        <span class="text-2xl">📄</span>
      </div>
      <h2 class="text-lg font-bold text-gray-900">No Requirements To Show</h2>
      <p class="text-sm text-gray-500 mt-1">
        This application has no requirement list loaded yet.
      </p>
    </div>

    <!-- List -->
    <div v-else class="space-y-3">
      <div v-for="item in items" :key="item.id" class="flex items-stretch gap-3">
        <!-- Left check column -->
        <div class="w-10 flex items-center justify-center">
          <div
            class="w-7 h-7 rounded-lg border-2 flex items-center justify-center bg-white"
            :class="item.hasRecord ? 'border-[#42ad43]' : 'border-gray-300'"
            aria-hidden="true"
          >
            <!-- show check ONLY if hasRecord -->
            <svg
              v-if="item.hasRecord"
              class="w-5 h-5 text-[#42ad43]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20 6L9 17l-5-5"
              />
            </svg>
          </div>
        </div>

        <!-- Green card -->
        <div class="flex-1 rounded-3xl bg-[#42ad43] text-white px-5 py-4 shadow-sm">
          <div class="flex items-start justify-between gap-4">
            <!-- LEFT CONTENT (shrinks, wraps) -->
            <div class="min-w-0 flex-1">
              <!-- Title: wrap/clip instead of pushing actions -->
              <p
                class="text-sm font-extrabold leading-snug break-words"
                style="word-break: break-word;"
              >
                {{ item.title }}
              </p>

              <p v-if="item.subtitle" class="text-xs text-white/85 mt-1 break-words">
                {{ item.subtitle }}
              </p>

              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-if="typeof item.recordCount === 'number'"
                  class="text-[11px] px-2 py-1 rounded-xl bg-white/15 font-semibold"
                >
                  Files: {{ item.recordCount }}
                </span>
              </div>
            </div>

            <!-- RIGHT ACTIONS (fixed width, never moves) -->
            <div class="w-[86px] shrink-0 flex flex-col items-end gap-1 pt-0.5">
              <button
                class="text-xs font-bold text-white/95 hover:text-white underline underline-offset-2"
                @click="emit('view', item)"
              >
                View
              </button>

              <button
                class="text-xs font-bold text-white/95 hover:text-white underline underline-offset-2"
                @click="emit('edit', item)"
              >
                Edit
              </button>

              <button
                class="text-xs font-bold underline underline-offset-2"
                :class="item.hasRecord ? 'text-white/95 hover:text-white' : 'text-white/50 cursor-not-allowed'"
                :disabled="!item.hasRecord"
                @click="item.hasRecord && emit('delete', item)"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- Optional: subtle divider line like your prototype spacing -->
          <div class="mt-3 h-px bg-white/15"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type RequirementItem = {
  id: string
  title: string
  subtitle?: string
  hasRecord: boolean
  recordCount?: number
  updatedAt?: string
}

defineProps<{
  items: RequirementItem[]
}>()

const emit = defineEmits<{
  (e: 'view', item: RequirementItem): void
  (e: 'edit', item: RequirementItem): void
  (e: 'delete', item: RequirementItem): void
}>()
</script>
