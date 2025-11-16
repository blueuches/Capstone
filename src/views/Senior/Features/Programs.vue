<template>
  <div class="flex flex-col h-dvh bg-gradient-to-b from-emerald-50 to-white overflow-hidden">
    <!-- Header -->
    <SeniorHeader @toggle-sidebar="toggleSidebar" />

  <SeniorSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto px-4 pt-3 pb-[88px]">
        <nav class="text-sm text-emerald-700 mb-4" aria-label="Breadcrumb">
    <ol class="list-reset flex items-center space-x-2">
        <li>
        <a href="/senior/dashboard" class="hover:underline font-medium">Dashboard</a>
        </li>
        <li class="text-emerald-500">›</li>
        <li class="font-semibold text-emerald-700">Programs</li>
    </ol>
    </nav>

      <!-- Loading State -->
      <div v-if="loading" class="text-center text-gray-500 py-8">
        <svg class="animate-spin w-6 h-6 mx-auto mb-2 text-emerald-600" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
        Loading programs...
      </div>

      <!-- Program List -->
      <div v-else class="space-y-4">
        <div
          v-for="p in filteredPrograms"
          :key="p.id"
          class="bg-white rounded-2xl shadow-md ring-1 ring-emerald-100 p-4 hover:shadow-lg transition-all duration-200"
        >
          <div class="flex items-start justify-between">
            <div>
              <h2 class="font-semibold text-emerald-800 text-lg">{{ p.name }}</h2>
              <p class="text-sm text-gray-600 mt-1">{{ p.description }}</p>
            </div>
            <button
              class="text-emerald-600 text-sm font-medium"
              @click="p.open = !p.open"
            >
              {{ p.open ? 'Hide' : 'Read more' }}
            </button>
          </div>

          <transition name="fade">
            <div v-if="p.open" class="mt-3 text-[15px] space-y-2 border-t border-emerald-50 pt-3">
              <p><span class="font-semibold text-emerald-700">Eligibility:</span> {{ p.eligibility }}</p>
              <p><span class="font-semibold text-emerald-700">Requirements:</span></p>
              <ul class="list-disc ml-5 text-gray-700">
                <li v-for="req in p.requirements" :key="req">{{ req }}</li>
              </ul>
              <p><span class="font-semibold text-emerald-700">Process:</span></p>
              <p class="whitespace-pre-line">{{ p.process }}</p>
              <p v-if="p.benefits"><span class="font-semibold text-emerald-700">Benefits:</span> {{ p.benefits }}</p>
              <p v-if="p.contact_info" class="text-sm text-gray-500 italic">Contact: {{ p.contact_info }}</p>
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
import { ref, onMounted, computed } from "vue";
import { supabase } from '@/supabase/client'
import SeniorNav from '@/components/SeniorNav.vue'
import SeniorSidebar from '@/components/SeniorSidebar.vue'
import SeniorHeader from '@/components/SeniorHeader.vue'


const sidebarOpen = ref(false);
function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }
const avatarUrl = ref("https://via.placeholder.com/60");
const search = ref("");
const programs = ref([]);
const loading = ref(true);

// fetch Programs from database
onMounted(async () => {
  const { data, error } = await supabase
    .from("Programs")
    .select("id, name, description, process, requirements, eligibility, benefits, contact_info");
  if (error) {
    console.error("Error loading programs:", error.message);
  } else {
    programs.value = data.map((p) => ({ ...p, open: false }));
  }
  loading.value = false;
});

const filteredPrograms = computed(() =>
  programs.value.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

function useInlineAvatar() {
  avatarUrl.value =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
      <rect width="100%" height="100%" fill="#ecfdf5"/>
      <circle cx="30" cy="22" r="12" fill="#10b981" fill-opacity="0.5"/>
      <rect x="14" y="38" width="32" height="14" rx="7" fill="#10b981" fill-opacity="0.35"/>
    </svg>`);
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
main {
  -webkit-overflow-scrolling: touch;
}
</style>
