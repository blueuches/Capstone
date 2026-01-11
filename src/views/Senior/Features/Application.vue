<template>
  <div
    class="senior-font-root flex flex-col h-dvh bg-gradient-to-b from-emerald-50 via-white to-emerald-50/40 overflow-hidden"
  >
    <!-- Sticky Header -->
    <SeniorHeader @toggle-sidebar="toggleSidebar" />
    <SeniorSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto px-4 pt-4 pb-[88px]">
      <!-- Breadcrumb -->
      <nav class="text-sm text-emerald-700 mb-3" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <router-link
              to="/senior/dashboard"
              class="hover:underline font-medium"
            >
              Dashboard
            </router-link>
          </li>
          <li class="text-emerald-500">›</li>
          <li class="font-semibold text-emerald-700">My Applications</li>
        </ol>
      </nav>

      <!-- Page header -->
      <section class="mb-4">
        <h1 class="text-2xl font-bold text-emerald-900 leading-snug">
          My Applications
        </h1>
        <p class="text-[15px] text-emerald-800 mt-1">
          See the status of your requests sent to OSCA and any remarks from
          their staff.
        </p>
      </section>

      <!-- Summary chips -->
      <section v-if="applications.length" class="mb-4">
        <div class="grid grid-cols-3 gap-2 text-[13px]">
          <div
            class="bg-white/80 rounded-2xl p-3 shadow-sm ring-1 ring-emerald-100 flex flex-col items-center"
          >
            <span class="text-xs text-gray-500 mb-1">Total</span>
            <span class="text-lg font-semibold text-emerald-800">
              {{ totalCount }}
            </span>
          </div>

          <div
            class="bg-emerald-50 rounded-2xl p-3 shadow-sm ring-1 ring-emerald-100 flex flex-col items-center"
          >
            <span class="text-xs text-gray-500 mb-1">Waiting for OSCA</span>
            <span class="text-lg font-semibold text-emerald-800">
              {{ waitingCount }}
            </span>
          </div>

          <div
            class="bg-amber-50 rounded-2xl p-3 shadow-sm ring-1 ring-amber-100 flex flex-col items-center"
          >
            <span class="text-xs text-gray-500 mb-1">With remarks</span>
            <span class="text-lg font-semibold text-amber-800">
              {{ withRemarksCount }}
            </span>
          </div>
        </div>
      </section>

      <!-- Empty state (design only) -->
      <section
        v-if="applications.length === 0"
        class="mt-10 flex flex-col items-center text-center"
      >
        <div
          class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-9 w-9 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <p class="text-[15px] text-emerald-900 font-semibold mb-1">
          You have no applications yet.
        </p>
        <p class="text-[14px] text-gray-600 mb-4 px-4">
          When you apply for an OSCA ID or other programs, you can track the
          progress here.
        </p>
        <router-link
          to="/senior/programs"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 text-white text-[15px] font-semibold shadow-sm active:scale-[0.99]"
        >
          Apply for a program
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </section>

      <!-- Applications list (design preview with mock data) -->
      <section v-else class="space-y-4 mt-4">
        <article
          v-for="app in applications"
          :key="app.id"
          class="bg-white rounded-3xl shadow-sm hover:shadow-md ring-1 ring-emerald-100 px-4 py-4 transition duration-200"
        >
          <!-- Header: Program & status -->
          <div class="flex items-start justify-between gap-3 mb-2">
            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              </div>
              <div>
                <p class="text-[12px] text-gray-500 mb-0.5">
                  Request #{{ app.id }}
                </p>
                <h2
                  class="text-[16px] font-semibold text-emerald-900 leading-snug"
                >
                  {{ app.programName }}
                </h2>
                <p
                  v-if="app.programCode"
                  class="text-[12px] text-gray-500 mt-0.5"
                >
                  {{ app.programCode }}
                </p>
              </div>
            </div>

            <span
              class="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap"
              :class="statusPillClass(app.status)"
            >
              {{ app.statusLabel }}
            </span>
          </div>

          <!-- Status explanation -->
          <p class="text-[14px] text-gray-700 mb-1">
            {{ app.statusDescription }}
          </p>
          <p class="text-[12px] text-gray-500">
            Last update:
            <span class="font-medium text-gray-700">
              {{ app.updatedAt }}
            </span>
          </p>

          <!-- Progress bar -->
          <div class="mt-3">
            <div class="flex justify-between text-[11px] text-gray-500 mb-1">
              <span>Progress</span>
              <span>{{ app.progress }}% complete</span>
            </div>
            <div class="h-2.5 bg-emerald-50 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                :style="{ width: app.progress + '%' }"
              ></div>
            </div>
            <div
              class="flex justify-between text-[11px] text-gray-500 mt-1.5 px-0.5"
            >
              <span>Draft</span>
              <span>Submitted</span>
              <span>In review</span>
              <span>Reviewed</span>
            </div>
          </div>

          <!-- OSCA remark -->
          <div
            v-if="app.note"
            class="mt-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 px-3 py-2.5"
          >
            <div class="flex items-start gap-2">
              <div class="pt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-emerald-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 9h.008M5.25 5.25h13.5v9.75L15 18.75H5.25z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-0.5">
                  <p
                    class="text-[13px] font-semibold text-emerald-900 leading-snug"
                  >
                    Latest note about this request
                  </p>
                  <span
                    v-if="app.hasOscaRemark"
                    class="text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full"
                  >
                    From OSCA
                  </span>
                </div>
                <p class="text-[13px] text-emerald-900 leading-snug">
                  “{{ app.note }}”
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>

    <!-- Bottom Navigation -->
    <SeniorNav />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import SeniorNav from "@/components/SeniorNav.vue";
import SeniorSidebar from "@/components/SeniorSidebar.vue";
import SeniorHeader from "@/components/SeniorHeader.vue";

const sidebarOpen = ref(false);
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

// ─── MOCK DATA FOR DESIGN PREVIEW ──────────────────────────────
const applications = ref([
  {
    id: "REQ-00123",
    programName: "OSCA ID Issuance",
    programCode: "OSCA-01",
    status: "submitted",
    statusLabel: "Submitted",
    statusDescription:
      "Your application has been sent and is waiting for OSCA to review.",
    progress: 50,
    updatedAt: "Aug 10, 2025 · 2:15 PM",
    note: "Please upload a clearer copy of your barangay certificate.",
    hasOscaRemark: true,
  },
  {
    id: "REQ-00107",
    programName: "Social Pension Program",
    programCode: "DSS-02",
    status: "in_review",
    statusLabel: "In review",
    statusDescription: "OSCA staff is currently checking your application.",
    progress: 75,
    updatedAt: "Aug 8, 2025 · 10:40 AM",
    note: "",
    hasOscaRemark: false,
  },
  {
    id: "REQ-00088",
    programName: "Medical Assistance",
    programCode: "MED-05",
    status: "reviewed",
    statusLabel: "Reviewed",
    statusDescription:
      "OSCA has reviewed your application. Please check the note for instructions on the next steps.",
    progress: 100,
    updatedAt: "Aug 3, 2025 · 3:05 PM",
    note: "Your documents are complete. Please visit the OSCA office on your scheduled date for releasing.",
    hasOscaRemark: true,
  },
]);

// ─── HELPERS ───────────────────────────────────────────────────

function statusPillClass(status) {
  const s = (status || "").toLowerCase();
  if (s === "reviewed" || s === "approved") {
    return "bg-emerald-100 text-emerald-800";
  }
  if (s === "submitted" || s === "in_review") {
    return "bg-amber-100 text-amber-800";
  }
  if (s === "needs_correction" || s === "rejected") {
    return "bg-red-100 text-red-700";
  }
  if (s === "draft") {
    return "bg-gray-100 text-gray-700";
  }
  return "bg-gray-100 text-gray-700";
}

const totalCount = computed(() => applications.value.length);

const waitingCount = computed(() =>
  applications.value.filter((a) =>
    ["submitted", "in_review"].includes((a.status || "").toLowerCase())
  ).length
);

const withRemarksCount = computed(() =>
  applications.value.filter((a) => a.hasOscaRemark).length
);
</script>

<style scoped>
/* Smooth scroll within main content */
main {
  -webkit-overflow-scrolling: touch;
}

/* Prevent extra horizontal scroll */
* {
  max-width: 100vw;
  box-sizing: border-box;
}
</style>