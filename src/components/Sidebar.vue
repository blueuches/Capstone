<template>
  <aside
    class="relative md:static bg-white/95 backdrop-blur shadow-lg flex flex-col justify-between py-6 z-40 transition-all duration-300"
    :class="sidebarOpen ? 'w-64' : 'w-20'"
  >
    <!-- Toggle Button -->
    <button
      @click="sidebarOpen = !sidebarOpen"
      class="absolute -right-3 top-6 bg-emerald-600 text-white rounded-full p-1 shadow-md hover:bg-emerald-700 transition-transform"
      :class="sidebarOpen ? 'rotate-0' : 'rotate-180'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Sidebar Content -->
    <div>
      <div class="px-4 flex items-center gap-2 mb-6">
        <h4 v-if="sidebarOpen" class="font-extrabold tracking-tight text-emerald-700 text-xl transition-all">SeniorGo</h4>
        <h4 v-else class="font-extrabold tracking-tight text-emerald-700 text-xl transition-all">S</h4>
      </div>

      <nav class="flex flex-col gap-2 w-full items-start px-2">
        <RouterLink
          v-for="item in links"
          :key="item.path"
          :to="item.path"
          class="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold focus-ring"
          :class="navActive(item.path)"
        >
          <span class="h-8 w-8 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <component :is="item.icon" class="h-5 w-5" />
          </span>
          <span v-if="sidebarOpen" class="font-bold text-base transition-all">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </div>

    <div v-if="sidebarOpen" class="px-4 text-xs text-gray-500 text-center leading-snug mt-4">
      © 2025 <span class="font-semibold text-emerald-700">SeniorGo</span><br />
      Made for Butuan Seniors<br />
      Powered by Barangay &amp; OSCA
    </div>
  </aside>
</template>

<script setup>
import { ref} from 'vue'
import { useRoute } from 'vue-router'
import { Home, Map, Bell, CheckSquare, Users, Megaphone, LogOut } from 'lucide-vue-next'

const props = defineProps({ role: { type: String, default: 'osca' } })


const sidebarOpen = ref(true)
const route = useRoute()

const navActive = (path) => {
  return route.path === path
    ? 'bg-emerald-50 text-emerald-900 font-extrabold relative before:content-[\'\'] before:absolute before:-left-1 before:h-6 before:w-1 before:rounded-full before:bg-emerald-500'
    : ''
}

const oscaLinks = [
  { label: 'Dashboard', path: '/osca/dashboard', icon: Home },
  { label: 'View Barangays', path: '/osca/barangays', icon: Map },
  //{ label: 'Review Seniors', path: '/osca/review', icon: Users },
  { label: 'Applicants', path: '/osca/applications', icon: Users },
  { label: 'Post Announcement', path: '/osca/messaging', icon: Megaphone },
  { label: 'Notification', path: '/osca/notifications', icon: Bell },
  { label: 'Logout', path: '/logout', icon: LogOut },
]

const brgyLinks = [
  { label: 'Dashboard', path: '/barangay/dashboard', icon: Home },
  { label: 'Seniors', path: '/barangay/senior-queue', icon: Users },
  { label: 'Post Announcement', path: '/barangay/messaging', icon: Megaphone },
  { label: 'Notification', path: '/barangay/notifications', icon: Bell },
  { label: 'Logout', path: '/logout', icon: LogOut },
]

const links = props.role === 'brgy' ? brgyLinks : oscaLinks
</script>
