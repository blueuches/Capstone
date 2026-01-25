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
        <span class="text-gray-900">Help</span>
      </RouterLink>

      <!-- Title -->
      <div class="mb-3">
        <h1 class="text-lg font-bold text-gray-900">Help & FAQs</h1>
        <p class="text-sm text-gray-600">
          Find answers quickly. You can also contact OSCA if you need more help.
        </p>
      </div>

      <!-- Quick Categories (optional but nice) -->
      <div class="flex gap-2 overflow-x-auto pb-1 mb-3">
        <button
          v-for="c in categories"
          :key="c"
          @click="activeCategory = c"
          class="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ring-1 shadow-sm"
          :class="activeCategory === c
            ? 'bg-yellow-50 text-yellow-800 ring-yellow-200'
            : 'bg-white text-gray-700 ring-gray-200 hover:bg-gray-50'"
        >
          {{ c }}
        </button>
      </div>

      <!-- FAQ List -->
      <div class="space-y-3">
        <div
          v-for="(f, i) in filteredFaqs"
          :key="i"
          class="bg-white rounded-2xl p-4 ring-1 ring-gray-200 shadow-sm"
        >
          <button class="w-full text-left" @click="toggleFaq(i)">
            <div class="flex items-start justify-between gap-3">
              <p class="font-semibold text-gray-900">
                {{ f.q }}
              </p>

              <span
                class="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200"
              >
                <svg
                  class="h-4 w-4 text-gray-700 transition-transform duration-200"
                  :class="f.open ? 'rotate-180' : ''"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </button>

          <transition name="fade">
            <div v-if="f.open" class="mt-2 text-sm text-gray-700 leading-relaxed">
              {{ f.a }}
            </div>
          </transition>

          <!-- Helpful actions -->
          <transition name="fade">
            <div v-if="f.open" class="mt-3 flex flex-wrap gap-2">
              <button
                class="px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 ring-1 ring-yellow-200 hover:bg-yellow-100"
                @click="markHelpful(i)"
              >
                Helpful
              </button>
              <button
                class="px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
                @click="copyText(f.q + ' — ' + f.a)"
              >
                Copy
              </button>
            </div>
          </transition>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredFaqs.length === 0"
          class="bg-white rounded-2xl p-5 ring-1 ring-gray-200 shadow-sm text-center"
        >
          <p class="font-semibold text-gray-900">No results found</p>
        </div>
      </div>

      <!-- Contact Card -->
      <div class="mt-4 bg-yellow-50 rounded-2xl p-4 ring-1 ring-yellow-200 shadow-sm">
        <p class="font-bold text-gray-900">Need more help?</p>
        <p class="text-sm text-gray-700 mt-1">
          Call OSCA Butuan Hotline:
          <span class="font-bold text-gray-900">{{ hotline }}</span>
        </p>

        <div class="mt-3 flex flex-wrap gap-2">
          <a
            :href="`tel:${hotline}`"
            class="px-4 py-2 rounded-xl text-sm font-semibold bg-white text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50 shadow-sm"
          >
            Call now
          </a>

          <button
            class="px-4 py-2 rounded-xl text-sm font-semibold bg-yellow-100 text-yellow-900 ring-1 ring-yellow-200 hover:bg-yellow-200 shadow-sm"
            @click="copyText(hotline)"
          >
            Copy number
          </button>
        </div>

      </div>

      <!-- Optional: Safety note / disclaimer -->
      <p class="mt-3 text-xs text-gray-500">
        Note: Office hours and requirements may change. If unsure, contact OSCA to confirm.
      </p>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import { useAuth } from '@/composables/useAuth'
import Left from '@/assets/icons/senior/left-arrow.svg'

const { profile } = useAuth()
const open = ref(false)

// Hotline (edit later or move to env/config)
const hotline = '0999-123-4567'

// Categories (optional, but improves UX)
const categories = ['All', 'Applying', 'OSCA Programs', 'Registration', 'App Use']
const activeCategory = ref<(typeof categories)[number]>('All')

// FAQ data (feel free to expand)
type Faq = { q: string; a: string; open: boolean; category: (typeof categories)[number] }

const faqs = ref<Faq[]>([
  {
    q: 'How do I apply for a social pension?',
    a: 'Go to your Barangay OSCA focal person and submit the required documents. If you are unsure what to bring, call OSCA for the updated list of requirements.',
    open: false,
    category: 'Pension'
  },
  {
    q: 'Who qualifies for medical assistance?',
    a: 'Registered senior citizens may qualify depending on the program guidelines and assessment. Coordinate with your barangay/OSCA staff to confirm eligibility and needed documents.',
    open: false,
    category: 'Medical'
  },
  {
    q: 'How do I register as a senior citizen in the system?',
    a: 'Prepare your valid ID and supporting documents, then proceed to your barangay or OSCA office for verification and registration.',
    open: false,
    category: 'Registration'
  },
  {
    q: 'I forgot my password. What should I do?',
    a: 'Use the “Forgot password” option on the login screen (if available). If not yet enabled, contact the staff/admin for account recovery.',
    open: false,
    category: 'App Use'
  }
])

const q = ref('')

const filteredFaqs = computed(() => {
  const keyword = q.value.trim().toLowerCase()
  return faqs.value.filter((f) => {
    const matchesKeyword = !keyword || f.q.toLowerCase().includes(keyword)
    const matchesCategory = activeCategory.value === 'All' || f.category === activeCategory.value
    return matchesKeyword && matchesCategory
  })
})

function toggleFaq(indexInFiltered: number) {
  const item = filteredFaqs.value[indexInFiltered]
  if (!item) return
  item.open = !item.open
}

function markHelpful(_i: number) {
  // placeholder: you can later log this to Supabase
  // e.g. supabase.from('faq_feedback').insert(...)
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // fallback: do nothing
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
