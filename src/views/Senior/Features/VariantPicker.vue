<template>
  <div class="relative min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white overflow-hidden">
    <SeniorHeader @toggle-sidebar="toggleSidebar" />
    <h2 class="text-lg font-semibold text-emerald-800 mb-3">Choose OSCA ID Variant</h2>

    <div v-if="loading" class="text-gray-600 text-sm">Loading variants…</div>
    <div v-else-if="!variants.length" class="text-gray-600 text-sm">
      No variants available for this program.
    </div>

    <ul v-else class="space-y-2">
      <li
        v-for="v in variants"
        :key="v.id"
        class="bg-white rounded-xl p-3 ring-1 ring-emerald-100 hover:bg-emerald-50 cursor-pointer shadow-sm"
        @click="selectVariant(v)"
      >
        <p class="font-semibold text-emerald-800">{{ v.name }}</p>
        <p class="text-sm text-gray-700">{{ v.description }}</p>
      </li>
    </ul>

    <SeniorNav/>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/supabase/client'
import SeniorHeader from '@/components/SeniorHeader.vue'
import SeniorNav from '@/components/SeniorNav.vue'

const route = useRoute()
const router = useRouter()
const programId = Number(route.params.programId)
const variants = ref([])
const loading = ref(true)

onMounted(fetchVariants)

const sidebarOpen = ref(false)
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

async function fetchVariants() {
  const { data, error } = await supabase
    .from('ProgramVariants')
    .select('id, name, description')
    .eq('program_id', programId)
    .eq('is_active', true)
    .order('id', { ascending: true })

  if (error) {
    console.error(error)
    return
  }

  variants.value = data || []
  loading.value = false
}

function selectVariant(v) {
  router.push({ name: 'apply-request', params: { programId, variantId: v.id } })
}
</script>
