<template>
  <div class="bg-gradient-to-b from-emerald-50 to-white h-dvh flex flex-col overflow-hidden">
    <!-- Sticky Top Bar -->
    <SeniorHeader @toggle-sidebar="toggleSidebar" />

    <transition name="fade">
      <div
        v-if="sidebarOpen"
        class="absolute top-0 left-0 w-56 h-screen bg-white text-emerald-800 z-50 shadow-xl"
      >
        <div class="p-4 border-b border-emerald-100 flex justify-between items-center">
          <h2 class="font-semibold text-emerald-700">More</h2>
          <button @click="sidebarOpen = false" class="text-emerald-700">✕</button>
        </div>
        <nav class="p-4 flex flex-col space-y-3">
          <router-link to="#" class="text-emerald-700">Settings</router-link>
          <router-link to="#" class="text-emerald-700">About</router-link>
          <router-link to="#" class="text-emerald-700">Complain</router-link>
          <router-link
            to="/logout"
            @click="sidebarOpen = false"
            class="text-left text-red-600 font-medium"
            >Log out</router-link
          >
        </nav>
      </div>
    </transition>

    <!-- APPLY SHEET (bottom modal) -->
    <transition name="fade">
      <div
        v-if="applyOpen"
        class="fixed inset-0 z-50"
        aria-modal="true"
        role="dialog"
        @keydown.esc="closeApply"
      >
        <!-- Dim background -->
        <div class="absolute inset-0 bg-black/40" @click="closeApply"></div>

        <!-- Sheet -->
        <div
          class="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl ring-1 ring-emerald-100 pt-3 pb-4"
          style="max-height: 80dvh"
        >
          <!-- Grabber + Title -->
          <div class="flex items-center justify-center">
            <div class="h-1.5 w-12 rounded-full bg-emerald-200"></div>
          </div>

          <div class="px-5 mt-2 flex items-center justify-between">
            <h3 class="text-base font-semibold text-emerald-800">
              {{ step === 'pick' ? 'Choose a Program' : 'Programs' }}
            </h3>
            <button class="text-emerald-700 text-sm" @click="closeApply">Close</button>
          </div>

          <!-- Body -->
          <!-- Body -->
          <div class="px-5 mt-3 overflow-y-auto" style="max-height: calc(80dvh - 90px)">
            <label class="relative block mb-3">
              <svg
                class="absolute left-3 top-2.5 h-5 w-5 text-emerald-900/70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-3.5-3.5"></path>
              </svg>
              <input
                v-model="search"
                type="search"
                placeholder="Search program"
                class="w-full rounded-xl pl-10 pr-3 py-2 text-[15px] bg-white ring-1 ring-emerald-200 focus:ring-2 focus:ring-yellow-300 outline-none"
              />
            </label>

            <div v-if="loading" class="text-sm text-gray-600 py-4">Loading programs…</div>
            <div v-else-if="loadError" class="text-sm text-red-600 py-4">{{ loadError }}</div>

            <ul v-else class="space-y-2">
              <li v-for="p in filteredPrograms" :key="p.id">
                <button
                  type="button"
                  @click="goToApply(p.id)"
                  class="w-full text-left p-3 rounded-xl ring-1 ring-emerald-100 bg-white hover:bg-emerald-50/50 shadow-sm"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-semibold text-emerald-800">{{ p.name || p.title }}</p>
                      <p class="text-sm text-gray-600 line-clamp-2">{{ p.description }}</p>
                    </div>
                    <svg
                      viewBox="0 0 24 24"
                      class="w-5 h-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>

    <!-- Scrollable content (bottom padding so it won't hide behind tabbar) -->
    <main class="flex-1 px-4 pb-[88px] pt-3 flex flex-col overflow-hidden space-y-4">
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
      <section class="mb-5">
        <h2 class="text-sm font-semibold text-emerald-800 mb-2">Quick Actions</h2>
        <div class="grid grid-cols-3 gap-3">
          <template v-for="(item, i) in actions" :key="i">
            <!-- If it's the Apply tile, use a button -->
            <button
              v-if="item.kind === 'apply'"
              type="button"
              @click="openApply()"
              class="bg-white rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,.06)] ring-1 ring-emerald-100 flex flex-col items-center justify-center gap-2 py-3 active:scale-[.99] transition"
            >
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-emerald-100 text-emerald-600"
              >
                {{ item.icon }}
              </div>
              <span class="text-xs font-medium text-emerald-900">{{ item.label }}</span>
            </button>

            <!-- Others remain router-links -->
            <router-link
              v-else
              :to="item.to"
              class="bg-white rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,.06)] ring-1 ring-emerald-100 flex flex-col items-center justify-center gap-2 py-3 active:scale-[.99] transition"
            >
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-emerald-100 text-emerald-600"
              >
                {{ item.icon }}
              </div>
              <span class="text-xs font-medium text-emerald-900">{{ item.label }}</span>
            </router-link>
          </template>
        </div>
      </section>

      <!-- Announcements -->
      <section class="flex-1 flex flex-col min-h-0">
        <h2 class="text-sm font-semibold text-emerald-800 mb-2 flex-none">OSCA Announcements</h2>

        <!-- Scrollable list -->
        <div class="flex-1 overflow-y-auto pr-1 sm:pr-2 relative rounded-lg">
          <article
            v-for="(a, i) in announcements"
            :key="i"
            class="bg-white rounded-xl ring-1 ring-emerald-100 shadow-sm p-3 mb-2.5"
          >
            <router-link
              :to="a.to"
              class="text-emerald-700 font-semibold text-[15px] leading-tight hover:underline line-clamp-1"
            >
              {{ a.title }}
            </router-link>
            <p class="text-[13px] text-gray-600 mt-0.5 line-clamp-2">
              {{ a.subtitle }}
            </p>
            <p class="text-[12px] text-gray-500 mt-1">{{ a.meta }}</p>
          </article>

          <!-- subtle fade at bottom -->
          <div
            class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"
          ></div>
        </div>
      </section>
    </main>

    <!-- Sticky Bottom Tabbar (safe-area aware) -->
    <SeniorNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/composables/useAuth'
import SeniorHeader from '@/components/SeniorHeader.vue'
import SeniorNav from '@/components/SeniorNav.vue'

const router = useRouter()
const { user } = useAuth()

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

/* hamburger */
const sidebarOpen = ref(false)
function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }

/* Quick actions (3 per row) */
const actions = [
  { icon: '📊', label: 'My Application', to: '/senior/application' },
  { icon: '📄', label: 'My Requirements', to: '/senior/requirements' },
  { icon: '📝', label: 'Apply', kind: 'apply' },
  { icon: '📅', label: 'Programs', to: '/senior/programs' },
  { icon: '🏠︎', label: 'OSCA Location', to: '/senior/location' },
  { icon: '❓', label: 'Help', to: '/senior/help' },
]

/* voice */
const micActive = ref(false)
function toggleMic() {
  micActive.value = true
  setTimeout(() => { micActive.value = false }, 3000)
}

/* ===== Apply flow state ===== */
const applyOpen = ref(false)
const programs = ref([])
const loading = ref(false)
const loadError = ref(null)
const search = ref('')

function openApply() {
  applyOpen.value = true
  if (!programs.value.length) fetchPrograms()
}
function closeApply() { applyOpen.value = false }

async function fetchPrograms() {
  loading.value = true
  loadError.value = null
  try {
    const { data, error } = await supabase
      .from('Programs')
      .select('id, name')
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

const filteredPrograms = computed(() => {
  const q = (search.value || '').toLowerCase()
  if (!q) return programs.value
  return programs.value.filter(p => String(p.name || '').toLowerCase().includes(q))
})

async function goToApply(programId) {
  const { data: variants, error } = await supabase
    .from('ProgramVariants')
    .select('id')
    .eq('program_id', programId)
    .eq('is_active', true)

  applyOpen.value = false

  if (error) {
    console.error(error)
    router.push({ name: 'apply-request', params: { programId } })
    return
  }

  if (variants && variants.length > 0) {
    router.push({ name: 'variant-picker', params: { programId } })
  } else {
    router.push({ name: 'apply-request', params: { programId } })
  }
}

/* ===== Real OSCA Announcements for this senior (via Notifications join) ===== */
const announcements = ref([])
let notifChannel = null

function summarize(text = '', n = 120) {
  const t = String(text).replace(/\s+/g, ' ').trim()
  return t.length > n ? t.slice(0, n - 1) + '…' : t
}
function fmtDate(iso) {
  try {
    return new Date(iso || Date.now()).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
    })
  } catch { return '' }
}

async function loadAnnouncements() {
  if (!user?.value?.id) return
  const { data, error } = await supabase
    .from('Notifications')
    .select(`
      id,
      created_at,
      Announcements (
        id,
        title,
        content,
        created_at
      )
    `)
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('loadAnnouncements error:', error)
    announcements.value = []
    return
  }

  announcements.value = (data ?? []).map(row => {
    const ann = row.Announcements ?? {}
    return {
      title: ann.title || 'Announcement',
      subtitle: summarize(ann.content || ''),
      meta: fmtDate(ann.created_at || row.created_at),
    }
  })
}

function subscribeAnnouncements() {
  if (!user?.value?.id) return
  notifChannel = supabase
    .channel(`notif-senior-${user.value.id}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'Notifications', filter: `user_id=eq.${user.value.id}` },
      async (payload) => {
        const { data, error } = await supabase
          .from('Notifications')
          .select(`
            id,
            created_at,
            Announcements ( id, title, content, created_at )
          `)
          .eq('id', payload.new.id)
          .single()
        if (error || !data) return
        const ann = data.Announcements ?? {}
        announcements.value.unshift({
          title: ann.title || 'Announcement',
          subtitle: summarize(ann.content || ''),
          meta: fmtDate(ann.created_at || data.created_at),
        })
      }
    )
    .subscribe()
}

onMounted(() => { loadAnnouncements(); subscribeAnnouncements() })
onBeforeUnmount(() => { if (notifChannel) supabase.removeChannel(notifChannel) })

const notifCount = ref(2)
</script>


<style scoped>
/* Make long text nicely clipped without extra height */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* iOS safe-area (older Safari fallbacks are handled by env()) */
@supports (padding: max(0px)) {
  nav {
    padding-bottom: max(env(safe-area-inset-bottom), 10px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* smooth scroll area within announcements */
section .overflow-y-auto {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

/* nice scrollbar */
section .overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
section .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(16, 185, 129, 0.4);
  border-radius: 6px;
}
section .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(16, 185, 129, 0.7);
}

/*voice */
@keyframes pulseGlow {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6);
  }
  50% {
    box-shadow: 0 0 15px 5px rgba(16, 185, 129, 0.6);
  }
}

.animate-pulse-glow {
  animation: pulseGlow 1.5s infinite ease-in-out;
}
</style>
