<template>
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <!-- Sidebar -->
    <Sidebar
      :collapsed="sidebarCollapsed"
      :navItems="oscaNavItems"
      footerText="OSCA - CSU © 2026"
    />

    <!-- Right content -->
    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <!-- Header + top row wrapper (measured) -->
      <div ref="headerWrap" class="shrink-0">
        <Header
          :showSearch="false"
          :notificationCount="3"
          @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
        />

        <!-- Top row: Back + Page Header -->
        <div ref="topRow" class="flex items-center justify-between mt-2 ml-3 mr-3 mb-4">
          <!-- Back -->
          <RouterLink
            to="/osca/barangays"
            class="inline-flex items-center gap-2
                   text-gray-700 hover:text-[#42ad43]
                   group shrink-0"
          >
            <span
              class="shrink-0 w-7 h-7 rounded-full bg-[#42ad43]
                     flex items-center justify-center text-white
                     transition group-hover:brightness-105"
              aria-hidden="true"
            >
              <svg
                class="w-4 h-4 -rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
            <span class="text-sm font-semibold">Back</span>
          </RouterLink>

          <!-- Page title -->
          <div class="min-w-0 text-right">
            <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
              Message Channel
            </h1>
            <p class="text-sm text-gray-600">
              Conversation with
              <span class="font-semibold">{{ barangayName }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Main: fixed height so the PAGE never scrolls; only messages scroll -->
      <main
        class="px-4 sm:px-8 pb-6 min-h-0"
        :style="{ height: `calc(100vh - ${headerHeight}px)` }"
      >
        <!-- Chat container -->
        <section
          class="h-full
                 bg-white rounded-2xl shadow-sm border border-gray-200
                 flex flex-col overflow-hidden"
        >
          <!-- Messages (ONLY scrollable area) -->
          <div ref="scrollEl" class="flex-1 overflow-y-auto p-4 sm:p-6">
            <MessageBodies :messages="messages" />
          </div>

          <!-- Composer (fixed at bottom of section) -->
          <div class="p-3 sm:p-4 bg-white">
            <div
              class="flex items-center gap-2 border-2 border-[#42ad43]
                     rounded-xl bg-white px-2 py-2"
            >
              <input
                v-model="draft"
                @keydown.enter.prevent="sendMessage()"
                type="text"
                class="flex-1 bg-transparent outline-none text-sm text-gray-800 px-2"
                placeholder="Send Update"
              />

              <button
                type="button"
                @click="sendMessage()"
                class="shrink-0 w-10 h-10 rounded-lg bg-[#42ad43]
                       flex items-center justify-center
                       hover:brightness-105 active:scale-[0.98] transition"
                aria-label="Send"
              >
                <span class="text-white font-black leading-none">></span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/Header.vue'
import MessageBodies from '@/components/MessageBodies.vue'
import { useAuth } from '@/composables/useAuth'

// ✅ CHANGE THIS to your actual supabase client path
import { supabase } from '@/supabase/client'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

const headerWrap = ref<HTMLElement | null>(null)
const topRow = ref<HTMLElement | null>(null)
const headerHeight = ref(0)

function computeHeights() {
  // whole block above <main> (Header + top row)
  const h = headerWrap.value?.offsetHeight ?? 0
  headerHeight.value = h
}

function onResize() {
  computeHeights()
}

onMounted(async () => {
  await nextTick()
  computeHeights()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

type Msg = {
  id: string
  sender: 'staff' | 'brgy'
  name: string
  text: string
  date: string
}

const route = useRoute()
const { profile } = useAuth()

const sidebarCollapsed = ref(false)
const barangayName = ref('') // will load from DB
const draft = ref('')
const scrollEl = ref<HTMLElement | null>(null)

const conversationId = ref<string | null>(null)
const messages = ref<Msg[]>([])
let realtimeSub: any = null

const myUserId = computed(() => (profile.value as any)?.id ?? null)

const staffName = computed(() => {
  const p = profile.value as any
  const full = [p?.first_name, p?.last_name].filter(Boolean).join(' ').trim()
  return full || 'OSCA Staff'
})

function scrollToBottom() {
  const el = scrollEl.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

function formatSentLabel(iso: string) {
  const d = new Date(iso)
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ]
  return `Sent at ${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`
}

async function loadBarangayName(barangayId: string) {
  const { data, error } = await supabase
    .from('barangays')
    .select('name')
    .eq('id', barangayId)
    .single()

  if (!error && data?.name) barangayName.value = data.name
  else barangayName.value = 'Barangay'
}

async function getOrCreateConversation(barangayId: string) {
  // Requires conversations.barangay_id column + unique index (recommended above)
  const { data: existing, error: findErr } = await supabase
    .from('conversations')
    .select('id')
    .eq('conversation_type', 'osca_barangay')
    .eq('barangay_id', barangayId)
    .maybeSingle()

  if (findErr) throw findErr
  if (existing?.id) return existing.id as string

  const { data: created, error: createErr } = await supabase
    .from('conversations')
    .insert({
      conversation_type: 'osca_barangay',
      barangay_id: barangayId
    })
    .select('id')
    .single()

  if (createErr) throw createErr
  return created.id as string
}

async function fetchMessages(convId: string) {
  // join sender profile to get name
  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      body,
      created_at,
      sender_id,
      profiles:sender_id ( first_name, last_name, role )
    `)
    .eq('conversation_id', convId)
    .order('created_at', { ascending: true })

  if (error) throw error

  const myId = myUserId.value
  messages.value = (data ?? []).map((m: any) => {
    const senderFull = [m?.profiles?.first_name, m?.profiles?.last_name].filter(Boolean).join(' ').trim()
    const displayName = senderFull || 'Staff'

    const isMine = myId && m.sender_id === myId

    return {
      id: m.id,
      // MessageBodies rule: 'staff' => LEFT yellow, else RIGHT green
      // so "mine" should be RIGHT green → use 'brgy' (any non-'staff')
      sender: isMine ? 'brgy' : 'staff',
      name: displayName,
      text: m.body,
      date: formatSentLabel(m.created_at)
    } as Msg
  })

  await nextTick()
  scrollToBottom()
}

function subscribeRealtime(convId: string) {
  // clean previous
  if (realtimeSub) supabase.removeChannel(realtimeSub)

  realtimeSub = supabase
    .channel(`osca_barangay_${convId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${convId}` },
      async () => {
        // simplest: refetch list (safe + keeps order + gets joined profile)
        await fetchMessages(convId)
      }
    )
    .subscribe()
}

async function sendMessage() {
  const text = draft.value.trim()
  if (!text) return
  if (!conversationId.value) return
  if (!myUserId.value) return

  // ✅ optimistic UI (shows instantly)
  const tempId = `tmp_${Date.now()}`
  const optimistic: Msg = {
    id: tempId,
    sender: 'brgy',               // right/green (current user)
    name: staffName.value,        // your name
    text,
    date: formatSentLabel(new Date().toISOString())
  }
  messages.value.push(optimistic)
  draft.value = ''
  await nextTick()
  scrollToBottom()

  // ✅ insert in DB
  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId.value,
    sender_id: myUserId.value,
    body: text
  })

  if (error) {
    console.error(error)
    // rollback optimistic message if insert fails
    messages.value = messages.value.filter(m => m.id !== tempId)
    return
  }

  // ✅ hard refresh list so it appears even if realtime doesn't fire
  await fetchMessages(conversationId.value)
}

async function boot() {
  const barangayId = route.params.barangayId as string
  if (!barangayId) return

  await loadBarangayName(barangayId)
  const convId = await getOrCreateConversation(barangayId)

  conversationId.value = convId
  await fetchMessages(convId)
  subscribeRealtime(convId)
}

onMounted(async () => {
  // wait profile to be ready (if it loads async)
  // if profile is already available, this runs immediately
  await boot()
})

watch(
  () => myUserId.value,
  async (v) => {
    if (v && !conversationId.value) {
      await boot()
    }
  }
)

onBeforeUnmount(() => {
  if (realtimeSub) supabase.removeChannel(realtimeSub)
})

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/osca/dashboard', icon: DashboardIcon },
  { label: 'Barangays', to: '/osca/barangays', icon: BarangaysIcon },
  { label: 'Application', to: '/osca/programs', icon: ApplicationIcon },
  { label: 'Activity', to: '/osca/activity', icon: ActivityIcon },
  { label: 'Announcement', to: '/osca/announcement', icon: AnnouncementIcon }
]
</script>
