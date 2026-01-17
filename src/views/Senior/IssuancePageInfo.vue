<template>
  <div class="h-screen overflow-hidden bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

<main
  class="flex-1 px-4 pt-4 min-h-0 overflow-y-auto"
>

      <!-- Breadcrumb -->
      <RouterLink
        to="/senior/dashboard/applications"
        class="flex gap-2 text-sm font-semibold text-gray-700 mb-4"
      >
        <component :is="Left" class="w-5 h-5 text-yellow-500" />
        <span class="text-gray-500">Dashboard</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900">Applications</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900">Info</span>
      </RouterLink>

      <!-- Title -->
      <div class="mb-3">
        <h1 class="text-xl font-bold text-gray-900">OSCA ID Issuance</h1>
        <p class="text-sm text-gray-500">
          There are 4 types of application you can make. 
        </p>
      </div>

      <!-- Optional helper / note -->
      <div class="mb-4 rounded-3xl bg-white border border-gray-200 p-4">
        <p class="font-semibold text-gray-700 text-center">
          New Application
        </p>
      </div>

      <Block title="Description">
  <p class="text-sm text-gray-700 leading-relaxed">
    This service allows senior citizens to apply for the issuance of an OSCA ID Card
    or Purchase Booklet. These documents are issued free of charge and are required
    to avail of benefits and privileges mandated by law.
  </p>

  <div class="mt-3 text-xs text-gray-500 space-y-1">
    <p><strong>Office:</strong> CSWD – Office for Senior Citizens Affairs</p>
    <p><strong>Classification:</strong> Simple</p>
    <p><strong>Transaction Type:</strong> Government to Citizen (G2C)</p>
    <p><strong>Who may avail:</strong> Residents of Butuan City aged 60 years old and above</p>
  </div>
</Block>

<Block title="List of Requirements">
  <ul class="space-y-3">
    <li
      v-for="(req, index) in requirements"
      :key="index"
      class="border rounded-xl p-3"
    >
      <p class="text-sm font-semibold text-gray-800">
        {{ index + 1 }}. {{ req.name }}
      </p>

      <p class="text-xs text-gray-600 mt-1">
        {{ req.note }}
      </p>

      <div class="text-xs text-gray-500 mt-2">
        <p><strong>No. of copies:</strong> {{ req.copies }}</p>
        <p><strong>Where to secure:</strong> {{ req.source }}</p>
      </div>
    </li>
  </ul>
</Block>

<Block title="Process">
  <ol class="space-y-4">
    <li
      v-for="(item, index) in processSteps"
      :key="index"
      class="flex gap-3"
    >
      <div
        class="flex w-7 h-7 rounded-full bg-green-500 text-white text-xs font-bold"
      >
        {{ index + 1 }}
      </div>

      <div>
        <p class="text-sm font-semibold text-gray-800">
          {{ item.step }}
        </p>
        <p class="text-xs text-gray-500">
          Processing Time: {{ item.time }}
        </p>
        <p class="text-xs text-gray-500">
          Person Responsible: {{ item.person }}
        </p>
      </div>
    </li>
  </ol>

  <div class="mt-4 text-xs text-gray-600 font-semibold">
    Total Processing Time: 2 hours and 45 minutes
  </div>
</Block>


    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import ApplyItem from '@/components/Senior/ApplyItem.vue'
import Left from '@/assets/icons/senior/left-arrow.svg'
import Block from '@/components/Senior/Block.vue'

const open = ref(false)
const router = useRouter()

const requirements = ref([
  {
    name: 'Barangay Certification',
    note: 'Required for lost or damaged ID cards issued 3 months ago or earlier.',
    copies: '1 original',
    source: 'Barangay Hall'
  },
  {
    name: 'Proof of Birth Date',
    note: 'Birth Certificate, Marriage Certificate, valid government ID, PhilHealth MDR, or Voter’s Certification.',
    copies: '1 photocopy',
    source: 'PSA / Government Agencies'
  },
  {
    name: '1x1 ID Picture',
    note: 'White background. Scanned copies are not accepted.',
    copies: '2 pieces',
    source: 'Photo Studio'
  }
])

const processSteps = ref([
  {
    step: 'Sign in the client logbook',
    time: '1 minute',
    person: 'Guard on Duty'
  },
  {
    step: 'Submit required documents',
    time: '2 hours and 18 minutes',
    person: 'Administrative Assistant (OSCA)'
  },
  {
    step: 'Verify information and sign',
    time: '18 minutes',
    person: 'OSCA Clerk'
  },
  {
    step: 'Receive OSCA ID and provide feedback',
    time: '9 minutes',
    person: 'Administrative Assistant (OSCA)'
  }
])


</script>
