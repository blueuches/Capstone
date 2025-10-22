<template>
  <div class="h-screen flex bg-emerald-50 overflow-hidden transition-all duration-300">
    <!-- 🟩 Sidebar -->
    <Sidebar role="osca" @toggle="sidebarCollapsed = $event" />

    <!-- 🧭 Main Workspace -->
    <main class="flex-1 flex flex-col overflow-hidden p-4 lg:p-6 transition-all duration-300">
      <!-- Header -->
      <header class="shrink-0 mb-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-emerald-800">OSCA Review</h1>
        <div
          v-if="isPreview"
          class="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold"
        >
          Preview Mode — no request selected
        </div>
      </header>

      <!-- Workspace Grid -->
      <section
        :class="[
          'grid flex-1 min-h-0 gap-6 overflow-hidden transition-all duration-300',
          sidebarCollapsed ? 'lg:grid-cols-[1.6fr_1fr]' : 'lg:grid-cols-[2fr_1fr]'
        ]"
      >
        <!-- LEFT: SmartForm -->
        <div class="bg-white rounded-2xl border shadow p-4 overflow-hidden flex flex-col">
          <div class="flex-1 min-h-0 overflow-y-auto smart-embed">
            <SmartForm
              :programId="programId"
              mode="osca"
              :maxPerStep="4"
              @save="saveOscaDraft"
              @submit="completeOscaSection"
            />
          </div>
        </div>

        <!-- RIGHT: Panels -->
        <aside class="flex flex-col space-y-4 overflow-hidden">
          <div class="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4">
            <DocumentsPanel
              :requestId="requestId"
              :mock="isPreview"
              @request-info="askForMoreDocs"
            />
            <SeniorAnswersPanel
              :requestId="requestId"
              :mock="isPreview"
            />
            <StatusActions
              :requestId="requestId"
              :mock="isPreview"
              @set-status="setStatus"
            />
            <Timeline :requestId="requestId" :mock="isPreview" />
          </div>
        </aside>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Sidebar from '@/components/Sidebar.vue'
import SmartForm from '@/components/SmartForm.vue'
import DocumentsPanel from '@/components/osca/DocumentsPanel.vue'
import SeniorAnswersPanel from '@/components/osca/SeniorAnswersPanel.vue'
import StatusActions from '@/components/osca/StatusActions.vue'
import Timeline from '@/components/osca/Timeline.vue'

const route = useRoute()
const router = useRouter()

const programId = route.params.programId as string
const requestId = route.params.requestId as string | undefined
const isPreview = computed(() => requestId === undefined)
const sidebarCollapsed = ref(false)
const modal = ref<{ open: boolean }>({ open: false })

function saveOscaDraft(_: any) {}
function completeOscaSection(_: any) {}
function askForMoreDocs(_: string) {}
function setStatus(_: 'verified' | 'approved' | 'rejected') {}

const FALLBACK_PROGRAM_ID = 4

function goToReview(app: any) {
  if (!app) return
  const programId = String(app.programId || FALLBACK_PROGRAM_ID)
  const requestId = app.id

  router.push({ name: 'OscaReview', params: { programId, requestId } })

  modal.value.open = false
}
</script>


<style scoped>
html,
body {
  overflow: hidden;
}

/* Prevent global scroll */
main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* Grid must stay within the viewport */
section {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* The form container should be the only scrollable one */
.smart-embed {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
}

/* The panels scroll individually */
aside > div {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
}

/* 🧩 Fix SmartForm internal structure */
:deep(.smart-embed > .relative.flex.items-center.justify-center.w-screen.h-screen) {
  width: 100% !important;
  height: auto !important;
  align-items: stretch !important;
  justify-content: stretch !important;
  background: transparent !important;
}

/* Remove SmartForm’s own scroll layer */
:deep(.smart-embed main),
:deep(.smart-embed section),
:deep(.smart-embed form) {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
  overflow: visible !important;
}

/* Hide fixed progress or sticky toolbars */
:deep(.smart-embed .absolute.top-4.left-0.right-0),
:deep(.smart-embed .fixed.bottom-2.left-1\/2) {
  display: none !important;
}

/* Cap the form’s scrollable region properly */
:deep(.smart-embed section.flex-1) {
  max-height: none !important;
  height: auto !important;
  overflow: visible !important;
}
</style>

