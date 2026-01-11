<template>
  <div
    class="min-h-screen flex bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-[1.05rem] leading-relaxed"
  >
    <!-- Sidebar -->
    <aside
      class="w-72 bg-emerald-700 text-emerald-50 flex flex-col justify-between p-6 sticky top-0 h-screen shadow-xl text-[1rem]"
    >
      <div>
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-6">
          <div
            class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow overflow-hidden"
          >
            <img
              src="/icon.png"
              alt="OSCA Logo"
              class="w-8 h-8 object-contain"
            />
          </div>
          <h1 class="text-2xl font-bold tracking-wide text-white">OSCA Admin</h1>
        </div>

        <!-- Navigation -->
        <nav class="space-y-1 font-medium text-[1.05rem]">
          <a
            href="#dashboard"
            class="block px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition"
          >
            Dashboard
          </a>
          <router-link
            to="/admin/programconfig"
            class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition"
            >Programs</router-link
          >
          <router-link
            to="/admin/formbuilder"
            class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition"
            >Application Forms</router-link
          >
          <router-link
            to="/admin/usermanagement"
            class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition"
            >Users</router-link
          >
          <a
            href="#complaints"
            class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition"
            >Logout</a
          >
        </nav>
      </div>

      <!-- Footer -->
      <div
        class="px-4 text-sm text-emerald-200 text-center leading-snug mt-6 border-t border-emerald-600 pt-4"
      >
        © 2025 <span class="font-semibold text-white">SeniorGo</span><br />
        Made for Butuan Seniors<br />
        Powered by Barangay &amp; OSCA
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 space-y-10 overflow-y-auto text-[1.05rem] leading-relaxed">
      <!-- Welcome / Header card -->
      <div
        class="bg-white/90 backdrop-blur rounded-3xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between animate-float"
      >
        <div>
          <p class="text-gray-700 text-base">
            Welcome,
            <span class="font-semibold text-emerald-700">Barangay Personnel</span>
          </p>
          <p class="text-xs text-gray-500 mt-1">
            Live counts are based on current records in the SeniorGo database.
          </p>
        </div>
        <div class="mt-3 md:mt-0 flex items-center gap-2">
          <router-link
            to="/logout"
            class="px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
          >
            Logout
          </router-link>
        </div>
      </div>

      <!-- Dashboard Overview -->
      <section
        id="dashboard"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <DashboardCard
          title="Seniors in the System"
          :value="totalSeniorsDisplay"
          icon="👵"
        />
        <DashboardCard
          title="Barangays with Staff"
          :value="barangaysWithStaffDisplay"
          icon="🏘️"
        />
        <DashboardCard
          title="Active Staff Accounts"
          :value="totalStaffDisplay"
          icon="👨‍💼"
        />
      </section>

      <p v-if="countsError" class="text-sm text-red-500 mt-2">
        {{ countsError }}
      </p>

      <!-- Filler / extra design section -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <!-- Chart card -->
        <div
          class="bg-white/90 backdrop-blur rounded-3xl shadow-md p-6 lg:col-span-2 flex flex-col"
        >
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="text-lg font-semibold text-emerald-800">
                System Activity (Demo)
              </h2>
              <p class="text-xs text-gray-500">
                Weekly login trend for OSCA &amp; barangay staff.
              </p>
            </div>
          </div>
          <div class="mt-4">
            <canvas id="loginChart" class="w-full h-52"></canvas>
          </div>
        </div>

        <!-- Small highlight / helper card -->
        <div
          class="bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 text-white rounded-3xl shadow-md p-6 flex flex-col justify-between"
        >
          <div>
            <h2 class="text-lg font-semibold mb-1">Quick Snapshot</h2>
            <p class="text-sm text-emerald-100 mb-4">
              Keep track of seniors, active barangays, and staff in one glance.
            </p>
          </div>
          <ul class="space-y-2 text-sm text-emerald-50">
            <li>• Monitor how many seniors are already onboarded.</li>
            <li>• See which barangays have active staff in the system.</li>
            <li>• Check total OSCA and barangay staff accounts at a glance.</li>
          </ul>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { defineComponent, ref, computed, onMounted } from "vue";
import Chart from "chart.js/auto";
import { supabase } from "@/supabase/client";

// Reusable card component
const DashboardCard = defineComponent({
  props: ["title", "value", "icon"],
  template: `
    <div class="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition">
      <div class="w-14 h-14 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full text-2xl">
        {{ icon }}
      </div>
      <div>
        <p class="text-sm text-gray-500">{{ title }}</p>
        <p class="text-2xl font-bold text-emerald-700">{{ value }}</p>
      </div>
    </div>
  `,
});

// ===== Reactive counts =====
const totalSeniors = ref(null);
const barangaysWithStaff = ref(null);
const totalStaff = ref(null);
const countsLoading = ref(false);
const countsError = ref(null);

const totalSeniorsDisplay = computed(() =>
  countsLoading.value ? "…" : (totalSeniors.value ?? 0).toLocaleString()
);
const barangaysWithStaffDisplay = computed(() =>
  countsLoading.value ? "…" : (barangaysWithStaff.value ?? 0).toLocaleString()
);
const totalStaffDisplay = computed(() =>
  countsLoading.value ? "…" : (totalStaff.value ?? 0).toLocaleString()
);

// Fetch live counts from Supabase
async function fetchCounts() {
  try {
    countsLoading.value = true;
    countsError.value = null;

    // 1) Count of all seniors in the system
    const { count: seniorsCount, error: seniorsError } = await supabase
      .from("senior_citizens")
      .select("*", { count: "exact", head: true });

    if (seniorsError) throw seniorsError;
    totalSeniors.value = seniorsCount ?? 0;

    // 2 & 3) Barangays with staff + total staff (barangay + OSCA)
    // We use memberships joined to organizations.
    const { data: staffMemberships, error: memError } = await supabase
      .from("memberships")
      .select("user_id, status, organizations!inner(kind, barangay_id)")
      .eq("status", "active")
      .in("organizations.kind", ["osca", "barangay"]);

    if (memError) throw memError;

    const brgySet = new Set();
    const staffSet = new Set();

    for (const row of staffMemberships || []) {
      if (row.user_id) {
        staffSet.add(row.user_id);
      }
      if (
        row.organizations &&
        row.organizations.kind === "barangay" &&
        row.organizations.barangay_id
      ) {
        brgySet.add(row.organizations.barangay_id);
      }
    }

    barangaysWithStaff.value = brgySet.size;
    totalStaff.value = staffSet.size;
  } catch (err) {
    console.error("Error loading dashboard counts", err);
    countsError.value = "Could not load live counts from the database.";
  } finally {
    countsLoading.value = false;
  }
}

// Chart setup
function setupLoginChart() {
  const ctx = document.getElementById("loginChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Logins",
          data: [210, 330, 290, 400, 370, 420, 460],
          borderColor: "#059669",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });
}

onMounted(async () => {
  await fetchCounts();
  setupLoginChart();
});
</script>

<style scoped>
.nav-link {
  display: block;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
}
.nav-link.bg-emerald-600 {
  background-color: #059669;
}

/* simple float animation for the header card */
@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
}
.animate-float {
  animation: float 5s ease-in-out infinite;
}
</style>