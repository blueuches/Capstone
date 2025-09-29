<template>
  <div class="bg-gradient-to-b from-emerald-50 to-white min-h-screen flex flex-col">
    <!-- Sticky Top Bar -->
    <header
      class="sticky top-0 z-40 bg-emerald-600 text-white shadow-md"
      role="banner"
    >
      <div class="px-4 py-3 flex items-center gap-3">
        <button aria-label="Menu" class="p-2 rounded-full hover:bg-emerald-700/40">
          <!-- hamburger -->
          <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <!-- App title -->
        <h1 class="flex-1 text-lg font-bold text-center -ml-8">SeniorGo</h1>

        <router-link to="/senior/profile" aria-label="Profile" class="shrink-0">
          <img :src="avatarUrl" @error="useInlineAvatar"
               class="w-8 h-8 rounded-full border border-white/70 object-cover" alt="Profile"/>
        </router-link>
      </div>

      <!-- Search row -->
      <div class="px-4 pb-3">
        <label class="relative block">
          <span class="sr-only">Search</span>
          <svg class="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-emerald-900/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle><path d="m21 21-3.5-3.5"></path>
          </svg>
          <input
            type="search"
            placeholder="Search"
            class="w-full rounded-xl pl-10 pr-3 py-2 text-[15px] placeholder:opacity-70
                   bg-white/95 text-emerald-950 ring-1 ring-emerald-200 focus:ring-2 focus:ring-yellow-300 outline-none"
          />
        </label>
      </div>
    </header>

<!-- APPLY SHEET (bottom modal) -->
<transition name="fade">
  <div
    v-if="applyOpen"
    class="fixed inset-0 z-50"
    aria-modal="true" role="dialog"
    @keydown.esc="closeApply"
  >
    <!-- Dim background -->
    <div class="absolute inset-0 bg-black/40" @click="closeApply"></div>

    <!-- Sheet -->
    <div
      class="absolute inset-x-0 bottom-0
             bg-white rounded-t-2xl shadow-2xl
             ring-1 ring-emerald-100
             pt-3 pb-4"
      style="max-height: 80dvh;"
    >
      <!-- Grabber + Title -->
      <div class="flex items-center justify-center">
        <div class="h-1.5 w-12 rounded-full bg-emerald-200"></div>
      </div>

      <div class="px-5 mt-2 flex items-center justify-between">
        <h3 class="text-base font-semibold text-emerald-800">
          {{ step === 'pick' ? 'Choose a Program' : 'Requirements' }}
        </h3>
        <button class="text-emerald-700 text-sm" @click="closeApply">Close</button>
      </div>

      <!-- Body -->
      <div class="px-5 mt-3 overflow-y-auto" style="max-height: calc(80dvh - 90px);">
        <!-- STEP 1: Program picker -->
        <div v-if="step === 'pick'">
          <label class="relative block mb-3">
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-emerald-900/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle><path d="m21 21-3.5-3.5"></path>
            </svg>
            <input v-model="search"
                   type="search" placeholder="Search program"
                   class="w-full rounded-xl pl-10 pr-3 py-2 text-[15px]
                          bg-white ring-1 ring-emerald-200 focus:ring-2 focus:ring-yellow-300 outline-none"/>
          </label>

          <div v-if="loading" class="text-sm text-gray-600 py-4">Loading programs…</div>
          <div v-else-if="loadError" class="text-sm text-red-600 py-4">{{ loadError }}</div>

          <ul v-else class="space-y-2">
            <li v-for="p in filteredPrograms" :key="p.id">
              <button
                type="button"
                @click="chooseProgram(p)"
                class="w-full text-left p-3 rounded-xl ring-1 ring-emerald-100 bg-white
                       hover:bg-emerald-50/50 shadow-sm"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-semibold text-emerald-800">{{ p.name || p.title }}</p>
                    <p class="text-sm text-gray-600 line-clamp-2">{{ p.description }}</p>
                  </div>
                  <svg viewBox="0 0 24 24" class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </button>
            </li>
          </ul>
        </div>

        <!-- STEP 2: Requirements -->
        <div v-else>
          <div class="p-3 rounded-xl ring-1 ring-emerald-100 bg-emerald-50/40 mb-3">
            <p class="font-semibold text-emerald-800">{{ selected?.name || selected?.title }}</p>
            <p class="text-sm text-gray-700 mt-1">{{ selected?.description }}</p>
          </div>

          <h4 class="text-sm font-semibold text-emerald-800 mb-2">Requirements</h4>
          <ul class="list-disc list-inside space-y-1 text-[15px] text-gray-800">
            <li v-for="(r, i) in normalizedRequirements" :key="i">{{ r }}</li>
          </ul>
        </div>
      </div>

      <!-- Footer actions -->
      <div class="px-5 mt-3 flex items-center justify-between gap-3">
        <button v-if="step === 'reqs'" @click="step = 'pick'"
                class="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 font-medium">
          Back
        </button>
        <span v-else />
        <button
          :disabled="step !== 'reqs'"
          @click="goToForm()"
          class="ml-auto px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold
                 disabled:opacity-50 disabled:cursor-not-allowed">
          Fill up form
        </button>
      </div>
    </div>
  </div>
</transition>


    <!-- Scrollable content (bottom padding so it won't hide behind tabbar) -->
    <main class="flex-1 overflow-y-auto px-4 pb-[88px] pt-3">
      <!-- Welcome card -->
      <section class="mb-4">
        <div class="rounded-xl bg-emerald-100/70 border border-emerald-200 px-4 py-3">
          <p class="text-sm text-emerald-900">
            <span class="font-semibold">Maayong Buntag,</span>
            <span class="font-bold text-emerald-700"> Tatay Juan!</span>
          </p>
          <p class="text-xs text-emerald-900/80 mt-0.5">Senior Citizen ID: N/A</p>
        </div>
      </section>

      <!-- Quick Actions -->
<!-- Quick Actions -->
<section class="mb-5">
  <h2 class="text-sm font-semibold text-emerald-800 mb-2">Quick Actions</h2>
  <div class="grid grid-cols-3 gap-3">
    <template v-for="(item, i) in actions" :key="i">
      <!-- If it's the Apply tile, use a button -->
      <button
        v-if="item.kind === 'apply'"
        type="button"
        @click="openApply()"
        class="bg-white rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,.06)] ring-1 ring-emerald-100
               flex flex-col items-center justify-center gap-2 py-3 active:scale-[.99] transition"
      >
        <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl
                    bg-emerald-100 text-emerald-600">{{ item.icon }}</div>
        <span class="text-xs font-medium text-emerald-900">{{ item.label }}</span>
      </button>

      <!-- Others remain router-links -->
      <router-link
        v-else
        :to="item.to"
        class="bg-white rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,.06)] ring-1 ring-emerald-100
               flex flex-col items-center justify-center gap-2 py-3 active:scale-[.99] transition"
      >
        <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl
                    bg-emerald-100 text-emerald-600">{{ item.icon }}</div>
        <span class="text-xs font-medium text-emerald-900">{{ item.label }}</span>
      </router-link>
    </template>
  </div>
</section>


      <!-- Announcements -->
      <section>
        <h2 class="text-sm font-semibold text-emerald-800 mb-2">OSCA Announcements</h2>

        <article
          v-for="(a, i) in announcements" :key="i"
          class="bg-white rounded-xl ring-1 ring-emerald-100 shadow-[0_1px_6px_rgba(0,0,0,.05)]
                 p-3 mb-2.5"
        >
          <router-link :to="a.to" class="text-emerald-700 font-semibold text-[15px] leading-tight hover:underline line-clamp-1">
            {{ a.title }}
          </router-link>
          <p class="text-[13px] text-gray-600 mt-0.5 line-clamp-2">
            {{ a.subtitle }}
          </p>
          <p class="text-[12px] text-gray-500 mt-1">{{ a.meta }}</p>
        </article>
      </section>
    </main>

    <!-- Sticky Bottom Tabbar (safe-area aware) -->
    <nav
      class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70
             border-t border-emerald-100 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)]"
      role="navigation"
    >
      <ul class="flex items-center justify-around px-6">
                <li>
          <router-link
            to="/senior/notifications"
            class="relative w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"
            aria-label="Notifications"
          >
            <!-- bell -->
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 5 3 9H3c0-4 3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>
            </svg>
            <span
              v-if="notifCount"
              class="absolute -top-0.5 -right-0.5 text-[10px] leading-none bg-red-500 text-white px-1.5 py-0.5 rounded-full"
            >{{ notifCount }}</span>
          </router-link>
        </li>

        <li>
          <button
            class="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg"
            aria-label="Voice"
          >
            <!-- mic -->
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z"/>
              <path d="M19 11a7 7 0 0 1-14 0"/><path d="M12 18v4"/>
            </svg>
          </button>
        </li>

        <li>
          <router-link
            to="/senior/dashboard"
            class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"
            aria-label="Home"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>

          </router-link>
        </li>

      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase/client' 
import { computed, onMounted } from 'vue';


/* avatar with safe inline fallback */
const avatarUrl = ref('https://via.placeholder.com/60')
function useInlineAvatar() {
  avatarUrl.value =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
      <rect width="100%" height="100%" fill="#ecfdf5"/>
      <circle cx="30" cy="22" r="12" fill="#10b981" fill-opacity="0.5"/>
      <rect x="14" y="38" width="32" height="14" rx="7" fill="#10b981" fill-opacity="0.35"/>
    </svg>`)
}

/* Quick actions (3 per row) */
const actions = [
  { icon: '📊', label: 'My Application', to: '/senior/id' },
  { icon: '📅', label: 'Programs', to: '/senior/benefits' },
  { icon: '📄', label: 'Requirements', to: '/senior/health' },
  { icon: '📝', label: 'Apply', kind: 'apply' },
  { icon: '🏠︎', label: 'OSCA Location', to: '/senior/events' },
  { icon: '❓', label: 'Help', to: '/senior/help' },
]

/* ===== Apply flow state ===== */
const applyOpen = ref(false)
const step = ref('pick')            // was ref<'pick'|'reqs'>
const programs = ref([])
const loading = ref(false)
const loadError = ref(null)
const search = ref('')
const selected = ref(null)

const filteredPrograms = computed(() => {
  const q = (search.value || '').toLowerCase()
  return !q ? programs.value : programs.value.filter(p =>
    String(p.name || p.title || '').toLowerCase().includes(q) ||
    String(p.description || '').toLowerCase().includes(q)
  )
})

// avoid optional chaining in template: expose safe strings
const selectedName = computed(() =>
  (selected.value && (selected.value.name || selected.value.title)) || ''
)
const selectedDesc = computed(() =>
  (selected.value && selected.value.description) || ''
)

const normalizedRequirements = computed(() => {
  const req = selected.value && selected.value.requirements
  if (!req) return []
  if (Array.isArray(req)) return req
  try { const j = JSON.parse(req); return Array.isArray(j) ? j : [String(req)] }
  catch { return [String(req)] }
})

function openApply(){ applyOpen.value = true; step.value = 'pick'; if (!programs.value.length) fetchPrograms() }
function closeApply(){ applyOpen.value = false; selected.value = null }
async function fetchPrograms () {
  loading.value = true
  loadError.value = null
  try {
    const { data, error } = await supabase
      .from('Programs')
      .select('id, name, code')  // <- important
      .order('name', { ascending: true })
    if (error) throw error
    programs.value = data || []
  } catch (e) {
    console.error(e)
    loadError.value = e?.message || 'Failed to load programs.'
    programs.value = []
  } finally {
    loading.value = false
  }
}
function chooseProgram(p){ selected.value = p; step.value = 'reqs' }
function goToForm(){
  if (!selected.value) return
  // use router if you prefer
  window.location.assign(`/senior/form?programId=${encodeURIComponent(selected.value.id)}`)
}

/* Announcements list */
const announcements = [
  {
    title: 'Vaccination Drive',
    subtitle: 'Free flu shots at City Hall tomorrow',
    meta: 'April 10, 2025 • 9AM–3PM',
    to: '/senior/announcements/1'
  },
  {
    title: 'Pension Distribution',
    subtitle: 'Schedule for this month’s pension',
    meta: 'April 15, 2025 • Local treasury',
    to: '/senior/announcements/2'
  }
]

const notifCount = ref(2)
</script>

<style scoped>
/* Make long text nicely clipped without extra height */
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* iOS safe-area (older Safari fallbacks are handled by env()) */
@supports (padding: max(0px)) {
  nav { padding-bottom: max(env(safe-area-inset-bottom), 10px); }
}

.fade-enter-active,.fade-leave-active{ transition: opacity .18s ease }
.fade-enter-from,.fade-leave-to{ opacity:0 }

</style>
