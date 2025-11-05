<template>
  <div class="bg-gradient-to-b from-emerald-50 via-white to-emerald-50/30 min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-emerald-600 text-white shadow-md">
      <div class="px-4 py-3 flex items-center gap-3">
        <!-- Menu -->
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 rounded-full hover:bg-emerald-700/40">
          <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 class="flex-1 text-lg font-semibold text-center -ml-8 tracking-wide">SeniorGo</h1>
        <router-link to="/senior/profile" aria-label="Profile">
          <img
            :src="avatarUrl"
            @error="useInlineAvatar"
            class="w-8 h-8 rounded-full border border-white/70 object-cover"
            alt="Profile"
          />
        </router-link>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-4 pb-[88px]">
      <nav class="text-sm text-emerald-700 mb-4" aria-label="Breadcrumb">
        <ol class="list-reset flex items-center space-x-2">
          <li>
            <a href="/senior/dashboard" class="hover:underline font-medium">Dashboard</a>
          </li>
          <li class="text-emerald-500">›</li>
          <li class="font-semibold text-emerald-700">My Requirements</li>
        </ol>
      </nav>

      <div class="space-y-4">
        <div
          v-for="program in programs"
          :key="program.id"
          class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow ring-1 ring-emerald-100 p-4"
        >
          <!-- Program Header -->
          <div
            class="flex justify-between items-center cursor-pointer select-none"
            @click="toggleProgram(program.id)"
          >
            <div>
              <h2 class="text-[15px] font-semibold text-emerald-800">{{ program.name }}</h2>
              <p class="text-xs text-gray-500 mt-0.5">{{ program.status }}</p>
            </div>
            <svg
              :class="{ 'rotate-180': expanded === program.id }"
              class="w-5 h-5 text-emerald-700 transition-transform"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          <!-- Expanded Section -->
          <transition name="fade">
            <div v-if="expanded === program.id" class="mt-4 border-t border-emerald-100 pt-3">
              <h3 class="text-sm font-medium text-emerald-700 mb-2">Uploaded Documents</h3>
              <ul class="space-y-3">
                <li
                  v-for="(doc, j) in program.documents"
                  :key="j"
                  class="flex items-center justify-between bg-emerald-50/30 px-3 py-2 rounded-lg border border-emerald-100"
                >
                  <div>
                    <p class="text-[14px] text-gray-800 font-medium">{{ doc.name }}</p>
                    <p
                      class="text-[12px] capitalize"
                      :class="{
                        'text-green-700': doc.status === 'completed',
                        'text-yellow-700': doc.status === 'draft'
                      }"
                    >
                      {{ doc.status }}
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <button
                      v-if="doc.url"
                      class="text-xs px-3 py-1 bg-emerald-500 text-white rounded-md shadow-sm hover:bg-emerald-600"
                      @click="viewDocument(doc.url)"
                    >
                      View
                    </button>
                    <button
                      v-if="doc.status === 'completed'"
                      class="text-xs px-3 py-1 bg-emerald-600 text-white rounded-md shadow-sm hover:bg-emerald-700"
                      @click="printDocument(doc.url)"
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
    <nav class="fixed bottom-0 inset-x-0 bg-white/95 border-t border-emerald-100 py-2 flex justify-around backdrop-blur">
      <router-link
        to="/senior/notifications"
        class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"
      >
        <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 8a6 6 0 1 1 12 0c0 7 3 5 3 9H3c0-4 3-2 3-9" />
          <path d="M10 21a2 2 0 0 0 4 0" />
        </svg>
      </router-link>

      <button class="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
        <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z" />
          <path d="M19 11a7 7 0 0 1-14 0" />
          <path d="M12 18v4" />
        </svg>
      </button>

      <router-link
        to="/senior/dashboard"
        class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase/client";

/* UI state */
const sidebarOpen = ref(false);
const expanded = ref(null);

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
