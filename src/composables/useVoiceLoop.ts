import { ref } from 'vue'

type VoiceLoopOptions = {
  onTranscript: (text: string) => void
}

export function useVoiceLoop(opts: VoiceLoopOptions) {
  const isListening = ref(false)
  const targetFieldKey = ref<string>('')

  function setTargetFieldKey(key: string) {
    targetFieldKey.value = key
  }

  // Placeholder: simulate voice recognition results
  // Later: replace with Web Speech API / Capacitor plugin / Whisper pipeline
  let fakeTimer: number | null = null

  function startListening() {
    if (isListening.value) return
    isListening.value = true

    // Simulate transcript arriving after 1.2s
    fakeTimer = window.setTimeout(() => {
      if (!isListening.value) return
      opts.onTranscript('Sample voice input')
    }, 1200)
  }

  function stopListening() {
    isListening.value = false
    if (fakeTimer) {
      window.clearTimeout(fakeTimer)
      fakeTimer = null
    }
  }

  return {
    isListening,
    setTargetFieldKey,
    startListening,
    stopListening
  }
}
