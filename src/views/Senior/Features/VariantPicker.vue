<template>
  <div
    class="senior-font-root relative min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white overflow-hidden"
  >
    <!-- Header & Sidebar -->
    <SeniorHeader @toggle-sidebar="toggleSidebar" />
    <SeniorSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main content -->
    <main class="flex-1 pt-20 pb-24 px-4">
      <section class="max-w-xl mx-auto w-full">
        <!-- Page title + hint -->
        <div class="mb-4">
          <p class="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-emerald-700 uppercase bg-emerald-100/70 rounded-full px-3 py-1">
            OSCA ID Setup
          </p>
          <h2 class="mt-3 text-2xl font-extrabold text-emerald-900">
            Choose OSCA ID Variant
          </h2>
          <p class="mt-1 text-sm text-emerald-900/80">
            Tap one of the options below to continue your application.
          </p>
        </div>

        <!-- States -->
        <div class="mt-4">
          <!-- Loading -->
          <div v-if="loading" class="flex items-center gap-3 text-sm text-gray-700 bg-white/70 rounded-2xl px-4 py-3 shadow-sm">
            <span
              class="inline-block h-3 w-3 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"
              aria-hidden="true"
            ></span>
            <span>Loading variants…</span>
          </div>

          <!-- Empty state -->
          <div
            v-else-if="!variants.length"
            class="bg-white/80 rounded-2xl px-5 py-6 text-center shadow-sm border border-dashed border-emerald-100"
          >
            <div
              class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"
            >
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <p class="text-base font-semibold text-emerald-900">
              No variants available
            </p>
            <p class="mt-1 text-sm text-gray-600">
              This program does not have any OSCA ID variants set up yet.
            </p>
          </div>

          <!-- Variants list -->
          <ul v-else class="space-y-3">
            <li
              v-for="v in variants"
              :key="v.id"
              class="group bg-white rounded-2xl px-4 py-3 shadow-sm border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/70 cursor-pointer transition-all duration-150"
              @click="selectVariant(v)"
            >
              <div class="flex items-center gap-3">
                <!-- Icon -->
                <div
                  class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors"
                >
                  <svg
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="16"
                      rx="2"
                      ry="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7 8h6M7 12h3M15 16h2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <!-- Text -->
                <div class="flex-1 min-w-0">
                  <p class="text-base font-semibold text-emerald-900 leading-snug">
                    {{ v.name }}
                  </p>
                  <p class="mt-0.5 text-sm text-gray-700 line-clamp-2">
                    {{ v.description }}
                  </p>
                </div>

                <!-- Chevron -->
                <div class="flex-shrink-0 text-emerald-500 group-hover:text-emerald-700">
                  <svg
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M9 5l7 7-7 7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>

    <!-- Bottom nav -->
    <SeniorNav />
  </div>
</template>


<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/supabase/client'
import SeniorHeader from '@/components/SeniorHeader.vue'
import SeniorNav from '@/components/SeniorNav.vue'
import SeniorSidebar from '@/components/SeniorSidebar.vue'

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
