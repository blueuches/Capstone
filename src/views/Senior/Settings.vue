<template>
  <div class="min-h-screen bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <main class="flex-1 px-4 pt-4 overflow-y-auto">
      <!-- Back -->
      <RouterLink
        to="/senior/dashboard"
        class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4"
      >
        <component :is="Left" class="w-5 h-5 text-yellow-500" />
        <span class="text-gray-600">Back</span>
      </RouterLink>

      <!-- Title -->
      <div class="mb-3">
        <h1 class="text-lg font-bold text-gray-900">Settings</h1>
        <p class="text-sm text-gray-600">Manage your preferences and account.</p>
      </div>

      <!-- SETTINGS GROUP: Accessibility -->
      <section class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 overflow-hidden mb-4">
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-xs font-bold tracking-widest text-gray-700">ACCESSIBILITY</p>
        </div>

        <div class="px-4 py-4 space-y-3">
          <!-- Font size -->
          <button
            type="button"
            class="w-full rounded-xl p-4 ring-1 ring-gray-200 hover:bg-gray-50 text-left"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="font-semibold text-gray-900">Text Size</p>
                <p class="text-sm text-gray-600 mt-0.5">Adjust font size for better readability.</p>
              </div>
              <span
                class="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-800 ring-1 ring-yellow-200"
              >
                Normal
              </span>
            </div>
          </button>

          <!-- High contrast -->
          <div class="w-full rounded-xl p-4 ring-1 ring-gray-200">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="font-semibold text-gray-900">High Contrast</p>
                <p class="text-sm text-gray-600 mt-0.5">Increase contrast for visibility.</p>
              </div>

              <!-- toggle (placeholder) -->
              <button
                type="button"
                class="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-200 ring-1 ring-gray-300"
                aria-label="Toggle high contrast"
              >
                <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow translate-x-1"></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- SETTINGS GROUP: Notifications -->
      <section class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 overflow-hidden mb-4">
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-xs font-bold tracking-widest text-gray-700">NOTIFICATIONS</p>
        </div>

        <div class="px-4 py-4 space-y-3">
          <!-- Push -->
          <div class="w-full rounded-xl p-4 ring-1 ring-gray-200">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="font-semibold text-gray-900">Announcements</p>
                <p class="text-sm text-gray-600 mt-0.5">Receive updates and reminders.</p>
              </div>

              <!-- toggle (placeholder) -->
              <button
                type="button"
                class="relative inline-flex h-7 w-12 items-center rounded-full bg-yellow-400 ring-1 ring-yellow-200"
                aria-label="Toggle announcements"
              >
                <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow translate-x-6"></span>
              </button>
            </div>
          </div>

          <!-- SMS -->
          <div class="w-full rounded-xl p-4 ring-1 ring-gray-200">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="font-semibold text-gray-900">SMS Alerts</p>
                <p class="text-sm text-gray-600 mt-0.5">Get text alerts for important updates.</p>
              </div>

              <!-- toggle (placeholder) -->
              <button
                type="button"
                class="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-200 ring-1 ring-gray-300"
                aria-label="Toggle SMS alerts"
              >
                <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow translate-x-1"></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- SETTINGS GROUP: Account -->
      <section class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 overflow-hidden mb-4">
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-xs font-bold tracking-widest text-gray-700">ACCOUNT</p>
        </div>

        <div class="px-2 py-2">
          <button
            type="button"
            class="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50"
          >
            <div class="flex items-center gap-3">
              <span class="h-9 w-9 rounded-xl bg-yellow-50 ring-1 ring-yellow-200 flex items-center justify-center">
                <!-- lock icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 11c1.105 0 2 .895 2 2v2a2 2 0 1 1-4 0v-2c0-1.105.895-2 2-2z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 11V8a5 5 0 0 1 10 0v3" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 11h12v9H6z" />
                </svg>
              </span>

              <div class="text-left">
                <p class="font-semibold text-gray-900">Change Password</p>
                <p class="text-sm text-gray-600">Update your account security.</p>
              </div>
            </div>

            <span class="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>

          <button
            type="button"
            class="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50"
          >
            <div class="flex items-center gap-3">
              <span class="h-9 w-9 rounded-xl bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center">
                <!-- info icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
                </svg>
              </span>

              <div class="text-left">
                <p class="font-semibold text-gray-900">About</p>
                <p class="text-sm text-gray-600">App version and information.</p>
              </div>
            </div>

            <span class="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
      </section>

      <!-- Danger zone -->
      <section class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-xs font-bold tracking-widest text-gray-700">MORE</p>
        </div>

        <div class="px-4 py-4">
          <button
            type="button"
            class="w-full px-4 py-3 rounded-2xl bg-gray-900 text-white font-semibold shadow hover:bg-black"
          >
            Log Out
          </button>

          <p class="mt-3 text-xs text-gray-500 text-center">
            Tip: Update your phone number for alerts.
          </p>
        </div>
      </section>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import Left from '@/assets/icons/senior/left-arrow.svg'

const open = ref(false)
</script>
