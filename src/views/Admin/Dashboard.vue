<template>
  <div class="min-h-screen flex bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-[1.05rem] leading-relaxed">
    <!-- Sidebar -->
    <aside class="w-72 bg-emerald-700 text-emerald-50 flex flex-col justify-between p-6 sticky top-0 h-screen shadow-xl text-[1rem]">
      <div>
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow overflow-hidden">
            <img 
              src="/logo.png" 
              alt="OSCA Logo" 
              class="w-8 h-8 object-contain"
            />
          </div>
          <h1 class="text-2xl font-bold tracking-wide text-white">OSCA Admin</h1>
        </div>

        <!-- Navigation -->
        <nav class="space-y-1 font-medium text-[1.05rem]">
          <a href="#dashboard" class="block px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition">Dashboard</a>
          <a href="#programs" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">Programs</a>
          <a href="#forms" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">Application Forms</a>
          <a href="#stats" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">User Stats</a>
          <a href="#complaints" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">Complaints</a>
          <a href="#settings" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">Settings</a>
        </nav>
      </div>

      <!-- Footer -->
      <div class="px-4 text-sm text-emerald-200 text-center leading-snug mt-6 border-t border-emerald-600 pt-4">
        © 2025 <span class="font-semibold text-white">SeniorGo</span><br/>
        Made for Butuan Seniors<br/>
        Powered by Barangay &amp; OSCA
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 space-y-10 overflow-y-auto text-[1.05rem] leading-relaxed">
      <!-- Topbar -->
      <header class="flex items-center justify-between bg-white shadow rounded-lg p-5 sticky top-0 z-10">
        <input
          type="text"
          placeholder="Search seniors or programs..."
          class="border rounded-lg px-4 py-2.5 w-72 focus:ring-2 focus:ring-emerald-500 outline-none text-[1rem]"
        />
        <div class="flex items-center gap-4">
          <button class="bg-emerald-600 text-white px-5 py-2.5 rounded-md hover:bg-emerald-700 shadow text-[1rem]">
            Logout
          </button>
        </div>
      </header>

      <!-- Dashboard Overview -->
      <section id="dashboard" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Programs" value="24" icon="🎯" />
        <DashboardCard title="Active Seniors" value="2,340" icon="👵" />
        <DashboardCard title="Pending Applications" value="156" icon="📑" />
        <DashboardCard title="Staff Accounts" value="12" icon="👨‍💼" />
      </section>

      <!-- Program Management -->
      <section id="programs" class="bg-white shadow rounded-lg p-7">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-emerald-700">Manage Programs</h3>
          <button class="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 shadow text-[1rem]">
            + Add Program
          </button>
        </div>

        <div class="grid md:grid-cols-2 gap-5">
          <div class="bg-emerald-50 p-5 rounded-lg ring-1 ring-emerald-100 hover:ring-emerald-200 transition">
            <h4 class="font-semibold text-emerald-700 text-lg">Social Pension</h4>
            <p class="text-gray-700 mt-1">Monthly stipend for indigent seniors.</p>
            <div class="flex justify-end mt-3">
              <button class="text-emerald-700 text-sm hover:underline">Edit</button>
            </div>
          </div>

          <div class="bg-emerald-50 p-5 rounded-lg ring-1 ring-emerald-100 hover:ring-emerald-200 transition">
            <h4 class="font-semibold text-emerald-700 text-lg">Medical Assistance</h4>
            <p class="text-gray-700 mt-1">Financial support for medical needs.</p>
            <div class="flex justify-end mt-3">
              <button class="text-emerald-700 text-sm hover:underline">Edit</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Application Form Manager -->
      <section id="forms" class="bg-white shadow rounded-lg p-7 relative">
        <h3 class="text-xl font-bold text-emerald-700 mb-4">Application Forms</h3>
        <p class="text-gray-700 mb-6 text-[1rem]">Click on any form below to view or edit its fields.</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-[1rem]">
          <div
            v-for="form in forms"
            :key="form.id"
            class="cursor-pointer bg-emerald-50 p-5 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-100 transition shadow-sm flex flex-col justify-between"
            @click="openForm(form)"
          >
            <div>
              <h4 class="font-semibold text-emerald-800 text-lg mb-1">{{ form.title }}</h4>
              <p class="text-gray-700 mb-3">{{ form.description }}</p>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ form.fields.length }} Fields</span>
              <button class="text-sm bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-700 shadow">
                View Form
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- User Statistics -->
      <section id="stats" class="bg-white shadow rounded-lg p-7">
        <h3 class="text-xl font-bold text-emerald-700 mb-5">User Activity Statistics</h3>

        <div class="grid md:grid-cols-3 gap-6 text-[1rem]">
          <div class="bg-emerald-50 p-5 rounded-lg ring-1 ring-emerald-100 text-center hover:ring-emerald-200 transition">
            <h4 class="font-semibold text-emerald-800 text-lg mb-2">Active Seniors (Last 7 Days)</h4>
            <p class="text-4xl font-bold text-emerald-700">1,284</p>
            <p class="text-sm text-gray-500 mt-1">Users who logged in recently</p>
          </div>

          <div class="bg-emerald-50 p-5 rounded-lg ring-1 ring-emerald-100 text-center hover:ring-emerald-200 transition">
            <h4 class="font-semibold text-emerald-800 text-lg mb-2">New Accounts Created</h4>
            <p class="text-4xl font-bold text-emerald-700">124</p>
            <p class="text-sm text-gray-500 mt-1">New senior users this week</p>
          </div>

          <div class="bg-emerald-50 p-5 rounded-lg ring-1 ring-emerald-100 text-center hover:ring-emerald-200 transition">
            <h4 class="font-semibold text-emerald-800 text-lg mb-2">Barangays Using the System</h4>
            <p class="text-4xl font-bold text-emerald-700">10</p>
            <p class="text-sm text-gray-500 mt-1">Out of 86 total barangays in Butuan</p>
          </div>
        </div>

        <div class="mt-8">
          <canvas id="loginChart" class="max-h-64"></canvas>
        </div>
      </section>

      <!-- Complaints -->
      <section id="complaints" class="bg-white shadow rounded-lg p-7">
        <h3 class="text-xl font-bold text-emerald-700 mb-4">Complaints</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-[1rem] border-collapse min-w-[640px]">
            <thead class="bg-emerald-100 text-emerald-700">
              <tr>
                <th class="px-4 py-3 border">Name</th>
                <th class="px-4 py-3 border">Barangay</th>
                <th class="px-4 py-3 border">Message</th>
                <th class="px-4 py-3 border">Date</th>
                <th class="px-4 py-3 border">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y text-gray-700">
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3">Juan Dela Cruz</td>
                <td class="px-4 py-3">Barangay San Vicente</td>
                <td class="px-4 py-3">Assistance delayed for 3 months.</td>
                <td class="px-4 py-3">Feb 3, 2025</td>
                <td class="px-4 py-3">
                  <span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Pending</span>
                </td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3">Maria Lopez</td>
                <td class="px-4 py-3">Barangay Holy Redeemer</td>
                <td class="px-4 py-3">Verification issue in form submission.</td>
                <td class="px-4 py-3">Jan 30, 2025</td>
                <td class="px-4 py-3">
                  <span class="bg-green-100 text-green-700 px-2 py-1 rounded">Resolved</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Settings -->
      <section id="settings" class="bg-white shadow rounded-lg p-7">
        <h3 class="text-xl font-bold text-emerald-700 mb-2">Settings</h3>
        <p class="text-gray-700 text-[1rem]">System configuration and staff management coming soon…</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { defineComponent, onMounted } from "vue";
import Chart from "chart.js/auto";

// Reusable card component
const DashboardCard = defineComponent({
  props: ["title", "value", "icon"],
  template: `
    <div class="bg-white shadow-md rounded-lg p-5 flex items-center gap-4 hover:shadow-lg transition">
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

// Demo chart (user activity trend)
onMounted(() => {
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
});

import { ref } from "vue";

const forms = ref([
  {
    id: 1,
    title: "Social Pension Form",
    description: "For indigent seniors applying for monthly pension.",
    fields: [
      { label: "Full Name", type: "text", required: true },
      { label: "Birthdate", type: "date", required: true },
      { label: "OSCA ID Number", type: "text", required: true },
    ],
  },
  {
    id: 2,
    title: "Medical Assistance Form",
    description: "Used for applying financial support for hospital needs.",
    fields: [
      { label: "Full Name", type: "text", required: true },
      { label: "Prescription Upload", type: "dropdown", options: ["Upload PDF"], required: true },
      { label: "Amount Requested", type: "number", required: true },
    ],
  },
  {
    id: 3,
    title: "Burial Assistance Form",
    description: "Application for financial help during bereavement.",
    fields: [
      { label: "Applicant Name", type: "text", required: true },
      { label: "Deceased Relation", type: "text", required: true },
      { label: "Death Certificate", type: "dropdown", options: ["Upload file"], required: true },
    ],
  },
  {
    id: 4,
    title: "Centenarian Gift Form",
    description: "Application for ₱100,000 cash gift for 100-year-old seniors.",
    fields: [
      { label: "Full Name", type: "text", required: true },
      { label: "Birth Certificate Upload", type: "dropdown", options: ["Upload File"], required: true },
      { label: "Barangay Certification", type: "text", required: true },
    ],
  },
]);

// State
const activeForm = ref(null);
const editModal = ref(false);
const editData = ref({});
let editIndex = null;

function openForm(form) {
  activeForm.value = JSON.parse(JSON.stringify(form));
}

function addField() {
  activeForm.value.fields.push({
    label: "New Field",
    type: "text",
    required: false,
    options: [],
  });
}

function editField(index) {
  editIndex = index;
  const field = activeForm.value.fields[index];
  editData.value = {
    label: field.label,
    type: field.type,
    required: field.required,
    optionString: field.options ? field.options.join(", ") : "",
  };
  editModal.value = true;
}

function saveEdit() {
  const updated = { ...editData.value };
  if (updated.type === "dropdown" && updated.optionString) {
    updated.options = updated.optionString.split(",").map((s) => s.trim());
  }
  activeForm.value.fields[editIndex] = {
    label: updated.label,
    type: updated.type,
    required: updated.required,
    options: updated.options || [],
  };
  editModal.value = false;
}

function cancelEdit() {
  editModal.value = false;
}

function removeField(index) {
  activeForm.value.fields.splice(index, 1);
}


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
</style>
