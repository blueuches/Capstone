<!-- src/views/Senior/FormPage.vue -->
<template>

    <SmartForm
      v-if="ready"
      :programId="programId!"
      mode="senior"
      :maxPerStep="4"
      @save="saveDraft"
      @submit="submitForm"
      @changed="autoSave"
    />
    <p v-else class="text-gray-500">Loading form…</p>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SmartForm from '@/components/SmartForm.vue'

const route = useRoute()
const router = useRouter()

const programId = computed<number | null>(() => {
  const n = Number(route.params.programId)
  return Number.isFinite(n) ? n : null
})
const ready = computed(() => programId.value != null)

// TODO: fill these in when you wire them to your RequestAnswers flow
function saveDraft({ values }: any) {}
function submitForm({ values }: any) {}
function autoSave({ values }: any) {}
</script>
