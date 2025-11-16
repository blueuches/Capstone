<template>
  <div class="senior-font-root bg-gradient-to-b from-emerald-50 via-white to-emerald-50/30 min-h-screen flex flex-col">
    <!-- Header -->
    <SeniorHeader @toggle-sidebar="toggleSidebar" />

  <SeniorSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-4 pb-[88px]">
      <!-- Breadcrumb -->
      <nav class="text-sm text-emerald-700 mb-4" aria-label="Breadcrumb">
        <ol class="list-reset flex items-center space-x-2">
          <li>
            <a href="/senior/dashboard" class="hover:underline font-medium">Dashboard</a>
          </li>
          <li class="text-emerald-500">›</li>
          <li class="font-semibold text-emerald-700">My Requirements</li>
        </ol>
      </nav>

      <!-- Page Title -->
      <div class="mb-3">
        <h2 class="text-base font-semibold text-emerald-800">
          Application Requirements
        </h2>
        <p class="text-xs text-gray-500 mt-1">
          Review the documents you have submitted for an OSCA program.
        </p>
      </div>

      <!-- Programs List -->
      <div class="space-y-4">
        <div
          v-for="program in programs"
          :key="program.id"
          class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow ring-1 ring-emerald-100 p-4"
        >
          <!-- Program Header -->
          <div
            class="flex items-start gap-3 cursor-pointer select-none"
            @click="toggleProgram(program.id)"
          >
            <!-- Program Icon -->
            <div
              class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-sm font-semibold"
            >
              {{ (program.name || 'P').charAt(0).toUpperCase() }}
            </div>

            <!-- Name + Info -->
            <div class="flex-1">
              <p class="text-[11px] uppercase tracking-wide text-emerald-500">
                Program
              </p>
              <h2 class="text-[15px] font-semibold text-emerald-800 leading-snug">
                {{ program.name }}
              </h2>
              <p class="text-[11px] text-gray-500 mt-1">
                {{ program.documents?.length || 0 }} document(s) linked to this application.
              </p>
            </div>

            <!-- Status + Arrow -->
            <div class="flex flex-col items-end gap-1">
              <span
                class="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                :class="{
                  'bg-emerald-50 text-emerald-700 border border-emerald-200': program.status === 'Approved',
                  'bg-yellow-50 text-yellow-700 border border-yellow-200': program.status === 'Under Review' || program.status === 'Submitted',
                  'bg-red-50 text-red-700 border border-red-200': program.status === 'Rejected',
                  'bg-gray-50 text-gray-600 border border-gray-200': program.status === 'Draft'
                }"
              >
                {{ program.status }}
              </span>
              <svg
                :class="{ 'rotate-180': expanded === program.id }"
                class="w-5 h-5 text-emerald-700 transition-transform mt-1"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>

          <!-- Expanded Section -->
          <transition name="fade">
            <div v-if="expanded === program.id" class="mt-4 pt-3 border-t border-emerald-100">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-medium text-emerald-700">
                  Uploaded Documents
                </h3>
                <p class="text-[11px] text-gray-500">
                  Tap “View” to open a file; “Print” for a printable version.
                </p>
              </div>

              <!-- Empty State -->
              <div
                v-if="!program.documents || !program.documents.length"
                class="text-center text-xs text-gray-500 bg-emerald-50/60 border border-dashed border-emerald-200 rounded-lg py-3 px-3"
              >
                No documents found for this application yet.
              </div>

              <!-- Documents List -->
              <ul v-else class="space-y-3">
                <li
                  v-for="(doc, j) in program.documents"
                  :key="j"
                  class="flex items-center justify-between gap-3 bg-emerald-50/40 px-3 py-2.5 rounded-lg border border-emerald-100"
                >
                  <!-- Left: icon + info -->
                  <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded-md bg-emerald-100 flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        class="w-4 h-4 text-emerald-700"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="10" y1="13" x2="18" y2="13" />
                        <line x1="10" y1="17" x2="16" y2="17" />
                        <line x1="8" y1="13" x2="8.01" y2="13" />
                        <line x1="8" y1="17" x2="8.01" y2="17" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-[14px] text-gray-900 font-medium leading-tight">
                        {{ doc.name }}
                      </p>
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] mt-0.5"
                        :class="{
                          'bg-green-50 text-green-700 border border-green-200': doc.status === 'completed',
                          'bg-yellow-50 text-yellow-700 border border-yellow-200': doc.status === 'draft'
                        }"
                      >
                        {{ doc.status === 'completed' ? 'Completed' : 'Draft' }}
                      </span>
                    </div>
                  </div>

                  <!-- Right: Actions -->
                  <div class="flex flex-col gap-1 items-end">
                    <button
                      v-if="doc.url"
                      class="text-[11px] px-3 py-1 bg-emerald-500 text-white rounded-md shadow-sm hover:bg-emerald-600"
                      @click.stop="viewDocument(doc.url)"
                    >
                      View
                    </button>
                    <button
                      v-if="doc.status === 'completed'"
                      class="text-[11px] px-3 py-1 bg-emerald-600 text-white rounded-md shadow-sm hover:bg-emerald-700"
                      @click.stop="printDocument(doc.url)"
                    >
                      Print
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </main>

    <!-- Bottom Tabbar -->
    <SeniorNav />
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase/client";
import SeniorNav from '@/components/SeniorNav.vue'
import SeniorSidebar from '@/components/SeniorSidebar.vue'
import SeniorHeader from '@/components/SeniorHeader.vue'


/* UI state */
const expanded = ref(null);

const sidebarOpen = ref(false)
function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }

/* Avatar */
const avatarUrl = ref("https://via.placeholder.com/60");
function useInlineAvatar() {
  avatarUrl.value =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'>
      <rect width='100%' height='100%' fill='#ecfdf5'/>
      <circle cx='30' cy='22' r='12' fill='#10b981' fill-opacity='0.5'/>
      <rect x='14' y='38' width='32' height='14' rx='7' fill='#10b981' fill-opacity='0.35'/>
    </svg>`);
}

/* Data */
const programs = ref([]);

/* UI helpers */
function toggleProgram(id) {
  expanded.value = expanded.value === id ? null : id;
}
function viewDocument(url) {
  if (!url) return;
  window.open(url, "_blank");
}
function printDocument(url) {
  if (!url) return;
  const w = window.open(url, "_blank");
  w?.print?.();
}

/* Mappers */
function mapStatus(status) {
  switch ((status || "").toLowerCase()) {
    case "approved": return "Approved";
    case "reviewed": return "Under Review";
    case "rejected": return "Rejected";
    case "submitted": return "Submitted";
    default: return "Draft";
  }
}
function prettifyDocName(s) {
  if (!s) return "Uploaded Document";
  return String(s).replace(/[_-]+/g, " ").replace(/\b\w/g, m => m.toUpperCase());
}

/* Storage URL helper */
async function resolveFileUrl(filePath) {
  if (!filePath) return "";
  if (/^https?:\/\//i.test(filePath)) return filePath;

  try {
    if (filePath.startsWith("requirements/")) {
      return supabase.storage.from("requirements").getPublicUrl(filePath).data.publicUrl;
    }
    if (filePath.startsWith("requests/")) {
      const { data } = await supabase.storage.from("requests").createSignedUrl(filePath, 600);
      return data?.signedUrl || "";
    }
    if (filePath.startsWith("documents/")) {
      const { data } = await supabase.storage.from("documents").createSignedUrl(filePath, 600);
      return data?.signedUrl || "";
    }
  } catch (_) {}

  try {
    const { data } = await supabase.storage.from("requirements").createSignedUrl(filePath, 600);
    if (data?.signedUrl) return data.signedUrl;
  } catch (_) {}
  try {
    const { data } = await supabase.storage.from("documents").createSignedUrl(filePath, 600);
    if (data?.signedUrl) return data.signedUrl;
  } catch (_) {}
  try {
    const { data } = await supabase.storage.from("requests").createSignedUrl(filePath, 600);
    if (data?.signedUrl) return data.signedUrl;
  } catch (_) {}

  return "";
}

/* Data load */
onMounted(async () => {
  try {
    // 1) who am I
    const { data: authRes, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authRes?.user) { programs.value = []; return; }
    const uid = authRes.user.id;

    // 2) get my senior_id
    const { data: seniorRow, error: seniorErr } = await supabase
      .from("senior_citizens")              // ✅ use the view
      .select("id")
      .eq("user_id", uid)
      .maybeSingle();
    if (seniorErr || !seniorRow?.id) { programs.value = []; return; }
    const seniorId = seniorRow.id;

    // 3) my requests (via view; no server-side order yet)
    const { data: reqs, error: reqErr } = await supabase
      .from("requests")                     // ✅ use the view (not "Requests")
      .select("id, status, program_id, created_at")
      .eq("senior_id", seniorId);
    if (reqErr || !reqs?.length) { programs.value = []; return; }

    // client-side order desc by created_at
    reqs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // 4) programs lookup via view
    const programIds = Array.from(new Set(reqs.map(r => r.program_id))).filter(Boolean);
    let progMap = new Map();
    if (programIds.length) {
      const { data: progs, error: progErr } = await supabase
        .from("programs")                   // ✅ use the view (not "Programs")
        .select("id, name")
        .in("id", programIds);
      if (!progErr && progs) progMap = new Map(progs.map(p => [p.id, p.name]));
    }

// 5) Documents for each request — per-request fetch to avoid .in/.or issues
const reqIds = reqs.map(r => r.id).filter(Boolean);

let allDocs = [];
for (const rid of reqIds) {
  const { data, error: docErr } = await supabase
    .from('request_documents') // lowercase view
    .select('request_id, kind, file_path') // ⚠️ no 'label' — view doesn’t have it
    .eq('request_id', rid);

  if (docErr) {
    console.warn('Docs load error for request', rid, docErr);
    continue;
  }
  if (data?.length) allDocs = allDocs.concat(data);
}

// group docs by request
const docsByReq = new Map();
(allDocs || []).forEach(d => {
  const arr = docsByReq.get(d.request_id) || [];
  arr.push(d);
  docsByReq.set(d.request_id, arr);
});

// 6) Build UI list (use kind for the display name)
const ui = [];
for (const r of reqs) {
  const rawDocs = docsByReq.get(r.id) || [];
  const documents = [];
  for (const d of rawDocs) {
    const url = await resolveFileUrl(d.file_path);
    documents.push({
      name: prettifyDocName(d.kind || 'Uploaded Document'), // ✅ no label
      status: url ? 'completed' : 'draft',
      url
    });
  }
  ui.push({
    id: r.id,
    name: progMap.get(r.program_id) || 'Program',
    status: mapStatus(r.status),
    documents
  });
}
programs.value = ui;

  } catch (e) {
    console.error("Requirements load failed:", e);
    programs.value = [];
  }
});

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Prevent horizontal overflow */
* {
  max-width: 100vw;
  box-sizing: border-box;
}

main {
  -webkit-overflow-scrolling: touch;
}
</style>
