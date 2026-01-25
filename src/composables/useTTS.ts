// src/composables/useTTS.ts
export function useTTS() {
  // We’ll store voices once they’re ready
  let availableVoices: SpeechSynthesisVoice[] = []

  // Force Chrome to load the voices list
  const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
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
    if (!('speechSynthesis' in window)) {
      console.warn('TTS not supported in this browser')
      return
    }

    await loadVoices()
    window.speechSynthesis.cancel()

    const utter = new SpeechSynthesisUtterance(text)

    // 🎯 Prefer Bahasa Indonesia female voice
    const indonesianVoice = availableVoices.find(
      (v) =>
        (v.lang === 'id-ID' || v.name.toLowerCase().includes('bahasa')) &&
        !v.name.toLowerCase().includes('male')
    )

    // Fallbacks if unavailable
    const femaleEnglish = availableVoices.find(
      (v) =>
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('zira')
    )
    utter.voice = indonesianVoice || femaleEnglish || availableVoices[0]

    utter.lang = utter.voice?.lang || 'id-ID'
    utter.rate = 1
    utter.pitch = 1.2

    window.speechSynthesis.speak(utter)
  }

  return { speak }
}
