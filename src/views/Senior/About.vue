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
  <div class="mb-4">
    <h1 class="text-lg font-bold text-gray-900">About</h1>
    <p class="text-sm text-gray-600">
      Learn more about SeniorGo and the Office for Senior Citizens Affairs (OSCA).
    </p>
  </div>

    <!-- OSCA -->
  <section class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-4">
    <h2 class="text-base font-bold text-gray-900 mb-2">
      What is OSCA?
    </h2>

    <p class="text-sm text-gray-700 leading-relaxed">
      The <strong>Office for Senior Citizens Affairs (OSCA)</strong> is a government office
      dedicated to protecting the rights, welfare, and well-being of senior citizens.
    </p>

    <p class="text-sm text-gray-700 leading-relaxed mt-2">
      OSCA assists seniors in accessing benefits, programs, and services provided by
      the government, including social pension, medical assistance, and discounts
      mandated by law.
    </p>

    <div class="mt-3 p-3 rounded-xl bg-gray-50 ring-1 ring-gray-200">
      <p class="text-sm font-semibold text-gray-900 mb-1">OSCA’s Mission</p>
      <p class="text-sm text-gray-700 leading-relaxed">
        To promote dignity, security, and active participation of senior citizens in
        society by ensuring accessible services, proper representation, and continuous
        support.
      </p>
    </div>
  </section>

  <p class="mt-4 text-xs text-gray-500 text-center">
    SeniorGo is designed to support—not replace—personal assistance from OSCA and
    barangay offices.
  </p>

  <!-- SeniorGo -->
  <section class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-4 mb-4">
    <h2 class="text-base font-bold text-gray-900 mb-2">What is SeniorGo?</h2>

    <p class="text-sm text-gray-700 leading-relaxed">
      <strong>SeniorGo</strong> is a digital service platform designed to make government
      services for senior citizens easier, faster, and more accessible.
      It helps seniors receive announcements, submit requests, and stay updated
      without the need for frequent physical visits.
    </p>

    <p class="text-sm text-gray-700 leading-relaxed mt-2">
      The goal of SeniorGo is to support independent living, reduce long waiting times,
      and improve communication between senior citizens, barangays, and OSCA offices.
    </p>

    <div class="mt-3 p-3 rounded-xl bg-yellow-50 ring-1 ring-yellow-200">
      <p class="text-xs text-gray-700">
        SeniorGo was developed by student developers in collaboration with local
        government partners to support senior citizen welfare through technology.
      </p>
    </div>
  </section>

  <!-- Developers -->
  <section class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-4 mb-4">
    <h2 class="text-base font-bold text-gray-900 mb-2">About the Developers</h2>

    <p class="text-sm text-gray-700 leading-relaxed">
      SeniorGo was created by student developers as part of an academic and community-based
      project. The system was designed with seniors in mind—focusing on simplicity,
      readability, and ease of use.
    </p>
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

</script>
