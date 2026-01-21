<!-- components/Admin/EditFields.vue -->
<template>
  <section class="w-full max-w-xl">
    <!-- Field stack (left) -->
    <div class="space-y-5">
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
          :disabled="disabled"
        />
      </div>

      <!-- Description -->
      <div
        class="bg-white border-[6px] border-[#2e6b38] px-4 py-3"
        style="border-radius: 2px"
      >
        <textarea
          v-model="localDescription"
          rows="3"
          class="w-full outline-none text-gray-800 placeholder-gray-400 resize-none"
          placeholder="Description"
          :disabled="disabled"
        />
      </div>

      <!-- Edit requirements row -->
      <RouterLink
        :to="requirementsTo"
        class="group bg-white border-[6px] border-[#2e6b38]
               px-4 py-3 flex items-center justify-between
               hover:shadow-sm transition"
        style="border-radius: 2px"
      >
        <span class="text-gray-900 font-semibold">Edit requirements</span>

        <span
          class="shrink-0 w-8 h-8 rounded-full bg-[#2e6b38] text-white
                 flex items-center justify-center
                 transition group-hover:brightness-105"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 8l4 4-4 4" />
          </svg>
        </span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    description: string
    issuanceTypeId: string
    disabled?: boolean
  }>(),
  { disabled: false }
)

const emit = defineEmits<{
  (e: 'update:name', v: string): void
  (e: 'update:description', v: string): void
}>()

const localName = ref(props.name)
const localDescription = ref(props.description)

watch(
  () => props.name,
  (v) => (localName.value = v ?? '')
)
watch(
  () => props.description,
  (v) => (localDescription.value = v ?? '')
)

watch(localName, (v) => emit('update:name', v))
watch(localDescription, (v) => emit('update:description', v))

// Route to requirements edit (pass issuance type id)
const requirementsTo = computed(() => ({
  name: 'EditIssuanceRequirements',
  params: { id: props.issuanceTypeId }
}))

</script>
