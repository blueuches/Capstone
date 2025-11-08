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
          sidebarCollapsed ? 'lg:grid-cols-[1.6fr_1fr]' : 'lg:grid-cols-[2fr_1fr]',
        ]"
      >
        <!-- LEFT: SmartForm -->
        <div class="bg-white rounded-2xl border shadow p-4 overflow-hidden flex flex-col">
          <div class="flex-1 min-h-0 overflow-y-auto smart-embed">
            <SmartForm
              :programId="Number(programId)"
              mode="osca"
              :maxPerStep="4"
              @save="saveOscaDraft"
              @form-submit="completeOscaSection"
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
            <SeniorAnswersPanel :requestId="requestId" :mock="isPreview" />
          </div>
        </aside>
      </section>

      <Remarks
        v-model="remarksOpen"
        :requestId="requestId ? Number(requestId) : undefined"
        @sent="onRemarksSent"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Remarks from '@/components/Remarks.vue'
import { supabase } from '@/supabase/client'

import Sidebar from '@/components/Sidebar.vue'
import SmartForm from '@/components/SmartForm.vue'
import DocumentsPanel from '@/components/DocumentsPanel.vue'
import SeniorAnswersPanel from '@/components/SeniorAnswersPanel.vue'
import StatusActions from '@/components/StatusActions.vue'

type AnswersPayload = Record<string, any>

const route = useRoute()
const router = useRouter()

const programId = Number(route.params.programId)
const requestId = route.params.requestId as string | undefined
const isPreview = computed(() => requestId === undefined)
const sidebarCollapsed = ref(false)
const modal = ref<{ open: boolean }>({ open: false })

const remarksOpen = ref(false)
const FALLBACK_PROGRAM_ID = 4

// UI state
const draftSaving = ref(false)
const submitting = ref(false)
const errorMsg = ref<string | null>(null)

function goToReview(app: any) {
  if (!app) return
  const programId = String(app.programId || FALLBACK_PROGRAM_ID)
  const requestId = app.id
  router.push({ name: 'OscaReview', params: { programId, requestId } })
  modal.value.open = false
}

function askForMoreDocs(_: string) {
  remarksOpen.value = true
}

function onRemarksSent(_payload: { announcementId: number; targetUserId: string }) {
  // optional: toast, refresh notifications count, etc.
  // console.log('Sent', _payload)
}

async function saveOscaDraft(payload: any) {
  if (!requestId) return;
  const rid = Number(requestId);

  // payload → flatten to { "Field label": "value", ... }
  const answers = normalizeSmartFormPayload(payload);

  // Draft-saving RPC can be same as submit but should NOT change status.
  // If you don’t have a dedicated RPC, you can upsert into RequestAnswers filled_by='osca'.
  const { error } = await supabase.rpc('osca_submit_request_answers', {
    p_request_id: rid,
    p_answers: answers,
    p_mode: 'draft'        // if your RPC supports a mode flag; otherwise remove this
  });

  if (error) {
    console.error('[saveOscaDraft] RPC error', error);
    // TODO: show toast
    return;
  }
  // optional toast: "Draft saved"
}

async function completeOscaSection(payload: { formId: number | null; values: Record<number, any>; mode: 'osca' | 'senior' }) {
  if (!requestId) {
    console.warn('[completeOscaSection] No requestId (Preview Mode).');
    return;
  }
  if (!payload?.formId) {
    console.warn('[completeOscaSection] Missing formId from SmartForm payload.');
    return;
  }

  const rid = Number(requestId);
  const formId = Number(payload.formId);
  const idValueMap = payload.values || {};

  // 1) Load OSCA fields for this form to map id → label
  const { data: fields, error: fieldErr } = await supabase
    .from('FormFields')
    .select('id,label,section')
    .eq('form_id', formId);

  if (fieldErr || !fields) {
    console.error('[completeOscaSection] Failed to load FormFields', fieldErr);
    return;
  }

  // Keep only OSCA-section fields (your SmartForm filtered visually; we enforce here)
  const oscaFields = fields.filter(f => (String(f.section || '').toLowerCase().includes('osca')));
  const fieldById = new Map<number, { id:number; label:string }>(oscaFields.map(f => [Number(f.id), { id:Number(f.id), label: String(f.label) }]));

  // 2) Build answers keyed by label for the RPC
  const answersByLabel: Record<string, string> = {};
  for (const [idStr, val] of Object.entries(idValueMap)) {
    const f = fieldById.get(Number(idStr));
    if (!f) continue;                       // ignore non-OSCA fields
    answersByLabel[f.label] = String(val ?? '');
  }

  // If nothing to submit, stop gracefully
  if (Object.keys(answersByLabel).length === 0) {
    console.warn('[completeOscaSection] No OSCA answers to submit for this form.');
    return;
  }

  // 3) Save OSCA answers
  const { error: aErr } = await supabase.rpc('osca_submit_request_answers', {
    p_request_id: rid,
    p_answers: answersByLabel
  });
  if (aErr) {
    console.error('[completeOscaSection] answers RPC failed', aErr);
    return;
  }

  // 4) Move status to 'reviewed'
  const { error: sErr } = await supabase.rpc('set_request_status', {
    p_request_id: rid,
    p_new_status: 'reviewed',
    p_note: 'OSCA section reviewed'
  });
  if (sErr) {
    console.error('[completeOscaSection] status RPC failed', sErr);
    return;
  }

  console.log('[completeOscaSection] OSCA answers saved and status set to reviewed.');
}

// helper: turn SmartForm emit payload into simple { label: value }
function normalizeSmartFormPayload(payload: any): Record<string, string> {
  // Adjust to your SmartForm emit shape.
  // Common shapes:
  //  - array of { label, value }
  //  - object keyed by field label
  if (Array.isArray(payload)) {
    return payload.reduce((acc: Record<string,string>, f: any) => {
      const label = (f.label ?? f.name ?? '').toString();
      const val = f.value ?? '';
      if (label) acc[label] = String(val);
      return acc;
    }, {});
  }
  if (payload && typeof payload === 'object') {
    // already map-like
    return Object.fromEntries(
      Object.entries(payload).map(([k, v]) => [k, v == null ? '' : String(v)])
    );
  }
  return {};
}


/**
 * 🔁 Manual status changes (approve/reject/etc.)
 * Use if you keep status updates outside the RPC, or for post-review steps.
 */
async function setStatus(next: 'verified' | 'approved' | 'rejected') {
  errorMsg.value = null
  if (!requestId) return

  const { error } = await supabase.rpc('set_request_status', {
    p_request_id: Number(requestId),
    p_new_status: next,
    p_note: `Set by OSCA: ${next}`
  })
  if (error) {
    console.error(error)
    errorMsg.value = error.message ?? 'Failed to update status.'
  } else {
    console.log(`Status set to ${next}`)
  }
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
