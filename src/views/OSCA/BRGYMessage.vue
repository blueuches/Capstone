<template>
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <!-- Sidebar -->
    <Sidebar
      :collapsed="sidebarCollapsed"
      :navItems="oscaNavItems"
      footerText="OSCA - CSU © 2026"
    />

    <!-- Right content -->
    <div class="flex-1 min-w-0 flex flex-col">
      <Header
        :showSearch="false"
        :notificationCount="3"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
      />

<!-- Top row: Back + Page Header -->
      <div class="flex items-center justify-between mt-2 ml-3 mr-3 mb-4">
        <!-- Back -->
        <RouterLink
          to="/osca/barangays"
          class="inline-flex items-center gap-2
                 text-gray-700 hover:text-[#42ad43]
                 group shrink-0"
        >
          <span
            class="shrink-0 w-7 h-7 rounded-full bg-[#42ad43]
                   flex items-center justify-center text-white
                   transition group-hover:brightness-105"
            aria-hidden="true"
          >
            <svg
              class="w-4 h-4 -rotate-180"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
          <span class="text-sm font-semibold">Back</span>
        </RouterLink>

        <!-- Page title -->
        <div class="min-w-0 text-right">
          <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
            Message Channel
          </h1>
          <p class="text-sm text-gray-600">
            Conversation with
            <span class="font-semibold">{{ barangayName }}</span>
          </p>
        </div>
      </div>

      <!-- Main (only chat scrolls) -->
      <main class="flex-1 overflow-hidden">
        <div class="h-full px-4 sm:px-8 py-6">
          <!-- Chat container -->
          <section
            class="h-full
                   bg-white rounded-2xl shadow-sm border border-gray-200
                   flex flex-col overflow-hidden"
          >
            <!-- Messages -->
            <div ref="scrollEl" class="flex-1 overflow-y-auto p-4 sm:p-6">
              <MessageBodies :messages="messages" />
            </div>

            <!-- Composer -->
            <div class="p-3 sm:p-4 bg-white">
              <div
                class="flex items-center gap-2 border-2 border-[#42ad43]
                       rounded-xl bg-white px-2 py-2"
              >
                <input
                  v-model="draft"
                  @keydown.enter.prevent="sendMessage()"
                  type="text"
                  class="flex-1 bg-transparent outline-none text-sm text-gray-800 px-2"
                  placeholder="Send Update"
                />

                <button
                  type="button"
                  @click="sendMessage()"
                  class="shrink-0 w-10 h-10 rounded-lg bg-[#42ad43]
                         flex items-center justify-center
                         hover:brightness-105 active:scale-[0.98] transition"
                  aria-label="Send"
                >
                  <span class="text-white font-black leading-none">></span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/Header.vue'
import MessageBodies from '@/components/MessageBodies.vue'
import { useAuth } from '@/composables/useAuth'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

const { profile } = useAuth()

const sidebarCollapsed = ref(false)

const staffName = computed(() => {
  const p = profile.value as any
  const full = [p?.first_name, p?.last_name].filter(Boolean).join(' ').trim()
  return full || 'Lando Norris'
})

// Placeholder (replace later with selected barangay/recipient from route params)
const barangayName = ref('Barangay San Vicente')

// IMPORTANT: MessageBodies.vue aligns:
// - msg.sender === 'staff'  => left (yellow)
// - else                    => right (green)
type Msg = {
  id: string
  sender: 'staff' | 'brgy'
  name: string
  text: string
  date: string
}

const messages = ref<Msg[]>([
  {
    id: 'm1',
    sender: 'staff',
    name: 'Staff Maria',
    text: "That’s all?",
    date: 'Sent at January 16 2026'
  },
  {
    id: 'm2',
    sender: 'brgy',
    name: 'Staff Lando',
    text: 'Please gather your seniors',
    date: 'Sent at January 16 2026'
  }
])

const draft = ref('')
const scrollEl = ref<HTMLElement | null>(null)

function scrollToBottom() {
  const el = scrollEl.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

function nowLabel() {
  // Simple placeholder formatting (swap with real timestamps later)
  const d = new Date()
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ]
  const label = `Sent at ${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`
  return label
}

async function sendMessage() {
  const text = draft.value.trim()
  if (!text) return

  messages.value.push({
    id: `m_${Date.now()}`,
    sender: 'brgy', // right side (green) in MessageBodies.vue
    name: staffName.value,
    text,
    date: nowLabel()
  })

  draft.value = ''

  await nextTick()
  scrollToBottom()
}

onMounted(() => {
  scrollToBottom()
})

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/osca/dashboard', icon: DashboardIcon },
  { label: 'Barangays', to: '/osca/barangays', icon: BarangaysIcon },
  { label: 'Application', to: '/osca/programs', icon: ApplicationIcon },
  { label: 'Activity', to: '/osca/activity', icon: ActivityIcon },
  { label: 'Announcement', to: '/osca/announcement', icon: AnnouncementIcon }
]
</script>
