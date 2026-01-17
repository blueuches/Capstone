<template>
  <nav
    class="bg-[#42ad43] fixed bottom-0 left-0 right-0 border-t flex justify-around items-center py-5"
  >
    <button @click="goNotif" class="text-white flex flex-col items-center gap-1">
      <component :is="NotificationIcon" class="tile-icon w-7 h-7 text-yellow" />
      <span class="text-xs">Notifications</span>
    </button>

    <button @click="decreaseFont" class="text-white font-semibold">
      A-
    </button>

    <button @click="goHome" class="text-white flex flex-col items-center gap-1">
      <component :is="HomeIcon" class="tile-icon w-8 h-8 text-white" />
      <span class="text-xs">Home</span>
    </button>

    <button @click="increaseFont" class="text-white font-semibold">
      A+
    </button>

    <button @click="goProfile" class="text-white flex flex-col items-center gap-1">
      <component :is="ProfileIcon" class="tile-icon w-7 h-7 text-blue" />
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
/* same trick as before: force svg to follow text color */
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
