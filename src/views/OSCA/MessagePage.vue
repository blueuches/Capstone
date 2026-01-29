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
      <!-- ✅ Measured header wrapper (locks Header + top row; only chat area scrolls) -->
      <div ref="headerWrap" class="shrink-0">
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
      </div>

      <!-- ✅ Main: fixed height so PAGE never scrolls; only messages scroll -->
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

              <!-- 🎤 Mic (voice message) -->
              <button
                type="button"
                @click="openMicModal"
                class="shrink-0 w-10 h-10 rounded-lg border-2 border-[#42ad43]
                       flex items-center justify-center
                       hover:bg-[#42ad43]/10 active:scale-[0.98] transition"
                aria-label="Voice message"
              >
                <svg class="w-5 h-5 text-[#42ad43]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z"/>
                  <path d="M19 11a7 7 0 0 1-14 0"/>
                  <path d="M12 18v3"/>
                  <path d="M8 21h8"/>
                </svg>
              </button>

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

      <!-- MIC MODAL (same behavior as StatusPageUpdate.vue) -->
      <div v-if="showMicModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-xl w-72 text-center">
          <h3 class="font-semibold mb-2">Speak Now</h3>

          <p v-if="recordError" class="text-xs text-red-600 mb-3">
            {{ recordError }}
          </p>

          <p v-else class="text-sm text-gray-500 mb-4">
            {{ recording ? 'Recording… tap Stop when done.' : recordedBlob ? 'Recorded! You can send it.' : 'Tap Start to record.' }}
          </p>

          <div class="flex gap-2 justify-center">
            <button
              class="px-3 py-2 bg-green-500 text-white rounded disabled:opacity-50"
              :disabled="recording"
              @click="startRecording"
            >
              Start
            </button>

            <button
              class="px-3 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              :disabled="!recording"
              @click="stopRecording"
            >
              Stop
            </button>
          </div>

          <p v-if="voiceStatus === 'sending'" class="text-xs text-gray-500 mt-3">Sending…</p>
          <p v-if="voiceStatus === 'error'" class="text-xs text-red-600 mt-3">{{ voiceError }}</p>

          <button
            class="mt-3 w-full px-3 py-2 bg-[#42ad43] text-white rounded disabled:opacity-50"
            :disabled="!recordedBlob || voiceSending"
            @click="sendVoiceMessage"
          >
            {{ voiceSending ? 'Sending…' : 'Send Voice' }}
          </button>

          <button class="mt-4 text-sm text-gray-500" @click="closeMicModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
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
  return full || 'OSCA Staff'
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

// For creating participants + notifications
const seniorId = ref<string>('')

// ✅ Height measurement so only the chat area scrolls
const headerWrap = ref<HTMLElement | null>(null)
const headerHeight = ref(0)

function computeHeights() {
  headerHeight.value = headerWrap.value?.offsetHeight ?? 0
}
function onResize() {
  computeHeights()
}

// ----------------- helpers -----------------
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
  if (isNaN(d.getTime())) return `Sent at ${iso}`
  return `Sent at ${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`
}

function myUserId() {
  // profiles.id is auth.users.id
  return (profile.value as any)?.id || ''
}

async function getAuthedUserId(): Promise<string | null> {
  const id = myUserId()
  if (id) return id
  const { data, error } = await supabase.auth.getUser()
  if (error) return null
  return data.user?.id ?? null
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
  const me = await getAuthedUserId()
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

  const me = await getAuthedUserId()

  messages.value = (data || []).map((m: any) => {
    const fn = m?.sender?.first_name || ''
    const ln = m?.sender?.last_name || ''
    const name = [fn, ln].filter(Boolean).join(' ').trim() || 'Unknown'

    const isMe = me && m.sender_id === me
    const bodyText =
      typeof m.body === 'string' ? m.body : m.body ? JSON.stringify(m.body) : ''

    return {
      id: m.id,
      sender: isMe ? 'brgy' : 'staff',
      name: isMe ? staffName.value : name,
      text: bodyText,
      date: formatSentLabel(m.created_at),
    } as Msg
  })
}

// ----------------- send text -----------------
async function sendMessage() {
  const text = draft.value.trim()
  if (!text) return
  if (!conversationId.value) return

  const me = await getAuthedUserId()
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

  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId.value,
    sender_id: me,
    body: text,
  })

  if (error) {
    console.error('sendMessage insert error:', error)
    return
  }

  // optional: notify senior
  if (seniorId.value) {
    await supabase.from('notifications').insert({
      user_id: seniorId.value,
      type: 'message',
      title: 'New message from OSCA',
      body: text,
      link: { applicationId: applicationId.value }
    })
  }

  draft.value = ''
  await fetchMessages()
  await nextTick()
  scrollToBottom()
}

// ----------------- VOICE (copied from StatusPageUpdate.vue pattern) -----------------
const showMicModal = ref(false)
const recorder = ref<MediaRecorder | null>(null)
const recording = ref(false)
const chunks = ref<BlobPart[]>([])
const recordedBlob = ref<Blob | null>(null)
const recordError = ref<string | null>(null)
const recordStartedAt = ref<number | null>(null)
const voiceSending = ref(false)
const voiceStatus = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const voiceError = ref<string | null>(null)

function openMicModal() {
  showMicModal.value = true
  recordError.value = null
  recordedBlob.value = null
  voiceStatus.value = 'idle'
  voiceError.value = null
}

function closeMicModal() {
  try {
    if (recorder.value && recorder.value.state !== 'inactive') recorder.value.stop()
  } catch {}
  recording.value = false
  showMicModal.value = false
}

async function startRecording() {
  recordError.value = null
  recordedBlob.value = null
  voiceError.value = null
  voiceStatus.value = 'idle'

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm'

    const mr = new MediaRecorder(stream, { mimeType: mime })
    recorder.value = mr
    chunks.value = []
    recording.value = true
    recordStartedAt.value = Date.now()

    mr.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.value.push(e.data)
    }

    mr.onstop = () => {
      stream.getTracks().forEach((t) => t.stop())
      recording.value = false
      const blob = new Blob(chunks.value, { type: mr.mimeType || 'audio/webm' })
      recordedBlob.value = blob
    }

    mr.start()
  } catch (e: any) {
    recordError.value = e?.message || 'Microphone permission denied.'
    recording.value = false
  }
}

function stopRecording() {
  if (!recorder.value) return
  if (recorder.value.state !== 'inactive') recorder.value.stop()
}

async function sendVoiceMessage() {
  if (!conversationId.value || !recordedBlob.value) return

  voiceSending.value = true
  voiceStatus.value = 'sending'
  voiceError.value = null

  const userId = await getAuthedUserId()
  if (!userId) {
    voiceStatus.value = 'error'
    voiceError.value = 'No authenticated user.'
    voiceSending.value = false
    return
  }

  const blob = recordedBlob.value
  const durationMs =
    recordStartedAt.value ? Math.max(0, Date.now() - recordStartedAt.value) : null

  try {
    // 1) create message row first (so we have messageId for filename)
    const placeholderBody = JSON.stringify({
      kind: 'voice',
      storage_bucket: 'voicemail',
      storage_path: 'pending',
      mime_type: blob.type || 'audio/webm',
      duration_ms: durationMs,
      size: blob.size
    })

    const { data: inserted, error: insErr } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId.value,
        sender_id: userId,
        body: placeholderBody
      })
      .select('id')
      .single()

    if (insErr) throw insErr

    const messageId = inserted.id as string

    // 2) upload blob to storage
    const ext = (blob.type || '').includes('ogg') ? 'ogg' : 'webm'
    const storagePath = `conversations/${conversationId.value}/${messageId}.${ext}`

    const { error: upErr } = await supabase.storage
      .from('voicemail')
      .upload(storagePath, blob, {
        contentType: blob.type || 'audio/webm',
        upsert: true
      })

    if (upErr) throw upErr

    // 3) update message body with final storage_path
    const finalBody = JSON.stringify({
      kind: 'voice',
      storage_bucket: 'voicemail',
      storage_path: storagePath,
      mime_type: blob.type || 'audio/webm',
      duration_ms: durationMs,
      size: blob.size
    })

    const { error: updErr } = await supabase
      .from('messages')
      .update({ body: finalBody })
      .eq('id', messageId)

    if (updErr) throw updErr

    // 5) refresh UI
    await fetchMessages()
    await nextTick()
    scrollToBottom()

    recordedBlob.value = null
    chunks.value = []
    voiceStatus.value = 'sent'
    showMicModal.value = false
  } catch (e: any) {
    voiceStatus.value = 'error'
    voiceError.value = e?.message || 'Failed to send voice message.'
    console.error(e)
  } finally {
    voiceSending.value = false
  }
}

// ----------------- lifecycle -----------------
onMounted(async () => {
  await nextTick()
  computeHeights()
  window.addEventListener('resize', onResize)

  await fetchApplicationSenior()
  await ensureConversation()
  await fetchMessages()
  await nextTick()
  scrollToBottom()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
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
