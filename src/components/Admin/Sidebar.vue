<template>
  <aside
    class="bg-[#2e6b38] text-white h-screen shrink-0 flex flex-col transition-all duration-300"
    :class="collapsed ? 'w-20' : 'w-64'"
  >
    <div class="h-16 flex items-center justify-between px-4 border-b border-white/15">
      <div class="flex items-center gap-3 min-w-0">
        <!-- App mark -->
            <div class="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <img 
                src="/logo1.png" 
                alt="Menu" 
                class="w-5 h-5 object-contain rounded-full"
                />
            </div>

        <div v-if="!collapsed" class="min-w-0">
          <div class="font-extrabold tracking-wide text-lg leading-none">SeniorGo</div>
        </div>
      </div>

      <div v-if="!collapsed" class="text-white/80">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M10 7l-5 5 5 5M19 7l-5 5 5 5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <!-- Nav (sidebar itself not scrollable) -->
    <nav class="px-3 py-4 flex-1">
      <div class="space-y-2">
        <RouterLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="group flex items-center gap-3 rounded-xl px-3 py-3 transition
                 bg-white/0 hover:bg-white/15 active:bg-white/20
                 focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/20 transition">
            <component :is="item.icon" class="w-5 h-5" />
          </div>

          <div v-if="!collapsed" class="font-semibold text-sm text-white tracking-wide">
            {{ item.label }}
          </div>
        </RouterLink>
      </div>
    </nav>

    <!-- Footer -->
    <div class="px-4 py-4 border-t border-white/15">
      <div class="text-xs text-white/85 leading-tight">
        <template v-if="!collapsed">
          <div class="font-semibold text-center">OSCA - CSU &copy 2026</div>
        </template>

        <template v-else>
          <div class="flex items-center justify-center">
            <svg class="w-5 h-5 text-white/90" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M8 12h8"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </template>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed } from 'vue'

const props = defineProps<{
  collapsed: boolean
}>()

/**
 * Icons as small functional components (NO JSX)
 * Each returns an <svg> using h() through template via <component :is="..."/>
 */
const IconDashboard = {
  name: 'IconDashboard',
  template: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-7H10v7H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />
    </svg>
  `
}

const IconBarangays = {
  name: 'IconBarangays',
  template: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-8h6v8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />
    </svg>
  `
}

const IconApplication = {
  name: 'IconApplication',
  template: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <path
        d="M14 3v4h4"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <path
        d="M8.5 12h7M8.5 16h7"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  `
}

const IconActivity = {
  name: 'IconActivity',
  template: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12h4l2-6 4 12 2-6h4"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `
}

const IconAnnouncement = {
  name: 'IconAnnouncement',
  template: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 11v2a2 2 0 0 0 2 2h2l6 4V5L8 9H6a2 2 0 0 0-2 2Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <path
        d="M18 9a4 4 0 0 1 0 6"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  `
}

const navItems = computed(() => [
  { label: 'Dashboard', to: '/admin/dashboard', icon: IconDashboard },
  { label: 'Logs', to: '/admin/logs', icon: IconBarangays },
  { label: 'Users', to: '/admin/users', icon: IconApplication },
  { label: 'Edit', to: '/admin/edit', icon: IconActivity },
  { label: 'Form Builder', to: '/admin/formbuilder', icon: IconAnnouncement },
  { label: 'Backups', to: '/admin/backup', icon: IconAnnouncement }

])
</script>
