<template>
  <nav
    class="bg-[#42ad43] fixed bottom-0 left-0 right-0 border-t flex justify-around items-center py-5"
  >
    <button @click="goNotif" class="text-white flex flex-col items-center gap-1">
      <component :is="NotificationIcon" class="tile-icon w-7 h-7 text-yellow" />
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
import { useRouter } from 'vue-router'
import { useSeniorFontSize } from '@/composables/useSeniorFontSize'

import NotificationIcon from '@/assets/icons/senior/notification.svg'
import ProfileIcon from '@/assets/icons/senior/profile.svg'
import HomeIcon from '@/assets/icons/senior/home.svg'

const router = useRouter()
const { increaseFont, decreaseFont } = useSeniorFontSize()

const goNotif = () => router.push('/senior/notifications')
const goHome = () => router.push('/senior/dashboard')
const goProfile = () => router.push('/senior/profile')
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
