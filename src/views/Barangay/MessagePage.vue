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
      <!-- ✅ Measured header wrapper (same as OSCA) -->
      <div ref="headerWrap" class="shrink-0">
        <Header
          :showSearch="false"
          :notificationCount="3"
          @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
        />

        <!-- Top row: Page Header -->
        <div class="flex items-center justify-end mt-2 ml-3 mr-3 mb-4">
          <div class="min-w-0 text-right">
            <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
              Message Channel
            </h1>
            <p class="text-sm text-gray-600">
              Conversation with
              <span class="font-semibold">{{ otherPartyName }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- ✅ Main: fixed height so PAGE never scrolls; only messages scroll -->
      <main
        class="px-4 sm:px-8 pb-6 min-h-0"
        :style="{ height: `calc(100vh - ${headerHeight}px)` }"
      >
        <section
          class="h-full
                 bg-white rounded-2xl shadow-sm border border-gray-200
                 flex flex-col overflow-hidden"
        >
          <!-- Messages (ONLY scrollable area) -->
          <div ref="scrollEl" class="flex-1 overflow-y-auto p-4 sm:p-6">
            <MessageBodies :messages="messages" />
          </div>

          <!-- Composer -->
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
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/BRGY/Header.vue'
import MessageBodies from '@/components/MessageBodies.vue'
import { useAuth } from '@/composables/useAuth'
import { supabase } from '@/supabase/client'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

// IMPORTANT: MessageBodies.vue aligns:
// - msg.sender === 'staff'  => left (yellow)
// - else                    => right (green)
type Msg = {
  id: string
  sender: 'staff' | 'brgy'
  name: string
  text: string
  date: string
}

const { profile } = useAuth()
const sidebarCollapsed = ref(false)

const otherPartyName = ref('OSCA')
const draft = ref('')
const scrollEl = ref<HTMLElement | null>(null)

const headerWrap = ref<HTMLElement | null>(null)
const headerHeight = ref(0)

const messages = ref<Msg[]>([])
const conversationId = ref<string | null>(null)
let realtimeSub: any = null

const myUserId = computed(() => (profile.value as any)?.id ?? null)
const myBarangayId = computed(() => (profile.value as any)?.barangay_id ?? null)

const staffName = computed(() => {
  const p = profile.value as any
  const full = [p?.first_name, p?.last_name].filter(Boolean).join(' ').trim()
  return full || 'BRGY Staff'
})

function computeHeights() {
  headerHeight.value = headerWrap.value?.offsetHeight ?? 0
}
function onResize() {
  computeHeights()
}

function scrollToBottom() {
  const el = scrollEl.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

function formatSentLabel(iso: string) {
  const d = new Date(iso)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return `Sent at ${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`
}

async function getOrCreateConversation(barangayId: string) {
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
    const senderFull = [m?.profiles?.first_name, m?.profiles?.last_name]
      .filter(Boolean)
      .join(' ')
      .trim()

    const displayName = senderFull || 'Staff'
    const isMine = myId && m.sender_id === myId

    return {
      id: m.id,
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
  if (realtimeSub) supabase.removeChannel(realtimeSub)

  realtimeSub = supabase
    .channel(`brgy_osca_${convId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${convId}` },
      async () => {
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

  // optimistic
  const tempId = `tmp_${Date.now()}`
  messages.value.push({
    id: tempId,
    sender: 'brgy',
    name: staffName.value,
    text,
    date: formatSentLabel(new Date().toISOString())
  })

  draft.value = ''
  await nextTick()
  scrollToBottom()

  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId.value,
    sender_id: myUserId.value,
    body: text
  })

  if (error) {
    console.error(error)
    messages.value = messages.value.filter(m => m.id !== tempId)
    return
  }

  await fetchMessages(conversationId.value)
}

async function boot() {
  const barangayId = myBarangayId.value
  if (!barangayId) return

  const convId = await getOrCreateConversation(barangayId)
  conversationId.value = convId

  await fetchMessages(convId)
  subscribeRealtime(convId)
}

onMounted(async () => {
  await nextTick()
  computeHeights()
  window.addEventListener('resize', onResize)
  await boot()
})

watch(
  () => myBarangayId.value,
  async (v) => {
    if (v && !conversationId.value) await boot()
  }
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  if (realtimeSub) supabase.removeChannel(realtimeSub)
})

const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/barangay/dashboard', icon: DashboardIcon },
  { label: 'List', to: '/barangay/management', icon: BarangaysIcon },
  { label: 'Seniors', to: '/barangay/users', icon: ApplicationIcon },
  { label: 'Message', to: '/barangay/message', icon: ActivityIcon },
  { label: 'Announcement', to: '/barangay/announcement', icon: AnnouncementIcon }
]
</script>
