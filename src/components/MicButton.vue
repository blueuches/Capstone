<template>
  <button
    @click="toggleRecording"
    :class="[
      'relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg',
      isRecording
        ? 'bg-emerald-500 text-white ring-4 ring-emerald-300 animate-pulse-glow'
        : 'bg-emerald-600 text-white'
    ]"
    aria-label="Voice"
  >
    <span
      v-if="isRecording"
      class="absolute inset-0 rounded-full bg-emerald-400 opacity-30 animate-ping"
    ></span>
    <svg
      viewBox="0 0 24 24"
      class="w-8 h-8 relative z-10"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z"
      />
      <path d="M19 11a7 7 0 0 1-14 0" />
      <path d="M12 18v4" />
    </svg>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['transcribed'])
const isRecording = ref(false)
let mediaRecorder
let chunks = []

async function toggleRecording() {
  if (isRecording.value) {
    mediaRecorder.stop()
    isRecording.value = false
  } else {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    chunks = []

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      const wavBlob = await convertToWav(blob)
      await sendToWhisper(wavBlob)
    }

    mediaRecorder.start()
    isRecording.value = true
  }
}

// ✅ Converts MediaRecorder webm blob -> 16-bit PCM wav blob
async function convertToWav(webmBlob) {
  const arrayBuffer = await webmBlob.arrayBuffer()
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)

  const numChannels = 1
  const sampleRate = 16000
  const offlineCtx = new OfflineAudioContext(
    numChannels,
    audioBuffer.duration * sampleRate,
    sampleRate
  )

  // Mix down to mono
  const source = offlineCtx.createBufferSource()
  const monoBuffer = offlineCtx.createBuffer(1, audioBuffer.length, audioBuffer.sampleRate)
  const left = audioBuffer.getChannelData(0)
  const right = audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : left
  const monoData = monoBuffer.getChannelData(0)
  for (let i = 0; i < audioBuffer.length; i++) {
    monoData[i] = (left[i] + right[i]) / 2
  }

  source.buffer = monoBuffer
  source.connect(offlineCtx.destination)
  source.start(0)

  const rendered = await offlineCtx.startRendering()

  const buffer = encodeWav(rendered)
  return new Blob([buffer], { type: 'audio/wav' })
}

// ✅ Helper: encode AudioBuffer -> 16-bit PCM WAV
function encodeWav(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const samples = audioBuffer.getChannelData(0)
  const buffer = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buffer)

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  let offset = 0
  writeString(view, offset, 'RIFF'); offset += 4
  view.setUint32(offset, 36 + samples.length * 2, true); offset += 4
  writeString(view, offset, 'WAVE'); offset += 4
  writeString(view, offset, 'fmt '); offset += 4
  view.setUint32(offset, 16, true); offset += 4
  view.setUint16(offset, 1, true); offset += 2
  view.setUint16(offset, numChannels, true); offset += 2
  view.setUint32(offset, sampleRate, true); offset += 4
  view.setUint32(offset, sampleRate * numChannels * 2, true); offset += 4
  view.setUint16(offset, numChannels * 2, true); offset += 2
  view.setUint16(offset, 16, true); offset += 2
  writeString(view, offset, 'data'); offset += 4
  view.setUint32(offset, samples.length * 2, true); offset += 4

  let pos = 44
  for (let i = 0; i < samples.length; i++, pos += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(pos, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return buffer
}

// ✅ Send WAV to local Whisper.cpp server
async function sendToWhisper(wavBlob) {
  const formData = new FormData()
  formData.append('audio', wavBlob, 'input.wav')

  try {
    const response = await fetch('http://localhost:8080/transcribe', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Transcribe failed: ${errText}`);
    }

    const text = await response.text()
    console.log('🧠 Whisper transcript:', text)
    emit('transcribed', text)
  } catch (error) {
    console.error('❌ Whisper error:', error)
  }
}
</script>

<style scoped>
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
  50% { box-shadow: 0 0 15px 5px rgba(16, 185, 129, 0.6); }
}
.animate-pulse-glow {
  animation: pulseGlow 1.5s infinite ease-in-out;
}
</style>
