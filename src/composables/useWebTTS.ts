// src/composables/useWebTTS.ts
export function useWebTTS() {
  let availableVoices: SpeechSynthesisVoice[] = []

  const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve([])
        return
      }

      const voices = window.speechSynthesis.getVoices()
      if (voices.length) {
        availableVoices = voices
        resolve(voices)
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          availableVoices = window.speechSynthesis.getVoices()
          resolve(availableVoices)
        }
      }
    })
  }

  const speak = async (text: string): Promise<void> => {
    if (!text || !text.trim()) return

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Web TTS not supported in this environment')
      return
    }

    await loadVoices()
    if (!availableVoices.length) {
      console.warn('No TTS voices available')
      return
    }

    // cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utter = new SpeechSynthesisUtterance(text)

    // Prefer Indonesian female voice (can tweak this later)
    const indonesianVoice = availableVoices.find(
      (v) =>
        (v.lang === 'id-ID' || v.name.toLowerCase().includes('bahasa')) &&
        !v.name.toLowerCase().includes('male')
    )

    // Fallbacks
    const femaleEnglish = availableVoices.find(
      (v) =>
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('zira')
    )

    const chosen = indonesianVoice || femaleEnglish || availableVoices[0]

    if (chosen) {
      utter.voice = chosen
      utter.lang = chosen.lang || 'id-ID'
    } else {
      utter.lang = 'id-ID'
    }

    utter.rate = 1
    utter.pitch = 1.2

    window.speechSynthesis.speak(utter)
  }

  const stop = (): void => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
  }

  const supported = (): boolean =>
    typeof window !== 'undefined' && 'speechSynthesis' in window

  return {
    speak,
    stop,
    supported,
    type: 'web',
  }
}