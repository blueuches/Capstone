<!-- components/Admin/EditFieldsRequirements.vue -->
<template>
  <section class="w-full max-w-xl">
    <div class="space-y-6">
      <!-- Name -->
      <div
        class="bg-white border-[6px] border-[#2e6b38] px-4 py-3"
        style="border-radius: 2px"
      >
        <input
          v-model="localName"
          type="text"
          class="w-full outline-none text-gray-800 font-semibold placeholder-gray-400"
          placeholder="Name"
          :disabled="props.disabled"
        />
      </div>

        <!-- Requirement Kind (label + dropdown beside each other) -->
        <div
        class="bg-white border-[6px] border-[#2e6b38] px-4 py-3"
        style="border-radius: 2px"
        >
        <div class="flex items-center justify-between gap-4">
            <!-- Left: label -->
            <div class="shrink-0 text-sm font-extrabold text-gray-800">
            Requirement Kind
            </div>

            <!-- Right: dropdown -->
            <div class="relative flex-1 min-w-0">
            <select
                ref="kindSelectEl"
                v-model="localKind"
                class="w-full bg-gray-50 border border-gray-300 rounded-lg
                    px-3 py-2 pr-12 text-gray-900 font-semibold outline-none
                    focus:ring-2 focus:ring-[#2e6b38]/40 focus:border-[#2e6b38]
                    disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="props.disabled"
            >
                <option value="document">document</option>
                <option value="form">form</option>
                <option value="info_only">info_only</option>
            </select>

            </div>
        </div>

        </div>



      <!-- Notes (bigger, neat, no tiny scroll area) -->
      <div
        class="bg-white border-[6px] border-[#2e6b38] px-4 py-3"
        style="border-radius: 2px"
      >
        <textarea
          v-model="localNotes"
          class="w-full outline-none text-gray-800 placeholder-gray-400 resize-y
                 min-h-[180px] sm:min-h-[220px]"
          placeholder="Notes"
          :disabled="props.disabled"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type RequirementKind = 'document' | 'form' | 'info_only'

const props = withDefaults(
  defineProps<{
    name: string
    requirementKind: RequirementKind
    notes: string
    disabled?: boolean
  }>(),
  { disabled: false }
)

const emit = defineEmits<{
  (e: 'update:name', v: string): void
  (e: 'update:requirementKind', v: RequirementKind): void
  (e: 'update:notes', v: string): void
}>()

const localName = ref(props.name ?? '')
const localKind = ref<RequirementKind>(props.requirementKind ?? 'document')
const localNotes = ref(props.notes ?? '')

watch(() => props.name, (v) => (localName.value = v ?? ''))
watch(() => props.requirementKind, (v) => (localKind.value = (v ?? 'document') as RequirementKind))
watch(() => props.notes, (v) => (localNotes.value = v ?? ''))

watch(localName, (v) => emit('update:name', v))
watch(localKind, (v) => emit('update:requirementKind', v))
watch(localNotes, (v) => emit('update:notes', v))

const localKindLabel = computed(() => {
  // nicer label if you want
  if (localKind.value === 'info_only') return 'info only'
  return localKind.value
})

const kindSelectEl = ref<HTMLSelectElement | null>(null)

const prettyKind = computed(() => {
  if (localKind.value === 'info_only') return 'info only'
  return localKind.value
})

function openKindDropdown() {
  if (props.disabled) return
  const el = kindSelectEl.value
  if (!el) return
  el.focus()
  // Some browsers open the dropdown on click; focus alone may not.
  el.click()
}
</script>
