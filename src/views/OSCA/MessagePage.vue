<template>
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <!-- Sidebar -->
    <Sidebar
      :collapsed="sidebarCollapsed"
      :navItems="oscaNavItems"
      footerText="OSCA - CSU © 2026"
    />

    <!-- Right content -->
    <div class="flex-1 min-w-0 flex flex-col">
      <Header
        :showSearch="false"
        :notificationCount="3"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
      />

<!-- Top row: Back + Page Header -->
      <div class="flex items-center justify-between mt-2 ml-3 mr-3 mb-4">
        <!-- Back -->
        <RouterLink
          :to="`/osca/applicant/${applicationId}`"
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
            Update Channel
          </h1>
          <p class="text-sm text-gray-600">
            Conversation with
            <span class="font-semibold">{{ seniorFullName || 'Unknown' }}</span>
          </p>
        </div>
      </div>

      <!-- Main (only chat scrolls) -->
      <main class="flex-1 overflow-hidden">
        <div class="h-full px-4 sm:px-8 py-6">
          <!-- Chat container -->
          <section
            class="h-full
                   bg-white rounded-2xl shadow-sm border border-gray-200
                   flex flex-col overflow-hidden"
          >
            <!-- Messages -->
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
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase/client'
import Sidebar, { type NavItem } from '@/components/Staff/Sidebar.vue'
import Header from '@/components/Staff/Header.vue'
import MessageBodies from '@/components/MessageBodies.vue'
import { useAuth } from '@/composables/useAuth'

import DashboardIcon from '/public/staff/dashboard.png'
import BarangaysIcon from '/public/staff/barangays.png'
import ApplicationIcon from '/public/staff/application.png'
import ActivityIcon from '/public/staff/activity.png'
import AnnouncementIcon from '/public/staff/announcement.png'

const { profile } = useAuth()
const route = useRoute()

const sidebarCollapsed = ref(false)

// ROUTE: /osca/applicant/message/:applicationId
const applicationId = computed(() => String(route.params.applicationId || ''))

const staffName = computed(() => {
  const p = profile.value as any
  const full = [p?.first_name, p?.last_name].filter(Boolean).join(' ').trim()
  return full || 'Lando Norris'
})

// MessageBodies.vue aligns:
// - msg.sender === 'staff'  => left (yellow)
// - else                    => right (green)
//
// We will interpret "right side (green)" as "ME (current OSCA staff)".
// So:
// - if sender_id === currentUserId => sender = 'brgy' (right/green)
// - else => sender = 'staff' (left/yellow)
type Msg = {
  id: string
  sender: 'staff' | 'brgy'
  name: string
  text: string
  date: string
}

const messages = ref<Msg[]>([])
const draft = ref('')
const scrollEl = ref<HTMLElement | null>(null)

// Header display
const seniorFullName = ref('')

// Conversation context
const conversationId = ref<string>('')

// For creating participants
const seniorId = ref<string>('')

// ----------------- helpers -----------------
function scrollToBottom() {
  const el = scrollEl.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

function formatSentLabel(iso: string) {
  // Display like: "Sent at January 16 2026"
  const d = new Date(iso)
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ]
  if (isNaN(d.getTime())) return `Sent at ${iso}`
  return `Sent at ${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`
}

function myUserId() {
  // profiles.id is auth.users.id
  return (profile.value as any)?.id || ''
}

// ----------------- DB fetchers -----------------
async function fetchApplicationSenior() {
  if (!applicationId.value) return

  const { data, error } = await supabase
    .from('applications')
    .select(`
      id,
      senior_id,
      senior:profiles!applications_senior_id_fkey(first_name, last_name)
    `)
    .eq('id', applicationId.value)
    .single()

  if (error) {
    console.error('fetchApplicationSenior error:', error)
    seniorFullName.value = ''
    seniorId.value = ''
    return
  }

  seniorId.value = (data as any)?.senior_id || ''
  const fn = (data as any)?.senior?.first_name || ''
  const ln = (data as any)?.senior?.last_name || ''
  seniorFullName.value = [fn, ln].filter(Boolean).join(' ').trim()
}

async function ensureConversation() {
  if (!applicationId.value) return

  // Try find existing conversation for this application
  const { data, error } = await supabase
    .from('conversations')
    .select('id, conversation_type, application_id')
    .eq('application_id', applicationId.value)
    .eq('conversation_type', 'senior_osca')
    .maybeSingle()

  if (error) {
    console.error('ensureConversation find error:', error)
    return
  }

  if (data?.id) {
    conversationId.value = data.id
    return
  }

  // Create one if none
  const { data: created, error: createErr } = await supabase
    .from('conversations')
    .insert({
      conversation_type: 'senior_osca',
      application_id: applicationId.value,
    })
    .select('id')
    .single()

  if (createErr) {
    console.error('ensureConversation create error:', createErr)
    return
  }

  conversationId.value = created.id

  // Add participants (senior + current osca)
  // Note: your schema uses composite PK, so we "upsert" to avoid duplicates.
  const me = myUserId()
  const partRows = [
    ...(seniorId.value ? [{ conversation_id: conversationId.value, user_id: seniorId.value }] : []),
    ...(me ? [{ conversation_id: conversationId.value, user_id: me }] : []),
  ]

  if (partRows.length) {
    const { error: partErr } = await supabase
      .from('conversation_participants')
      .upsert(partRows, { onConflict: 'conversation_id,user_id' })
    if (partErr) console.error('participants upsert error:', partErr)
  }
}

async function fetchMessages() {
  if (!conversationId.value) {
    messages.value = []
    return
  }

  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      body,
      created_at,
      sender_id,
      sender:profiles!messages_sender_id_fkey(first_name, last_name)
    `)
    .eq('conversation_id', conversationId.value)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('fetchMessages error:', error)
    messages.value = []
    return
  }

  const me = myUserId()

  messages.value = (data || []).map((m: any) => {
    const fn = m?.sender?.first_name || ''
    const ln = m?.sender?.last_name || ''
    const name = [fn, ln].filter(Boolean).join(' ').trim() || 'Unknown'

    const isMe = me && m.sender_id === me

    return {
      id: m.id,
      sender: isMe ? 'brgy' : 'staff', // right = me (green), left = other (yellow)
      name,
      text: m.body,
      date: formatSentLabel(m.created_at),
    } as Msg
  })
}

// ----------------- send -----------------
async function sendMessage() {
  const text = draft.value.trim()
  if (!text) return
  if (!conversationId.value) return

  const me = myUserId()
  if (!me) return

  // ✅ claim-on-reply: assign reviewer if NULL
  const { error: claimErr } = await supabase
    .from('applications')
    .update({ assigned_osca_id: me })
    .eq('id', applicationId.value)
    .is('assigned_osca_id', null)

  if (claimErr) console.error('claim application error:', claimErr)

  // ensure osca is participant
  await supabase
    .from('conversation_participants')
    .upsert([{ conversation_id: conversationId.value, user_id: me }], {
      onConflict: 'conversation_id,user_id',
    })

  // insert message
  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId.value,
    sender_id: me,
    body: text,
  })

  if (error) {
    console.error('sendMessage insert error:', error)
    return
  }

  draft.value = ''
  await fetchMessages()
  await nextTick()
  scrollToBottom()
}

// ----------------- lifecycle -----------------
onMounted(async () => {
  await fetchApplicationSenior()
  await ensureConversation()
  await fetchMessages()
  await nextTick()
  scrollToBottom()
})

// Nav items
const oscaNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/osca/dashboard', icon: DashboardIcon },
  { label: 'Barangays', to: '/osca/barangays', icon: BarangaysIcon },
  { label: 'Application', to: '/osca/programs', icon: ApplicationIcon },
  { label: 'Activity', to: '/osca/activity', icon: ActivityIcon },
  { label: 'Announcement', to: '/osca/announcement', icon: AnnouncementIcon },
]
</script>

