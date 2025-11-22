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
            <div
              v-if="expanded === program.id"
              class="mt-4 pt-3 border-t border-emerald-100 space-y-4"
            >
              <!-- 1) Application form summary -->
              <section>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-sm font-medium text-emerald-700">
                    Application Form Summary
                  </h3>

                  <!-- View Answers button (modal trigger) -->
                  <button
                    v-if="program.answers && program.answers.length"
                    type="button"
                    class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-semibold shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    @click.stop="openAnswersModal(program)"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      class="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M4 6h16" />
                      <path d="M4 12h16" />
                      <path d="M4 18h10" />
                    </svg>
                    <span>View Answers</span>
                  </button>
                </div>

                <div
                  v-if="program.summary && program.summary.length"
                  class="bg-emerald-50/40 border border-emerald-100 rounded-lg px-3 py-3"
                >
                  <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[13px]">
                    <div
                      v-for="item in program.summary"
                      :key="item.label"
                      class="flex gap-2"
                    >
                      <dt class="w-28 text-[11px] uppercase tracking-wide text-emerald-500">
                        {{ item.label }}
                      </dt>
                      <dd class="flex-1 text-gray-900 font-medium">
                        {{ item.value }}
                      </dd>
                    </div>
                  </dl>
                </div>
                <p
                  v-else
                  class="text-xs text-gray-500 italic"
                >
                  Wala pay na-save nga form answers para ani nga application.
                </p>
              </section>

              <!-- 2) Uploaded Documents -->
              <section>
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
                        <!-- simple file icon -->
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

                    <!-- Right: actions -->
                    <div class="flex items-center gap-2">
                      <button
                        v-if="doc.url"
                        type="button"
                        class="px-2.5 py-1 rounded-full border border-emerald-200 text-[11px] font-medium text-emerald-700 bg-white hover:bg-emerald-50"
                        @click.stop="viewDocument(doc.url, doc.name)"
                      >
                        View
                      </button>

                      <button
                        v-if="doc.url"
                        type="button"
                        class="px-2.5 py-1 rounded-full border border-emerald-200 text-[11px] font-medium text-emerald-700 bg-white hover:bg-emerald-50"
                        @click.stop="printDocument(doc.url)"
                      >
                        Print
                      </button>
                    </div>
                  </li>
                </ul>
              </section>
            </div>
          </transition>
        </div>
      </div>
    </main>

    <!-- Bottom Tabbar -->
    <SeniorNav />

    <!-- 🟢 Answers Modal -->
    <div
      v-if="showAnswersModal"
      class="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/40"
      @click.self="closeAnswersModal"
    >
      <div class="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md max-h-[80vh] overflow-hidden">
        <div class="px-4 py-3 border-b border-emerald-100 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-emerald-800">
            Application Form Answers
          </h3>
          <button
            type="button"
            class="p-1 rounded-full hover:bg-emerald-50 text-gray-500 hover:text-emerald-700"
            @click="closeAnswersModal"
          >
            <span class="sr-only">Close</span>
            ✕
          </button>
        </div>

        <div class="px-4 py-3 overflow-y-auto max-h-[70vh]">
          <p v-if="activeProgramName" class="text-xs text-gray-500 mb-3">
            Program:
            <span class="font-medium text-gray-800">{{ activeProgramName }}</span>
          </p>

          <dl v-if="activeProgramAnswers.length" class="space-y-2 text-[13px]">
            <div
              v-for="(item, idx) in activeProgramAnswers"
              :key="idx"
              class="flex gap-3"
            >
              <dt class="w-32 text-[11px] uppercase tracking-wide text-emerald-500">
                {{ item.label }}
              </dt>
              <dd class="flex-1 text-gray-900">
                {{ item.value }}
              </dd>
            </div>
          </dl>

          <p
            v-else
            class="text-xs text-gray-500 italic"
          >
            Wala pay na-save nga form answers para ani nga application.
          </p>
        </div>
      </div>

    </div>

        <!-- 🟢 File Preview Modal (same as in ApplyRequest.vue) -->
    <FilePreviewModal
      :open="previewOpen"
      :url="previewUrl || undefined"
      :label="previewLabel"
      :type="previewType"
      :loading="previewLoading"
      :error="previewError"
      @close="previewOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase/client";
import SeniorNav from '@/components/SeniorNav.vue'
import SeniorSidebar from '@/components/SeniorSidebar.vue'
import SeniorHeader from '@/components/SeniorHeader.vue'
import FilePreviewModal from '@/components/FilePreviewModal.vue'


/* UI state */
const expanded = ref(null);
const sidebarOpen = ref(false);
function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }

/* Modal state for answers */
const showAnswersModal = ref(false);
const activeProgramName = ref("");
const activeProgramAnswers = ref([]);

/* Data */
const programs = ref([]);
let variantMap = new Map();    

const previewOpen = ref(false);
const previewUrl = ref("");
const previewType = ref("other"); // 'image' | 'pdf' | 'other'
const previewLabel = ref("");
const previewLoading = ref(false);
const previewError = ref("");

/* UI helpers */
function toggleProgram(id) {
  expanded.value = expanded.value === id ? null : id;
}

function openAnswersModal(program) {
  activeProgramName.value = program.name || "";
  activeProgramAnswers.value = program.answers || [];
  showAnswersModal.value = true;
}

function closeAnswersModal() {
  showAnswersModal.value = false;
}

function viewDocument(url, label) {
  if (!url) return;

  previewOpen.value = true;
  previewLoading.value = true;
  previewError.value = "";
  previewLabel.value = label || "";

  try {
    previewType.value = detectTypeFromPath(url);
    previewUrl.value = url;
  } catch (e) {
    previewError.value = e?.message || String(e);
  } finally {
    previewLoading.value = false;
  }
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

  // All request documents are stored in the "requirements" bucket.
  // filePath is just the key (e.g. "requests/123/label_timestamp_file.pdf").
  try {
    const { data } = supabase.storage
      .from("requirements")
      .getPublicUrl(filePath);
    return data?.publicUrl || "";
  } catch (_) {
    return "";
  }
}

/* Data load */
onMounted(async () => {
  try {
    // 1) who am I
    const { data: authRes, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authRes?.user) {
      programs.value = [];
      return;
    }
    const uid = authRes.user.id;

    // 2) get my senior_id
    const { data: seniorRow, error: seniorErr } = await supabase
      .from("senior_citizens") // view
      .select("id")
      .eq("user_id", uid)
      .maybeSingle();
    if (seniorErr || !seniorRow?.id) {
      programs.value = [];
      return;
    }
    const seniorId = seniorRow.id;

    // 3) my requests (include program_variant_id)
    const { data: reqs, error: reqErr } = await supabase
      .from("requests") // view
      .select("id, status, program_id, program_variant_id, created_at")
      .eq("senior_id", seniorId);
    if (reqErr || !reqs?.length) {
      programs.value = [];
      return;
    }

    // client-side order desc by created_at
    reqs.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // 4) programs lookup via view
    const programIds = Array.from(
      new Set(reqs.map((r) => r.program_id))
    ).filter(Boolean);
    let progMap = new Map();
    if (programIds.length) {
      const { data: progs, error: progErr } = await supabase
        .from("programs") // view
        .select("id, name")
        .in("id", programIds);
      if (!progErr && progs) {
        progMap = new Map(progs.map((p) => [p.id, p.name]));
      }
    }

    // 4.5) 🔹 load variant names (if there are variants)
    const variantIds = [
      ...new Set(
        reqs
          .map((r) => r.program_variant_id)
          .filter((v) => v !== null && v !== undefined)
      ),
    ];
    if (variantIds.length) {
      const { data: variants, error: vErr } = await supabase
        .from("program_variants")
        .select("id, name")
        .in("id", variantIds);
      if (!vErr && variants) {
        variantMap = new Map(variants.map((v) => [v.id, v.name]));
      }
    }

    // 5) Documents for each request — per-request fetch
    const reqIds = reqs.map((r) => r.id).filter(Boolean);

    let allDocs = [];
    for (const rid of reqIds) {
      const { data, error: docErr } = await supabase
        .from("request_documents") // view
        .select("request_id, kind, file_path")
        .eq("request_id", rid);

      if (docErr) {
        console.warn("Docs load error for request", rid, docErr);
        continue;
      }
      if (data?.length) allDocs = allDocs.concat(data);
    }

    // group docs by request
    const docsByReq = new Map();
    (allDocs || []).forEach((d) => {
      const arr = docsByReq.get(d.request_id) || [];
      arr.push(d);
      docsByReq.set(d.request_id, arr);
    });

    // 6) Form answers for each request – full answers + summary
    const SUMMARY_FIELDS = [
      "First Name",
      "Middle Name",
      "Last Name",
      "Gender",
      "Age",
      "Date of Birth",
      "Place of Birth",
      "Home Address",
      "Barangay",
      "Mobile No",
      "Civil Status",
      "PhilHealth Membership",
      "Living Arrangements",
      "Health Condition",
      "Blood Type",
    ];

    // Map<request_id, Array<{label,value,order}>>
    const answersByReq = new Map();

    let ansRows = [];
    if (reqIds.length) {
      const { data, error: ansErr } = await supabase
        .from("request_answers") // view
        .select("request_id, field_id, value")
        .in("request_id", reqIds);

      if (ansErr) {
        console.warn("Answers load error:", ansErr);
      } else {
        ansRows = data || [];
      }
    }

    // Fetch FormFields metadata for all field_ids we saw
    let fieldsById = new Map();
    if (ansRows.length) {
      const fieldIds = [...new Set(ansRows.map((r) => r.field_id))];

      const { data: fieldRows, error: fieldErr } = await supabase
        .from("form_fields") // view
        .select("id, label, section, order_index")
        .in("id", fieldIds);

      if (fieldErr) {
        console.warn("FormFields load error:", fieldErr);
      } else {
        fieldsById = new Map(fieldRows.map((f) => [f.id, f]));
      }
    }

    // Build answersByReq
    for (const row of ansRows) {
      const meta = fieldsById.get(row.field_id);
      if (!meta) continue;
      if (meta.section !== "senior") continue; // only show senior-facing fields

      const entry = {
        label: meta.label,
        value: row.value ?? "",
        order: meta.order_index ?? 999,
      };
      if (!entry.value) continue;

      let arr = answersByReq.get(row.request_id);
      if (!arr) {
        arr = [];
        answersByReq.set(row.request_id, arr);
      }
      arr.push(entry);
    }

    // sort each request's answers by order, then label
    for (const arr of answersByReq.values()) {
      arr.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.label.localeCompare(b.label);
      });
    }

    // 7) Build UI list
    const ui = [];
    for (const r of reqs) {
const rawDocs = docsByReq.get(r.id) || [];
const documents = [];
for (const d of rawDocs) {
  // Skip seeded placeholders with no file_path
  if (!d.file_path || d.file_path.trim() === "") continue;

  const url = await resolveFileUrl(d.file_path);
  if (!url) continue; // if somehow URL can’t be generated, don’t show it

  documents.push({
    name: prettifyDocName(d.kind || "Uploaded Document"),
    status: "completed",
    url,
  });
}


      const answersArr = answersByReq.get(r.id) || [];

      // compact summary using SUMMARY_FIELDS
      const summary = SUMMARY_FIELDS
        .map((label) => {
          const found = answersArr.find((a) => a.label === label);
          return found ? { label, value: found.value } : null;
        })
        .filter(Boolean);

      ui.push({
        id: r.id,
        name:
          (r.program_variant_id && variantMap.get(r.program_variant_id)) ||
          progMap.get(r.program_id) ||
          "Program",
        status: mapStatus(r.status),
        documents,
        summary,
        answers: answersArr,
      });
    }

    programs.value = ui;
  } catch (e) {
    console.error("Requirements load failed:", e);
    programs.value = [];
  }
});


function detectTypeFromPath(path) {
  // Strip query string if any
  const clean = (path || "").split("?")[0];
  const ext = (clean.split(".").pop() || "").toLowerCase();

  const images = ["jpg", "jpeg", "png", "webp", "gif", "bmp", "heic", "heif"];
  if (images.includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "other";
}

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
