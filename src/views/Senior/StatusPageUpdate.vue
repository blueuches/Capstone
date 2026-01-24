<template>
  <div class="min-h-screen bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <main class="flex-1 px-4 pt-4 flex flex-col overflow-hidden">
      <!-- Breadcrumb -->
      <RouterLink
        to="/senior/dashboard/mystatus"
        class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3 shrink-0"
      >
        <component :is="Left" class="w-5 h-5 text-yellow-500" />
        <span class="text-gray-500">Dashboard</span>
        <span>/</span>
        <span class="text-gray-900">My Status</span>
        <span>/</span>
        <span class="text-gray-900">Update Channel</span>
      </RouterLink>

      <!-- optional small notice if no OSCA assigned -->
      <div
        v-if="!loading && !assignedOscaId"
        class="mb-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 shrink-0"
      >
        No OSCA staff is assigned yet. You can still send a message — it will be visible once a staff is assigned.
      </div>

      <!-- MESSAGE AREA -->
      <div class="flex-1 overflow-y-auto flex flex-col justify-end pb-1">
        <MessageBodies v-if="messages.length" :messages="messages" />

        <div v-else class="text-center text-gray-400 my-10">
          {{ loading ? 'Loading...' : 'No Message Yet' }}
        </div>
      </div>

      <!-- INPUT BAR (STAYS ABOVE BottomNav) -->
      <div class="shrink-0 flex items-center gap-2 bg-white p-3 rounded-xl shadow mb-10">
        <!-- Mic -->
        <button
          class="w-10 h-10 flex items-center justify-center bg-[#42ad43] text-white rounded-full"
          @click="openMicModal"
        >
          <component :is="Mic" class="tile-icon w-7 h-7 text-white" />
        </button>

        <!-- Input -->
        <input
          v-model="newMessage"
          type="text"
          placeholder="Send a question, message, inquiry"
          class="flex-1 px-4 py-2 border rounded-full focus:outline-none"
          @keyup.enter="sendMessage"
        />

        <!-- Send -->
        <button
          class="w-10 h-10 flex items-center justify-center bg-[#42ad43] text-white rounded-full"
          @click="sendMessage"
        >
          ➤
        </button>
      </div>
    </main>

    <!-- MIC MODAL -->
    <div v-if="showMicModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl w-72 text-center">
        <h3 class="font-semibold mb-2">Speak Now</h3>
        <p class="text-sm text-gray-500 mb-4">(Temporary placeholder)</p>

        <div class="flex gap-2 justify-center">
          <button class="px-3 py-2 bg-green-500 text-white rounded">Start</button>
          <button class="px-3 py-2 bg-gray-300 rounded">Stop</button>
        </div>

        <button class="mt-4 text-sm text-gray-500" @click="showMicModal = false">
          Close
        </button>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/composables/useAuth'

import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import MessageBodies from '@/components/MessageBodies.vue'
import Left from '@/assets/icons/senior/left-arrow.svg'
import Mic from '@/assets/icons/senior/mic.svg'

const { profile } = useAuth()
const open = ref(false)

const route = useRoute()
const applicationId = route.params.applicationId as string

const loading = ref(true)
const assignedOscaId = ref<string | null>(null)

const conversationId = ref<string | null>(null)

type UiMsg = {
  id: string | number
  sender: 'staff' | 'senior'
  name: string
  text: string
  date: string
}

const messages = ref<UiMsg[]>([])
const newMessage = ref('')
const showMicModal = ref(false)

function formatTime(d?: string | null) {
  if (!d) return ''
  const dt = new Date(d)
  return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

async function ensureConversationAndParticipants(currentUserId: string) {
  // 1) read application (for assigned_osca_id)
  const { data: app, error: appErr } = await supabase
    .from('applications')
    .select('id, assigned_osca_id')
    .eq('id', applicationId)
    .single()

  if (appErr) throw appErr
  assignedOscaId.value = app?.assigned_osca_id ?? null

  // 2) find conversation for this application
  const { data: conv, error: convErr } = await supabase
    .from('conversations')
    .select('id')
    .eq('application_id', applicationId)
    .eq('conversation_type', 'senior_osca')
    .maybeSingle()

  if (convErr) throw convErr

let convId: string | null = conv?.id ?? null

if (!convId) {
  const { data: created, error: createErr } = await supabase
    .from('conversations')
    .insert({
      application_id: applicationId,
      conversation_type: 'senior_osca'
    })
    .select('id')
    .single()

  if (createErr) throw createErr
  convId = created.id
}

// ✅ convId is now guaranteed string
conversationId.value = convId

  // 4) ensure participants exist (senior always; osca if assigned)
  // ignore duplicates by doing "try insert" pattern
  await supabase.from('conversation_participants').insert({
    conversation_id: convId,
    user_id: currentUserId
  })

  if (assignedOscaId.value) {
    await supabase.from('conversation_participants').insert({
      conversation_id: convId,
      user_id: assignedOscaId.value
    })
  }
}

async function loadMessages() {
  if (!conversationId.value) return

  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      body,
      created_at,
      sender:profiles!messages_sender_id_fkey ( id, role, first_name, last_name )
    `)
    .eq('conversation_id', conversationId.value)
    .order('created_at', { ascending: true })

  if (error) throw error

  const rows = (data ?? []) as any[]

  messages.value = rows.map((m) => {
    const senderProfile = m.sender
    const isCurrentUser = senderProfile?.id === profile?.value?.id
    const isStaff = senderProfile?.role === 'osca_staff' || (!isCurrentUser && senderProfile?.role !== 'senior')

    return {
      id: m.id,
      sender: isStaff ? 'staff' : 'senior',
      name: isStaff
        ? `OSCA Staff: ${senderProfile?.first_name ?? ''} ${senderProfile?.last_name ?? ''}`.trim()
        : (profile?.value?.first_name || 'You'),
      text: m.body,
      date: formatTime(m.created_at)
    } as UiMsg
  })
}

async function markMyNotificationsRead(currentUserId: string) {
  // marks unread "message" notifications for THIS application as read
  await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', currentUserId)
    .eq('type', 'message')
    .is('read_at', null)
    .eq('link->>applicationId', applicationId)
}

async function sendMessage() {
  if (!newMessage.value.trim()) return
  if (!conversationId.value) return

  const { data: authData, error: authErr } = await supabase.auth.getUser()
  if (authErr) {
    console.error(authErr)
    return
  }
  const userId = authData.user?.id
  if (!userId) return

  const body = newMessage.value.trim()

  try {
    // 1) insert message
    const { error: msgErr } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId.value,
        sender_id: userId,
        body
      })

    if (msgErr) throw msgErr

    // 2) create notification for assigned OSCA staff (if any)
    // (staff UI can do the reverse for senior)
    if (assignedOscaId.value) {
      await supabase.from('notifications').insert({
        user_id: assignedOscaId.value,
        type: 'message',
        title: 'New message from senior',
        body: body.slice(0, 120),
        link: { applicationId }
      })
    }

    // optimistic UI (keep your design)
    messages.value.push({
      id: Date.now(),
      sender: 'senior',
      name: profile?.value?.first_name || 'You',
      text: body,
      date: 'Just now'
    })

    newMessage.value = ''
  } catch (e) {
    console.error(e)
  }
}

function openMicModal() {
  showMicModal.value = true
}

onMounted(async () => {
  loading.value = true
  try {
    const { data: authData, error: authErr } = await supabase.auth.getUser()
    if (authErr) throw authErr
    const userId = authData.user?.id
    if (!userId) throw new Error('No authenticated user.')

    await ensureConversationAndParticipants(userId)
    await markMyNotificationsRead(userId)
    await loadMessages()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.tile-icon :deep(path),
.tile-icon :deep(circle),
.tile-icon :deep(rect),
.tile-icon :deep(polygon),
.tile-icon :deep(line),
.tile-icon :deep(polyline) {
  fill: currentColor !important;
  stroke: currentColor !important;
}
</style>
