<!-- views/Senior/FormPage.vue -->
<template>
  <SmartForm
    :programId="programId"
    mode="senior"
    :maxPerStep="4"
    @save="saveDraft"
    @submit="submitForm"
    @changed="autoSave"
  />
  <!-- mic button here -->
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import SmartForm from '@/components/SmartForm.vue'
const route = useRoute()
const programId = route.params.programId as string

function saveDraft({ values }: any) { /* upsert RequestAnswers filled_by=senior */ }
function submitForm({ values }: any) { /* flip Requests.status='submitted' */ }
function autoSave({ values }: any) { /* optional debounce */ }
</script>
