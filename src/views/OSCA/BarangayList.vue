<template>
  <!-- Header -->
  <header class="sticky top-0 z-20 bg-[#0F4C81] text-white">
    <div class="max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between">
      <h1 class="font-semibold tracking-wide">Senior Citizens by Barangay</h1>
      <div class="hidden sm:flex items-center gap-2">
        <button class="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">EN</button>
        <button class="text-xs px-3 py-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">CEB</button>
        <button class="ml-1 h-8 w-8 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white" aria-label="Help">?</button>
      </div>
    </div>
  </header>

  <main class="max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-5">
    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div class="flex gap-2">
        <select class="h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F4C81]">
          <option>All Barangays</option>
          <option>Barangay 1</option>
          <option>Barangay 2</option>
          <option>Barangay 3</option>
        </select>
        <select class="h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F4C81]">
          <option>Sort by Name</option>
          <option>Sort by Age</option>
        </select>
      </div>
      <div class="relative w-full sm:w-64">
        <input type="text" placeholder="Search seniors…" class="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F4C81]" />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
      </div>
    </div>

    <!-- Table -->
    <div class="mt-5 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-[#0B1320]">
          <tr>
            <th class="px-4 py-3 text-left font-semibold">#</th>
            <th class="px-4 py-3 text-left font-semibold">Name</th>
            <th class="px-4 py-3 text-left font-semibold">Age</th>
            <th class="px-4 py-3 text-left font-semibold">Sex</th>
            <th class="px-4 py-3 text-left font-semibold">Barangay</th>
            <th class="px-4 py-3 text-left font-semibold">Contact</th>
            <th class="px-4 py-3 text-left font-semibold">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr class="hover:bg-slate-50">
            <td class="px-4 py-3">1</td>
            <td class="px-4 py-3">Juan Dela Cruz</td>
            <td class="px-4 py-3">78</td>
            <td class="px-4 py-3">Male</td>
            <td class="px-4 py-3">Barangay 1</td>
            <td class="px-4 py-3">09123456789</td>
            <td class="px-4 py-3"><span class="status approved">Active</span></td>
          </tr>
          <tr class="hover:bg-slate-50">
            <td class="px-4 py-3">2</td>
            <td class="px-4 py-3">Maria Santos</td>
            <td class="px-4 py-3">82</td>
            <td class="px-4 py-3">Female</td>
            <td class="px-4 py-3">Barangay 2</td>
            <td class="px-4 py-3">09987654321</td>
            <td class="px-4 py-3"><span class="status pending">Pending</span></td>
          </tr>
          <tr class="hover:bg-slate-50">
            <td class="px-4 py-3">3</td>
            <td class="px-4 py-3">Pedro Reyes</td>
            <td class="px-4 py-3">80</td>
            <td class="px-4 py-3">Male</td>
            <td class="px-4 py-3">Barangay 3</td>
            <td class="px-4 py-3">09112223344</td>
            <td class="px-4 py-3"><span class="status inactive">Inactive</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center text-sm text-slate-600">
      <p>Showing 1–3 of 150 seniors</p>
      <div class="flex gap-1">
        <button class="page-btn">Prev</button>
        <button class="page-btn active">1</button>
        <button class="page-btn">2</button>
        <button class="page-btn">3</button>
        <button class="page-btn">Next</button>
      </div>
    </div>
  </main>
</template>

<script setup>
// design-only; no functionality
</script>

<style scoped>
.status {
  @apply px-2 py-0.5 rounded-full text-xs font-medium;
}
.status.approved {
  @apply bg-emerald-100 text-emerald-700;
}
.status.pending {
  @apply bg-amber-100 text-amber-700;
}
.status.inactive {
  @apply bg-red-100 text-red-700;
}
.page-btn {
  @apply h-8 w-8 grid place-items-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0F4C81];
}
.page-btn.active {
  @apply bg-[#0F4C81] text-white border-[#0F4C81];
}
</style>
