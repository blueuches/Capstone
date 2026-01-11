// src/composables/useNotifications.ts
import { ref, computed, onMounted, onBeforeUnmount, watchEffect } from 'vue'
import { supabase } from '@/supabase/client'

type AnnouncementLite = {
  id?: number | null
  title?: string | null
  content?: string | null
  sender_role?: string | null
  created_at?: string | null
}

export type NotifRow = {
  id: number
  user_id: string
  announcement_id: number | null
  is_read: boolean
  created_at: string
  announcement?: AnnouncementLite | null
}

/** normalize join: Supabase can return an object (1:1) OR an array (if FK not declared) */
function normalizeAnnouncement(a: any): AnnouncementLite | null {
  if (!a) return null
  if (Array.isArray(a)) return (a[0] as AnnouncementLite) ?? null
  return a as AnnouncementLite
}

export function useNotifications(limit = 100) {
  const notifications = ref<NotifRow[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const channel = ref<any>(null) // keep loose for SDK variations
  const uid = ref<string | null>(null)

  const unreadCount = computed(() => notifications.value.filter(n => !n.is_read).length)

  function formatTimeAgo(iso?: string | null) {
    if (!iso) return ''
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'just now'
    if (m < 60) return `${m} min ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h} hr${h > 1 ? 's' : ''} ago`
    const d = Math.floor(h / 24)
    return `${d} day${d > 1 ? 's' : ''} ago`
  }

  async function load() {
    loading.value = true
    error.value = null
    try {
      const { data: u } = await supabase.auth.getUser()
      uid.value = u?.user?.id ?? null
      if (!uid.value) {
        notifications.value = []
        return
      }

      const { data, error: e } = await supabase
        .from('Notifications')
        .select(`
          id,
          user_id,
          announcement_id,
          is_read,
          created_at,
          announcement:announcement_id (
            id,
            title,
            content,
            sender_role,
            created_at
          )
        `)
        .eq('user_id', uid.value)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (e) throw e

      notifications.value = (data || []).map((row: any) => ({
        id: row.id,
        user_id: row.user_id,
        announcement_id: row.announcement_id,
        is_read: row.is_read,
        created_at: row.created_at,
        announcement: normalizeAnnouncement(row.announcement),
      })) as NotifRow[]
    } catch (e: any) {
      error.value = e?.message || 'Failed to load notifications.'
    } finally {
      loading.value = false
    }
  }

  async function markOneRead(id: number) {
    const { error: e } = await supabase
      .from('Notifications')
      .update({ is_read: true })
      .eq('id', id)
    if (!e) {
      const i = notifications.value.findIndex(n => n.id === id)
      if (i >= 0) notifications.value[i].is_read = true
    }
  }

  async function markAllRead() {
    if (!uid.value) return
    const { error: e } = await supabase
      .from('Notifications')
      .update({ is_read: true })
      .eq('user_id', uid.value)
      .eq('is_read', false)
    if (!e) notifications.value = notifications.value.map(n => ({ ...n, is_read: true }))
  }

  function startRealtime() {
    if (!uid.value) return
    stopRealtime()

    // Use the simplest compatible signature
    channel.value = supabase
      .channel(`notifs-${uid.value}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Notifications', filter: `user_id=eq.${uid.value}` },
        async payload => {
          // Fetch full row with join then normalize
          const { data } = await supabase
            .from('Notifications')
            .select(`
              id, user_id, announcement_id, is_read, created_at,
              announcement:announcement_id (id, title, content, sender_role, created_at)
            `)
            .eq('id', (payload as any).new.id)
            .single()

          if (data) {
            const row = {
              id: data.id,
              user_id: data.user_id,
              announcement_id: data.announcement_id,
              is_read: data.is_read,
              created_at: data.created_at,
              announcement: normalizeAnnouncement(data.announcement),
            } as NotifRow
            notifications.value.unshift(row)
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'Notifications', filter: `user_id=eq.${uid.value}` },
        payload => {
          const i = notifications.value.findIndex(n => n.id === (payload as any).new.id)
          if (i >= 0) notifications.value[i].is_read = !!(payload as any).new.is_read
        }
      )
      .subscribe()
  }

  function stopRealtime() {
    if (channel.value) {
      supabase.removeChannel(channel.value)
      channel.value = null
    }
  }

  onMounted(async () => {
    await load()
    startRealtime()
  })
  onBeforeUnmount(stopRealtime)

  // If you want a tiny global side-effect for a header badge in other pages:
  watchEffect(() => {
    // no-op; the consumer can import unreadCount directly
  })

  return {
    notifications,
    unreadCount,
    error,
    loading,
    formatTimeAgo,
    load,
    markOneRead,
    markAllRead,
  }
}
