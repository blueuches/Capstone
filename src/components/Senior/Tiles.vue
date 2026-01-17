<template>
  <div class="grid grid-cols-2 gap-6 place-items-center py-6">
    <button
      v-for="tile in tiles"
      :key="tile.label"
      @click="go(tile.route)"
      class="flex flex-col items-center justify-center space-y-3 active:scale-95 transition"
    >
      <div
        class="w-24 h-24 rounded-full bg-[#42ad43] flex items-center justify-center shadow-md"
      >
        <component :is="tile.icon" class="tile-icon w-11 h-11 text-white" />
      </div>

      <span class="text-base font-semibold text-gray-800">
        {{ tile.label }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import StatusIcon from '@/assets/icons/senior/status.svg'
import RequirementsIcon from '@/assets/icons/senior/requirements.svg'
import ApplyIcon from '@/assets/icons/senior/apply.svg'
import ApplicationsIcon from '@/assets/icons/senior/applications.svg'
import LocationIcon from '@/assets/icons/senior/location.svg'
import HelpIcon from '@/assets/icons/senior/help.svg'

const router = useRouter()
const go = (route: string) => router.push(route)

const tiles = [
  { label: 'My Status', route: '/senior/dashboard/mystatus', icon: StatusIcon },
  { label: 'My Requirements', route: '/senior/dashboard/myrequirements', icon: RequirementsIcon },
  { label: 'Apply', route: '/senior/dashboard/apply', icon: ApplyIcon },
  { label: 'Applications', route: '/senior/dashboard/applications', icon: ApplicationsIcon },
  { label: 'Location', route: '/senior/dashboard/location', icon: LocationIcon },
  { label: 'Help', route: '/senior/dashboard/help', icon: HelpIcon },
]
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
