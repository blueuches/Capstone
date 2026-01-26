<template>
  <div class="space-y-4">
    <div
      v-for="msg in messages"
      :key="msg.id"
      class="flex"
      :class="msg.sender === 'staff' ? 'justify-start' : 'justify-end'"
    >
      <div
        class="max-w-[75%] px-4 py-3 rounded-xl"
        :class="msg.sender === 'staff'
          ? 'bg-yellow-400 text-black'
          : 'bg-[#42ad43] text-white'"
      >
        <p class="text-xs font-semibold mb-1">
          {{ msg.name }}
        </p>

        <template v-if="isVoicePending(msg)">
  <p class="text-xs opacity-80">Sending voice message…</p>
</template>

        <!-- ✅ TEXT OR VOICE -->
<template v-if="isVoice(msg)">
  <div class="w-full space-y-2">
    <div class="flex items-center justify-between">
      <p class="text-xs opacity-90">Voice message</p>
      <p class="text-[10px] opacity-70">
        {{ formatDuration(voiceMeta(msg)?.duration_ms) }}
      </p>
    </div>

    <div class="flex items-center gap-3">
      <!-- Play/Pause -->
      <button
        class="w-10 h-10 rounded-full flex items-center justify-center
               bg-black/10 hover:bg-black/15 active:scale-95 transition"
        @click="toggle(msg)"
      >
        <span v-if="!isPlaying(msg)" class="text-lg leading-none">▶</span>
        <span v-else class="text-lg leading-none">⏸</span>
      </button>

      <!-- Progress -->
      <div class="flex-1">
        <div class="h-2 rounded-full bg-black/10 overflow-hidden">
          <div
            class="h-full rounded-full bg-black/25 transition-[width]"
            :style="{ width: progressPercent(msg) + '%' }"
          />
        </div>

        <div class="mt-1 flex justify-between text-[10px] opacity-70">
          <span>{{ formatTime(currentTimeMap.get(String(msg.id)) ?? 0) }}</span>
          <span>{{ formatTime(durationMap.get(String(msg.id)) ?? 0) }}</span>
        </div>
      </div>
    </div>

    <!-- Hidden audio element -->
    <audio
      v-if="audioUrlMap.get(String(msg.id))"
      :ref="(el:any) => setAudioRef(msg, el)"
      :src="audioUrlMap.get(String(msg.id))!"
      preload="metadata"
      playsinline
    />
    <p v-else class="text-xs opacity-80">Loading audio…</p>
  </div>
</template>


        <p v-else class="text-sm">
          {{ msg.text }}
        </p>

        <p class="text-[10px] opacity-70 mt-1">
          {{ msg.date }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { supabase } from '@/supabase/client'

const props = defineProps<{ messages: Array<any> }>()

const audioUrlMap = ref<Map<string, string>>(new Map())

function parseBody(body: string) {
  try {
    const obj = JSON.parse(body)
    return obj && typeof obj === 'object' ? obj : null
  } catch {
    return null
  }
}

function voiceMeta(msg: any) {
  return parseBody(msg.body ?? msg.text ?? '')
}

function isVoice(msg: any) {
  const parsed = parseBody(msg.body ?? msg.text ?? '')
  return (
    parsed?.kind === 'voice' &&
    parsed?.storage_bucket &&
    parsed?.storage_path &&
    parsed.storage_path !== 'pending'
  )
}

function isVoicePending(msg: any) {
  const parsed = parseBody(msg.body ?? msg.text ?? '')
  return parsed?.kind === 'voice' && parsed?.storage_path === 'pending'
}


async function ensureAudioUrlForMsg(msg: any) {
  const parsed = voiceMeta(msg)
  if (!parsed?.storage_bucket || !parsed?.storage_path) return

  const key = String(msg.id)
  if (audioUrlMap.value.has(key)) return

  // Use signed URL so it works even when bucket is private
  const { data, error } = await supabase.storage
    .from(parsed.storage_bucket)
    .createSignedUrl(parsed.storage_path, 60 * 60) // 1 hour

  if (!error && data?.signedUrl) {
    audioUrlMap.value.set(key, data.signedUrl)
  } else {
    console.error('Signed URL error:', error)
  }
}

async function hydrateAudioUrls() {
  for (const msg of props.messages) {
    if (isVoice(msg)) await ensureAudioUrlForMsg(msg)
  }
}

const audioRefs = ref<Map<string, HTMLAudioElement>>(new Map())
const playingId = ref<string | null>(null)

const currentTimeMap = ref<Map<string, number>>(new Map())
const durationMap = ref<Map<string, number>>(new Map())

function setAudioRef(msg: any, el: HTMLAudioElement | null) {
  const id = String(msg.id)
  if (!el) return

  // store ref once
  if (!audioRefs.value.has(id)) audioRefs.value.set(id, el)

  // wire listeners once
  el.onloadedmetadata = () => {
    durationMap.value.set(id, el.duration || 0)
  }
  el.ontimeupdate = () => {
    currentTimeMap.value.set(id, el.currentTime || 0)
  }
  el.onended = () => {
    if (playingId.value === id) playingId.value = null
  }
}

function isPlaying(msg: any) {
  return playingId.value === String(msg.id)
}

function stopAllExcept(id: string) {
  for (const [k, el] of audioRefs.value.entries()) {
    if (k !== id && !el.paused) {
      el.pause()
      el.currentTime = 0
    }
  }
}

async function toggle(msg: any) {
  const id = String(msg.id)
  const el = audioRefs.value.get(id)
  if (!el) return

  if (playingId.value === id) {
    el.pause()
    playingId.value = null
    return
  }

  stopAllExcept(id)

  // iOS/Safari sometimes needs a direct user gesture (this click qualifies)
  try {
    await el.play()
    playingId.value = id
  } catch (e) {
    console.error('Play failed:', e)
  }
}

function progressPercent(msg: any) {
  const id = String(msg.id)
  const cur = currentTimeMap.value.get(id) ?? 0
  const dur = durationMap.value.get(id) ?? 0
  if (!dur) return 0
  return Math.min(100, Math.max(0, (cur / dur) * 100))
}

function formatTime(sec: number) {
  if (!isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatDuration(ms?: number | null) {
  if (!ms) return ''
  return `${Math.ceil(ms / 1000)}s`
}

onMounted(hydrateAudioUrls)

watch(
  () => props.messages,
  async () => {
    await hydrateAudioUrls()
  },
  { deep: true }
)
</script>
