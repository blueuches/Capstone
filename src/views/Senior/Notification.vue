<template>
<div class="h-screen overflow-hidden bg-gray-50 font-poppins flex flex-col">

    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

<main class="flex-1 px-4 pt-4 flex flex-col min-h-0">

      <!-- Top Bar -->
<div class="flex items-center mb-4">
  <!-- Title -->
  <div class="flex-1 pr-3">
    <h1 class="text-lg font-bold text-gray-900 leading-tight">
      Notifications
    </h1>
    <p class="text-xs text-gray-500">
      <span class="font-semibold text-gray-700">3</span> unread • last updated just now
    </p>
  </div>

  <!-- Close -->
  <RouterLink
    to="/senior/dashboard"
    class="ml-auto inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white ring-1 ring-gray-200 shadow-sm hover:bg-gray-50"
    aria-label="Close"
  >
    <component :is="Right" class="h-5 w-5 text-yellow-500" />
  </RouterLink>
</div>


      <!-- Filter / Tabs (placeholder) -->
      <div class="flex gap-2 overflow-x-auto pb-1 mb-3">
        <button
          v-for="t in tabs"
          :key="t"
          type="button"
          class="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ring-1 shadow-sm"
          :class="t === 'All'
            ? 'bg-yellow-50 text-yellow-800 ring-yellow-200'
            : 'bg-white text-gray-700 ring-gray-200 hover:bg-gray-50'"
        >
          {{ t }}
        </button>
      </div>

      <!-- Notification List (placeholder) -->
<div class="flex-1 overflow-y-auto space-y-4 pb-24 overscroll-contain">

<ul class="space-y-3">
        <!-- Unread Card -->
        <li class="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-yellow-200">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="inline-flex h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
                <p class="font-bold text-gray-900">[Announcement Title]</p>
              </div>
              <p class="text-sm text-gray-700 mt-1 whitespace-pre-line">
                [Short message preview goes here. This is a placeholder for the announcement content.]
              </p>
              <p class="text-xs text-gray-500 mt-2">
                [2 hours ago] <span class="text-gray-400">• from [OSCA/Barangay]</span>
              </p>
            </div>

            <button
              type="button"
              class="shrink-0 text-xs px-3 py-2 rounded-xl bg-gray-50 text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100"
            >
              Mark read
            </button>
          </div>

          <div class="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              class="text-xs px-3 py-2 rounded-xl bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
            >
              View details
            </button>
            <button
              type="button"
              class="text-xs px-3 py-2 rounded-xl bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
            >
              Copy
            </button>
          </div>
        </li>

        <!-- Read Card -->
        <li class="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-200">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="font-bold text-gray-900">[Another Update]</p>
              <p class="text-sm text-gray-700 mt-1">
                [This is a placeholder. Read notifications look calmer with a normal border.]
              </p>
              <p class="text-xs text-gray-500 mt-2">
                [Yesterday] <span class="text-gray-400">• from [System]</span>
              </p>
            </div>

            <span
              class="shrink-0 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 ring-1 ring-gray-200"
            >
              Read
            </span>
          </div>
        </li>
      </ul>

      <!-- Empty State (placeholder) -->
      <div class="mt-4 bg-white rounded-2xl p-5 ring-1 ring-gray-200 shadow-sm">
        <div class="flex items-start gap-3">
          <div class="h-10 w-10 rounded-xl bg-yellow-50 ring-1 ring-yellow-200 flex items-center justify-center">
            <!-- Bell icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-yellow-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 0 1-6 0m6 0H9"
              />
            </svg>
          </div>

          <div class="min-w-0">
            <p class="font-bold text-gray-900">No notifications</p>
            <p class="text-sm text-gray-600 mt-1">
              [If there are no announcements yet, show this friendly message.]
            </p>
            <button
              type="button"
              class="mt-3 text-sm font-semibold px-4 py-2 rounded-xl bg-yellow-50 text-yellow-800 ring-1 ring-yellow-200 hover:bg-yellow-100"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <p class="mt-4 text-xs text-gray-500">
        Tip: Unread notifications are highlighted in <span class="font-semibold">yellow</span>.
      </p>
       </div>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import Right from '@/assets/icons/senior/right-arrow.svg'

const open = ref(false)

// purely UI placeholders
const tabs = ['All', 'Updates', 'From OSCA', 'From BRGY']
</script>
