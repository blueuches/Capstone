<template>
  <aside
    class="bg-[#2e6b38] text-white h-screen shrink-0 flex flex-col transition-all duration-300"
    :class="collapsed ? 'w-20' : 'w-64'"
  >
    <!-- Top / Brand -->
    <div class="h-16 flex items-center justify-between px-4 border-b border-white/15">
      <div class="flex items-center gap-3 min-w-0">
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

      </div>
    </div>

    <!-- Nav (sidebar itself not scrollable) -->
    <nav class="px-3 py-4 flex-1">
      <div class="space-y-2">
        <SidebarItem
          v-for="item in navItems"
          :key="item.label"
          :label="item.label"
          :to="item.to"
          :icon="item.icon"
          :collapsed="collapsed"
        />
      </div>
    </nav>

    <!-- Footer -->
    <div class="px-4 py-4 border-t border-white/15">
      <div class="text-xs text-white/85 leading-tight">
        <template v-if="!collapsed">
          <div class="font-semibold text-center">{{ footerText }}</div>
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
import SidebarItem from '@/components/Admin/SidebarItem.vue'

//type IconComponent = Record<string, any>

export type NavItem = {
  label: string
  to: string
  icon: string
}

defineProps<{
  collapsed: boolean
  navItems: NavItem[]
  footerText?: string
}>()
</script>
