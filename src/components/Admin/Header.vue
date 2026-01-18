<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
    <!-- Left: Burger + optional Search -->
    <div class="flex items-center gap-3 min-w-0">
      <button
        @click="$emit('toggle-sidebar')"
        class="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition flex items-center justify-center"
        aria-label="Toggle sidebar"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <div v-if="showSearch" class="hidden sm:block w-[320px] max-w-[45vw]">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M21 21l-4.3-4.3"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </span>
          <input
            v-model="searchValue"
            type="text"
            placeholder="Search..."
            class="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#42ad43]/30 focus:border-[#42ad43]"
            @input="$emit('update:search', searchValue)"
          />
        </div>
      </div>
    </div>

    <!-- Right: Notifications + Profile -->
    <div class="flex items-center gap-2">
      <!-- Profile dropdown -->
      <div class="relative" ref="profileWrap">
        <button
          @click="logout"
          class="px-4 py-2 rounded-xl border border-gray-200
                bg-white hover:bg-gray-50 active:bg-gray-100
                text-sm font-semibold text-gray-700
                transition flex items-center justify-center"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth' 

const { logout } = useAuth()

const props = defineProps<{
  showSearch?: boolean
  notificationCount?: number
  search?: string
}>()

defineEmits<{
  (e: 'toggle-sidebar'): void
  (e: 'update:search', v: string): void
}>()

const searchValue = ref(props.search ?? '')
const profileOpen = ref(false)
const profileWrap = ref<HTMLElement | null>(null)

const notificationCount = computed(() => props.notificationCount ?? 0)
const displayNotif = computed(() => (notificationCount.value > 99 ? '99+' : String(notificationCount.value)))

function toggleProfile() {
  profileOpen.value = !profileOpen.value
}

function onDocClick(e: MouseEvent) {
  if (!profileOpen.value) return
  const el = profileWrap.value
  if (!el) return
  if (!el.contains(e.target as Node)) profileOpen.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>
