<template>
  <div class="senior-font-root bg-gradient-to-b from-emerald-50 to-white min-h-screen flex flex-col">
    <!-- Sticky Top Bar -->
    <SeniorHeader @toggle-sidebar="toggleSidebar" />

  <SeniorSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <main class="flex-1 overflow-y-auto px-4 pb-[88px] pt-3">
  <div class="p-4 space-y-3">
      <nav class="text-sm text-emerald-700 mb-4" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <router-link to="/senior/dashboard" class="hover:underline font-medium">Dashboard</router-link>
          </li>
          <li class="text-emerald-500">›</li>
          <li class="font-semibold text-emerald-700">Help & FAQs</li>
        </ol>
      </nav>

    <label class="relative block">
      <svg class="absolute left-3 top-2.5 h-5 w-5 text-emerald-900/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle><path d="m21 21-3.5-3.5"></path>
      </svg>
      <input v-model="q" type="search" placeholder="Search question..."
             class="w-full rounded-xl pl-10 pr-3 py-2 text-[15px] bg-white ring-1 ring-emerald-200 focus:ring-2 focus:ring-yellow-300 outline-none"/>
    </label>

    <div v-for="(f,i) in filteredFaqs" :key="i"
         class="bg-white rounded-xl p-4 ring-1 ring-emerald-100 shadow-sm">
      <button class="w-full text-left font-semibold text-emerald-800"
              @click="f.open=!f.open">
        {{ f.q }}
      </button>
      <transition name="fade">
        <p v-if="f.open" class="mt-2 text-sm text-gray-700">{{ f.a }}</p>
      </transition>
    </div>

    <div class="bg-emerald-50 rounded-xl p-4 text-sm text-emerald-900">
      <p class="font-semibold">Need more help?</p>
      <p>Call OSCA Butuan Hotline: <span class="font-bold">0999-123-4567</span></p>
      <router-link to="/senior/testvoiceweb">Test here raw</router-link>
      <router-link to="/senior/testvoice">Test here the form</router-link>
    </div>
  </div>

    </main>

    <!-- Sticky Bottom Tabbar (safe-area aware) -->
    <SeniorNav />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import SeniorNav from '@/components/SeniorNav.vue'
import SeniorSidebar from '@/components/SeniorSidebar.vue'
import SeniorHeader from '@/components/SeniorHeader.vue'


const sidebarOpen = ref(false)
function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }
const faqs = ref([
  { q:'How do I apply for a social pension?', a:'Go to your Barangay OSCA focal person and submit your requirements.', open:false },
  { q:'Who qualifies for medical assistance?', a:'All registered senior citizens who meet income criteria.', open:false }
])
const q = ref('')
const filteredFaqs = computed(()=> !q.value ? faqs.value :
  faqs.value.filter(f=>f.q.toLowerCase().includes(q.value.toLowerCase())))

const avatarUrl = ref("https://via.placeholder.com/60");

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
