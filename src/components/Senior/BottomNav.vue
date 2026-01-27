<template>
  <nav
    class="bg-[#42ad43] fixed bottom-0 left-0 right-0 border-t flex justify-around items-center py-5"
  >
    <!-- Notifications with badge -->
    <button @click="goNotif" class="text-white flex flex-col items-center gap-1 relative">
      <span class="relative">
        <component :is="NotificationIcon" class="tile-icon w-7 h-7 text-yellow" />

        <!-- Badge -->
        <span
          v-if="unreadCount > 0"
          class="absolute -top-2 -right-2 z-20 min-w-[18px] h-[18px]
                px-1 rounded-full bg-red-600 text-white text-[11px] leading-[18px]
                font-bold text-center ring-2 ring-[#42ad43]"
          :class="unreadCount >= 100 ? 'px-1.5' : ''"
        >
          {{ unreadCountLabel }}
        </span>

      </span>

      <span class="text-xs">Notifications</span>
    </button>

    <!-- A- (clickable circle) -->
    <button
      @click="decreaseFont"
      type="button"
      class="w-10 h-10 rounded-full bg-white/20 active:bg-white/30
             flex items-center justify-center text-white font-semibold select-none"
      aria-label="Decrease text size"
      title="Decrease text size"
    >
      A-
    </button>

    <button @click="goHome" class="text-white flex flex-col items-center gap-1">
      <component :is="HomeIcon" class="tile-icon w-8 h-8 text-white" />
      <span class="text-xs">Home</span>
    </button>

    <!-- A+ (clickable circle) -->
    <button
      @click="increaseFont"
      type="button"
      class="w-10 h-10 rounded-full bg-white/20 active:bg-white/30
             flex items-center justify-center text-white font-semibold select-none"
      aria-label="Increase text size"
      title="Increase text size"
    >
      A+
    </button>

    <button @click="goProfile" class="text-white flex flex-col items-center gap-1">
      <component :is="ProfileIcon" class="tile-icon w-7 h-7 text-gray-600" />
      <span class="text-xs">Profile</span>
    </button>

  </nav>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSeniorFontSize } from '@/composables/useSeniorFontSize'
import { supabase } from '@/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

import NotificationIcon from '@/assets/icons/senior/notification.svg'
import ProfileIcon from '@/assets/icons/senior/profile.svg'
import HomeIcon from '@/assets/icons/senior/home.svg'

const router = useRouter()
const { increaseFont, decreaseFont } = useSeniorFontSize()

const goNotif = () => router.push('/senior/notifications')
const goHome = () => router.push('/senior/dashboard')
const goProfile = () => router.push('/senior/profile')

const unreadCount = ref(0)
const unreadCountLabel = computed(() => (unreadCount.value > 99 ? '99+' : String(unreadCount.value)))

let channel: RealtimeChannel | null = null
let currentUserId: string | null = null

async function refreshUnreadCount() {
  if (!currentUserId) return

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', currentUserId)
    .is('read_at', null)

  if (error) {
    console.error('❌ refreshUnreadCount error:', error)
    return
  }

  unreadCount.value = count ?? 0
  console.log('✅ unreadCount:', unreadCount.value, 'for user:', currentUserId)
}

async function setupNotifRealtime() {
  const { data: sessionRes, error: sessErr } = await supabase.auth.getSession()
  if (sessErr) console.error('❌ getSession error:', sessErr)

  const user = sessionRes.session?.user
  if (!user) {
    console.warn('⚠️ No session user yet (badge won’t load).')
    return
  }

  currentUserId = user.id
  console.log('👤 BottomNav userId:', currentUserId)

  // initial load
  await refreshUnreadCount()

  // cleanup old channel (HMR / remount)
  if (channel) {
    await supabase.removeChannel(channel)
    channel = null
  }

  channel = supabase
    .channel(`bottomnav_notif_${user.id}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
      payload => {
        const n = payload.new as any
        console.log('🔔 BottomNav INSERT notif:', n)

        // safest: if unread, increment; else ignore
        if (n.read_at == null) unreadCount.value += 1
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
      payload => {
        const oldRow = payload.old as any
        const newRow = payload.new as any
        console.log('🔔 BottomNav UPDATE notif:', { oldRow, newRow })

        if (oldRow?.read_at == null && newRow?.read_at != null) {
          unreadCount.value = Math.max(0, unreadCount.value - 1)
        } else if (oldRow?.read_at != null && newRow?.read_at == null) {
          unreadCount.value += 1
        }
      }
    )
    .subscribe(async status => {
      console.log('🔔 BottomNav channel status:', status)
      // After subscribe, refresh to avoid missing events that happened before it connected
      if (status === 'SUBSCRIBED') await refreshUnreadCount()
    })
}

onMounted(async () => {
  await setupNotifRealtime()
})

onBeforeUnmount(async () => {
  if (channel) {
    await supabase.removeChannel(channel)
    channel = null
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
