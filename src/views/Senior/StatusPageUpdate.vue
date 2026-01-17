<template>
  <div class="min-h-screen bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

<main class="flex-1 px-4 pt-4 flex flex-col overflow-hidden">
  <!-- Breadcrumb -->
  <RouterLink
    to="/senior/dashboard/mystatus"
    class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3 shrink-0"
  >
    <component
      :is="Left"
      class="w-5 h-5 text-yellow-500"
    />
    <span class="text-gray-500">Dashboard</span>
    <span>/</span>
    <span class="text-gray-900">My Status</span>
    <span>/</span>
    <span class="text-gray-900">Update Channel</span>
  </RouterLink>

  <!-- MESSAGE AREA -->
  <div class="flex-1 overflow-y-auto flex flex-col justify-end pb-1">
    <MessageBodies
      v-if="messages.length"
      :messages="messages"
    />

    <div
      v-else
      class="text-center text-gray-400 my-10"
    >
      No Message Yet
    </div>
  </div>

  <!-- INPUT BAR (STAYS ABOVE BottomNav) -->
  <div
    class="shrink-0 flex items-center gap-2 bg-white p-3 rounded-xl shadow mb-10"
  >
    <!-- Mic -->
    <button
      class="w-10 h-10 flex items-center justify-center bg-[#42ad43] text-white rounded-full"
      @click="openMicModal"
    >
      <component :is="Mic" class="tile-icon w-7 h-7 text-white" />
    </button>

    <!-- Input -->
    <input
      v-model="newMessage"
      type="text"
      placeholder="Send a question, message, inquiry"
      class="flex-1 px-4 py-2 border rounded-full focus:outline-none"
    />

    <!-- Send -->
    <button
      class="w-10 h-10 flex items-center justify-center bg-[#42ad43] text-white rounded-full"
      @click="sendMessage"
    >
      ➤
    </button>
  </div>
</main>


    <!-- MIC MODAL -->
    <div
      v-if="showMicModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl w-72 text-center">
        <h3 class="font-semibold mb-2">Speak Now</h3>
        <p class="text-sm text-gray-500 mb-4">
          (Temporary placeholder)
        </p>

        <div class="flex gap-2 justify-center">
          <button class="px-3 py-2 bg-green-500 text-white rounded">
            Start
          </button>
          <button class="px-3 py-2 bg-gray-300 rounded">
            Stop
          </button>
        </div>

        <button
          class="mt-4 text-sm text-gray-500"
          @click="showMicModal = false"
        >
          Close
        </button>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import MessageBodies from '@/components/MessageBodies.vue'
import { useAuth } from '@/composables/useAuth'
import Left from '@/assets/icons/senior/left-arrow.svg'
import Mic from '@/assets/icons/senior/mic.svg'

const { profile } = useAuth()
const open = ref(false)

/* TEMPORARY MESSAGE DATA */
const messages = ref([
  {
    id: 1,
    sender: 'staff',
    name: 'OSCA Staff: Juan Dela Pena',
    text: 'Dili pwede 2018 na certificate?',
    date: 'January 1, 2026'
  },
  {
    id: 2,
    sender: 'senior',
    name: profile?.value?.first_name || 'You',
    text: 'Dili pwede 2018 na certificate?',
    date: 'January 1, 2026'
  }
])

const newMessage = ref('')
const showMicModal = ref(false)

function sendMessage() {
  if (!newMessage.value) return

  messages.value.push({
    id: Date.now(),
    sender: 'senior',
    name: profile?.value?.first_name || 'You',
    text: newMessage.value,
    date: 'Just now'
  })

  newMessage.value = ''
}

function openMicModal() {
  showMicModal.value = true
}
</script>

<style scoped>
/* same trick as before: force svg to follow text color */
.tile-icon :deep(path),
.tile-icon :deep(circle),
.tile-icon :deep(rect),
.tile-icon :deep(polygon),
.tile-icon :deep(line),
.tile-icon :deep(polyline) {
  fill: currentColor !important;
  stroke: currentColor !important;
}
</style>

