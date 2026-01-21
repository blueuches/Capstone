<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
    <!-- Left: Burger + optional Search -->
    <div class="flex items-center gap-3 min-w-0">
      <button
        @click="$emit('toggle-sidebar')"
        class="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition flex items-center justify-center"
        aria-label="Toggle sidebar"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M10 7l-5 5 5 5M19 7l-5 5 5 5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
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
      <!-- Notifications -->
      <RouterLink
      :to="notificationTo"
        class="relative w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition flex items-center justify-center"
        aria-label="Notifications"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <path
            d="M9.5 19a2.5 2.5 0 0 0 5 0"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>

        <span
          v-if="notificationCount > 0"
          class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white"
        >
          {{ displayNotif }}
        </span>
      </RouterLink>

      <!-- Profile dropdown -->
      <div class="relative" ref="profileWrap">
        <button
          @click="toggleProfile"
          class="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition flex items-center justify-center"
          aria-label="Profile menu"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20 21a8 8 0 1 0-16 0"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-120 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div
            v-if="profileOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50"
          >
            <RouterLink
              :to="profileTo"
              class="block px-4 py-3 text-sm hover:bg-gray-50"
              @click="profileOpen = false"
            >
              Profile
            </RouterLink>
            <RouterLink
              :to="aboutTo"
              class="block px-4 py-3 text-sm hover:bg-gray-50"
              @click="profileOpen = false"
            >
              About
            </RouterLink>
            <p
              class="block px-4 py-3 text-sm text-red hover:bg-gray-50"
              @click="logout"
            >
              Logout
            </p>
          </div>
        </transition>
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

    notificationTo?: string
  profileTo?: string
  settingsTo?: string
  aboutTo?: string
}>()

const notificationTo = computed(() => props.notificationTo ?? '/barangay/notification')
const profileTo = computed(() => props.profileTo ?? '/barangay/profile')
const aboutTo = computed(() => props.aboutTo ?? '/barangay/about')


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
