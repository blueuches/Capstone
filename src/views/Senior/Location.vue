<template>
  <div class="min-h-screen bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <main class="flex-1 px-4 pt-4 overflow-y-auto">
      <!-- Breadcrumb -->
      <RouterLink
        to="/senior/dashboard"
        class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4"
      >
        <component :is="Left" class="w-5 h-5 text-yellow-500" />
        <span class="text-gray-500">Dashboard</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900">Location</span>
      </RouterLink>

      <!-- Title + hint -->
      <div class="mb-3">
        <h1 class="text-lg font-bold text-gray-900">OSCA Location</h1>
        <p class="text-sm text-gray-600">
          View the office on the map and check directions before you go.
        </p>
      </div>

      <!-- Map Card -->
      <section class="bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-200">
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-50">
              <!-- Pin icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 11c.828 0 1.5-.672 1.5-1.5S12.828 8 12 8s-1.5.672-1.5 1.5S11.172 11 12 11z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s8-7.373 8-11.5A8 8 0 1 0 4 9.5C4 13.627 12 21 12 21z" />
              </svg>
            </span>
            <p class="font-semibold text-gray-900">OSCA Butuan Main Office</p>
          </div>

          <!-- Optional external open button (keeps it simple) -->
          <a
            :href="googleMapsLink"
            target="_blank"
            rel="noreferrer"
            class="text-xs font-semibold text-yellow-700 hover:text-yellow-800"
          >
            Open in Maps
          </a>
        </div>

        <iframe
          class="w-full h-64 sm:h-72"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1591.986654080655!2d125.54294177733093!3d8.949163046404502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3301eaa4a0f3a8a1%3A0xe8d0b64bb98c1cc7!2sOSCA%20Butuan%20City%20Hall!5e0!3m2!1sen!2sph!4v1697711299704!5m2!1sen!2sph"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

      <!-- Quick Info Cards -->
      <section class="mt-4 grid gap-3">
        <!-- Address / Hours -->
        <div class="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-200">
          <div class="flex items-start gap-3">
            <span class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50">
              <!-- Building icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h1m-1 3h1m-1 3h1m4-6h1m-1 3h1m-1 3h1" />
              </svg>
            </span>

            <div class="min-w-0">
              <h2 class="text-base font-bold text-gray-900">Office Details</h2>
              <p class="text-sm text-gray-700 mt-1">
                J.P. Rosales Avenue, Butuan City
              </p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  Mon–Fri
                </span>
                <span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  8:00 AM – 5:00 PM
                </span>
              </div>

              <!-- Optional note -->
              <p class="text-xs text-gray-500 mt-3">
                Tip: Go earlier in the day to avoid longer queues.
              </p>
            </div>
          </div>
        </div>

        <!-- How to Get There -->
        <div class="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-200">
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-50">
              <!-- Route icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A2 2 0 0 1 2 15.382V6.618a2 2 0 0 1 1.553-1.954L9 2m0 18l6-3m-6 3V2m6 15l5.447 2.724A2 2 0 0 0 22 17.382V8.618a2 2 0 0 0-1.553-1.954L15 5m0 12V5m0 12l-6 3" />
              </svg>
            </span>
            <h2 class="text-base font-bold text-gray-900">How to Get There</h2>
          </div>

          <ul class="space-y-2 text-sm text-gray-700">
            <li class="flex gap-2">
              <span class="mt-1 h-2 w-2 rounded-full bg-yellow-500 shrink-0"></span>
              <p>
                Ride a multicab —
                <span class="font-semibold text-gray-900">J.P. Rosales line</span>
                → Stop at DPWH or INC Church
              </p>
            </li>
            <li class="flex gap-2">
              <span class="mt-1 h-2 w-2 rounded-full bg-yellow-500 shrink-0"></span>
              <p>
                Take a tricycle  → OSCA Office near DICT building
                <span class="text-gray-500">(around ₱15 fare)</span>
              </p>
            </li>
          </ul>

          <!-- Extra helpful section (optional but nice) -->
          <div class="mt-4 rounded-xl bg-gray-50 p-3 ring-1 ring-gray-200">
            <p class="text-xs font-semibold text-gray-700 mb-1">What to bring (quick reminder)</p>
            <p class="text-xs text-gray-600">
              Valid ID, any required documents, and a pen (for signing forms).
            </p>
          </div>
        </div>
      </section>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import { useAuth } from '@/composables/useAuth'
import Left from '@/assets/icons/senior/left-arrow.svg'

const { profile } = useAuth()
const open = ref(false)

// Optional: external maps link (same place as the iframe)
const googleMapsLink = computed(() => {
  // You can replace with a dynamic location later
  return 'https://www.google.com/maps?q=OSCA+Butuan+City+Hall'
})
</script>
