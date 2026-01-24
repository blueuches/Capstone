<template>
  <div class="min-h-screen bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <main class="flex-1 px-4 pt-4">
      <!-- Breadcrumb -->
      <RouterLink
        to="/senior/dashboard"
        class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4"
      >
        <component :is="Left" class="w-5 h-5 text-yellow-500" />
        <span class="text-gray-500">Dashboard</span>
        <span>/</span>
        <span class="text-gray-900">My Status</span>
      </RouterLink>

      <!-- Empty state -->
      <p v-if="!loading && applications.length === 0" class="text-center text-gray-500 mt-12">
        You have no application yet
      </p>

      <p v-if="loading" class="text-center text-gray-500 mt-12">
        Loading...
      </p>

      <!-- Status list -->
      <div v-else class="space-y-4">
        <StatusItem
          v-for="app in applications"
          :key="app.id"
          :title="app.title"
          :status-label="app.statusLabel"
          :started-at="app.startedAt"
          :requirements-link="app.requirementsLink"
          :update="app.update"
          :unread-count="app.unreadCount"
        />
      </div>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/composables/useAuth'

import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import StatusItem from '@/components/Senior/StatusItem.vue'
import Left from '@/assets/icons/senior/left-arrow.svg'

const open = ref(false)
const loading = ref(true)

type Card = {
  id: string
  title: string
  statusLabel: string
  startedAt: string
  requirementsLink: any
  update: any
  unreadCount: number
}

const applications = ref<Card[]>([])

function prettyStatus(s?: string | null) {
  if (!s) return 'Unknown'
  return s.toString().replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
}

function formatDate(d?: string | null) {
  if (!d) return ''
  const dt = new Date(d)
  return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

async function loadApplications() {
  loading.value = true

  try {
    const { data: authData, error: authErr } = await supabase.auth.getUser()
    if (authErr) throw authErr
    const userId = authData.user?.id
    if (!userId) throw new Error('No authenticated user.')

    // 1) load applications for this senior
    const { data, error } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        created_at,
        issuance_type:issuance_type_id ( id, name )
      `)
      .eq('senior_id', userId)
      .order('created_at', { ascending: true })

    if (error) throw error

    const rows = (data ?? []) as any[]

    // 2) unread notifications grouped by applicationId
    // We assume notifications.link contains { applicationId: "<uuid>" }
    const { data: notifData, error: notifErr } = await supabase
      .from('notifications')
      .select('id, link')
      .eq('user_id', userId)
      .is('read_at', null)
      .eq('type', 'message') // make sure your staff side uses this too

    if (notifErr) throw notifErr

    const unreadMap = new Map<string, number>()
    ;(notifData ?? []).forEach((n: any) => {
      const appId = n?.link?.applicationId
      if (!appId) return
      unreadMap.set(appId, (unreadMap.get(appId) ?? 0) + 1)
    })

    // 3) numbering per issuance_type
    const counterByIssuance = new Map<string, number>()
    const totalByIssuance = new Map<string, number>()

    rows.forEach((r) => {
      const itId = r?.issuance_type?.id ?? 'unknown'
      totalByIssuance.set(itId, (totalByIssuance.get(itId) ?? 0) + 1)
    })

    applications.value = rows.map((r) => {
      const it = r?.issuance_type
      const issuanceId = it?.id ?? 'unknown'
      const issuanceName = it?.name ?? 'Application'

      const nextNum = (counterByIssuance.get(issuanceId) ?? 0) + 1
      counterByIssuance.set(issuanceId, nextNum)

      const total = totalByIssuance.get(issuanceId) ?? 1
      const titleBase = issuanceName.toUpperCase()
      const title = total > 1 ? `${titleBase} ${nextNum}` : titleBase

      return {
        id: r.id,
        title,
        statusLabel: prettyStatus(r.status),
        startedAt: formatDate(r.created_at),
        requirementsLink: { name: 'RequirementsPageList', params: { applicationId: r.id } },
        update: { name: 'StatusPageUpdate', params: { applicationId: r.id } },
        unreadCount: unreadMap.get(r.id) ?? 0
      } satisfies Card
    })
  } catch (e: any) {
    console.error(e)
    applications.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadApplications()
})
</script>
