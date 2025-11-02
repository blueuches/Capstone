<template>
  <div class="p-6 space-y-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold text-emerald-700">🎤 Whisper STT Test Page</h1>

    <!-- Field bound to the transcribed text -->
    <label class="block text-gray-700 font-semibold mb-1">Transcribed Speech:</label>
    <input
      v-model="transcript"
      type="text"
      class="w-full border border-emerald-200 rounded-lg p-3 focus:outline-none focus:ring focus:ring-emerald-300"
      placeholder="Say something..."
      readonly
    />

    <!-- MicButton Component -->
    <div class="flex justify-center mt-4">
      <MicButton @transcribed="onTranscribed" />
    </div>

    <p v-if="loading" class="text-sm text-gray-500 mt-4">Transcribing... please wait</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MicButton from '@/components/MicButton.vue'

const transcript = ref('')
const loading = ref(false)

async function onTranscribed(text) {
  try {
    loading.value = true
    transcript.value = text

    // 👉 Send the text to RASA NLU for intent recognition
    const rasaRes = await fetch('http://localhost:5005/model/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    const rasaData = await rasaRes.json()
    console.log('🎯 RASA response:', rasaData)

    // (Optional) Display or handle the RASA result
    transcript.value += `\n\n[Intent: ${rasaData.intent.name}]`

  } catch (err) {
    console.error('Error:', err)
    transcript.value = '[Error — see console]'
  } finally {
    loading.value = false
  }
}
</script>

