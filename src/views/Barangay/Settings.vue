<!-- views/Staff/OSCA/Settings.vue -->
<template>
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <!-- Sidebar (fixed height, not scrollable) -->
    <Sidebar
      :collapsed="sidebarCollapsed"
      :navItems="oscaNavItems"
      footerText="OSCA - CSU © 2026"
    />

    <div class="flex-1 min-w-0 flex flex-col">
      <Header
        :showSearch="false"
        :notificationCount="3"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
      />

      <main class="flex-1 overflow-y-auto">
        <div class="px-4 sm:px-8 py-6">
          <div class="max-w-3xl mx-auto">
            <!-- Title -->
            <div class="text-center mb-6">
              <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900">Settings</h1>
              <p class="text-sm text-gray-500 mt-1">
                Personalize your workspace and send feedback to the SeniorGo team.
              </p>
            </div>

            <!-- Settings container -->
            <section class="bg-white rounded-2xl shadow-sm border-4 overflow-hidden"
                     :style="{ borderColor: brand }">
              <div class="p-5 sm:p-6 space-y-4">
                <!-- Quick buttons (prototype-like) -->
                <div class="space-y-3">
                  <button
                    type="button"
                    class="w-full rounded-xl py-3 text-white font-extrabold text-lg
                           hover:brightness-105 active:brightness-95 transition shadow-sm"
                    :style="{ backgroundColor: brand }"
                    @click="openColor = !openColor"
                  >
                    Change color
                  </button>

                  <button
                    type="button"
                    class="w-full rounded-xl py-3 text-white font-extrabold text-lg
                           hover:brightness-105 active:brightness-95 transition shadow-sm"
                    :style="{ backgroundColor: brand }"
                    @click="openFont = !openFont"
                  >
                    Change font size
                  </button>

                  <button
                    type="button"
                    class="w-full rounded-xl py-3 text-white font-extrabold text-lg
                           hover:brightness-105 active:brightness-95 transition shadow-sm"
                    :style="{ backgroundColor: brand }"
                    @click="openAccessibility = !openAccessibility"
                  >
                    Accessibility
                  </button>

                  <button
                    type="button"
                    class="w-full rounded-xl py-3 text-white font-extrabold text-lg
                           hover:brightness-105 active:brightness-95 transition shadow-sm"
                    :style="{ backgroundColor: brand }"
                    @click="openFeedback = !openFeedback"
                  >
                    Send notes to admin and developers
                  </button>
                </div>

                <!-- Panels -->
                <div class="pt-2 space-y-4">
                  <!-- Color -->
                  <div v-if="openColor" class="rounded-xl border border-gray-200 p-4">
                    <div class="flex items-start justify-between gap-4">
                      <div>
                        <h3 class="font-extrabold text-gray-800">Theme color</h3>
                        <p class="text-sm text-gray-500 mt-1">
                          Pick a theme color for your interface (demo only).
                        </p>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="w-8 h-8 rounded-lg border" :style="{ backgroundColor: themeColor }" />
                        <input
                          v-model="themeColor"
                          type="color"
                          class="w-10 h-10 p-0 border-0 bg-transparent"
                          aria-label="Pick theme color"
                        />
                      </div>
                    </div>

                    <div class="mt-4 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        class="px-4 py-2 rounded-lg font-bold border border-gray-300 text-gray-700
                               hover:bg-gray-100 active:bg-gray-200 transition"
                        @click="resetThemeColor"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        class="px-4 py-2 rounded-lg font-extrabold text-white
                               hover:brightness-105 active:brightness-95 transition"
                        :style="{ backgroundColor: brand }"
                        @click="saveThemeColor"
                      >
                        Save (stub)
                      </button>
                    </div>
                  </div>

                  <!-- Font size -->
                  <div v-if="openFont" class="rounded-xl border border-gray-200 p-4">
                    <h3 class="font-extrabold text-gray-800">Font size</h3>
                    <p class="text-sm text-gray-500 mt-1">
                      Adjust text size for readability (demo only).
                    </p>

                    <div class="mt-4">
                      <input
                        v-model.number="fontScale"
                        type="range"
                        min="0.9"
                        max="1.2"
                        step="0.05"
                        class="w-full"
                      />
                      <div class="mt-2 flex items-center justify-between text-sm text-gray-600">
                        <span>Small</span>
                        <span class="font-bold">{{ fontScale.toFixed(2) }}x</span>
                        <span>Large</span>
                      </div>

                      <div class="mt-4 rounded-lg bg-gray-50 border border-gray-200 p-3"
                           :style="{ fontSize: `${Math.round(14 * fontScale)}px` }">
                        Preview text: “SeniorGo helps OSCA staff manage announcements and applications.”
                      </div>
                    </div>

                    <div class="mt-4 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        class="px-4 py-2 rounded-lg font-bold border border-gray-300 text-gray-700
                               hover:bg-gray-100 active:bg-gray-200 transition"
                        @click="resetFontScale"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        class="px-4 py-2 rounded-lg font-extrabold text-white
                               hover:brightness-105 active:brightness-95 transition"
                        :style="{ backgroundColor: brand }"
                        @click="saveFontScale"
                      >
                        Save (stub)
                      </button>
                    </div>
                  </div>

                  <!-- Accessibility -->
                  <div v-if="openAccessibility" class="rounded-xl border border-gray-200 p-4">
                    <h3 class="font-extrabold text-gray-800">Accessibility</h3>
                    <p class="text-sm text-gray-500 mt-1">
                      Helpful toggles for better clarity (demo only).
                    </p>

                    <div class="mt-4 space-y-3">
                      <label class="flex items-center justify-between gap-4">
                        <div>
                          <p class="font-semibold text-gray-800">Reduce motion</p>
                          <p class="text-xs text-gray-500">Minimize hover animations and transitions.</p>
                        </div>
                        <input v-model="reduceMotion" type="checkbox" class="w-5 h-5" />
                      </label>

                      <label class="flex items-center justify-between gap-4">
                        <div>
                          <p class="font-semibold text-gray-800">High contrast</p>
                          <p class="text-xs text-gray-500">Increase contrast for readability.</p>
                        </div>
                        <input v-model="highContrast" type="checkbox" class="w-5 h-5" />
                      </label>

                      <label class="flex items-center justify-between gap-4">
                        <div>
                          <p class="font-semibold text-gray-800">Show helper hints</p>
                          <p class="text-xs text-gray-500">Display small hints and tooltips.</p>
                        </div>
                        <input v-model="showHints" type="checkbox" class="w-5 h-5" />
                      </label>
                    </div>

                    <div class="mt-4 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        class="px-4 py-2 rounded-lg font-extrabold text-white
                               hover:brightness-105 active:brightness-95 transition"
                        :style="{ backgroundColor: brand }"
                        @click="saveAccessibility"
                      >
                        Save (stub)
                      </button>
                    </div>
                  </div>

                  <!-- Feedback -->
                  <div v-if="openFeedback" class="rounded-xl border border-gray-200 p-4">
                    <h3 class="font-extrabold text-gray-800">Send feedback</h3>
                    <p class="text-sm text-gray-500 mt-1">
                      Share notes or report issues to the admin/developers (not wired yet).
                    </p>

                    <div class="mt-4 space-y-3">
                      <input
                        v-model="feedbackSubject"
                        type="text"
                        placeholder="Subject"
                        class="w-full h-11 rounded-lg border border-gray-300 px-3 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#42ad43]/40"
                      />
                      <textarea
                        v-model="feedbackMessage"
                        placeholder="Write your message…"
                        rows="5"
                        class="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm resize-none
                               focus:outline-none focus:ring-2 focus:ring-[#42ad43]/40"
                      />
                    </div>

                    <div class="mt-4 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        class="px-4 py-2 rounded-lg font-bold border border-gray-300 text-gray-700
                               hover:bg-gray-100 active:bg-gray-200 transition"
                        @click="clearFeedback"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        class="px-4 py-2 rounded-lg font-extrabold text-white
                               hover:brightness-105 active:brightness-95 transition"
                        :style="{ backgroundColor: brand }"
                        @click="sendFeedback"
                        :disabled="!feedbackSubject.trim() || !feedbackMessage.trim()"
                      >
                        Send (stub)
                      </button>
                    </div>
                  </div>
                </div>

                <p class="text-xs text-gray-500 pt-2">
                  Note: All settings here are UI-only for now. Later you can store preferences in a table
                  (e.g., <span class="font-semibold">user_preferences</span>) or localStorage.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/BRGY/Header.vue'
import { useAuth } from '@/composables/useAuth'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

const brand = '#42ad43'
const { profile } = useAuth()
const sidebarCollapsed = ref(false)

const staffName = computed(() => {
  const p = profile.value as any
  const full = [p?.first_name, p?.last_name].filter(Boolean).join(' ').trim()
  return full || 'Lando Norris'
})

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/osca/dashboard', icon: DashboardIcon },
  { label: 'Barangays', to: '/osca/barangays', icon: BarangaysIcon },
  { label: 'Application', to: '/osca/programs', icon: ApplicationIcon },
  { label: 'Activity', to: '/osca/activity', icon: ActivityIcon },
  { label: 'Announcement', to: '/osca/announcement', icon: AnnouncementIcon }
]

/** Panels toggles */
const openColor = ref(false)
const openFont = ref(false)
const openAccessibility = ref(false)
const openFeedback = ref(false)

/** Demo settings state */
const themeColor = ref('#42ad43')
const fontScale = ref(1.0)

const reduceMotion = ref(false)
const highContrast = ref(false)
const showHints = ref(true)

/** Feedback */
const feedbackSubject = ref('')
const feedbackMessage = ref('')

function resetThemeColor() {
  themeColor.value = '#42ad43'
}
function saveThemeColor() {
  console.log('Save themeColor (stub):', themeColor.value)
}

function resetFontScale() {
  fontScale.value = 1.0
}
function saveFontScale() {
  console.log('Save fontScale (stub):', fontScale.value)
}

function saveAccessibility() {
  console.log('Save accessibility (stub):', {
    reduceMotion: reduceMotion.value,
    highContrast: highContrast.value,
    showHints: showHints.value
  })
}

function clearFeedback() {
  feedbackSubject.value = ''
  feedbackMessage.value = ''
}
function sendFeedback() {
  console.log('Send feedback (stub):', {
    subject: feedbackSubject.value,
    message: feedbackMessage.value,
    from: staffName.value
  })
}
</script>
