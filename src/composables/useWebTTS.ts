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
    if (!text?.trim()) return
    if (!('speechSynthesis' in window)) return

    await loadVoices()
    if (!availableVoices.length) return

    window.speechSynthesis.cancel()

    const utter = new SpeechSynthesisUtterance(text)

    // 🎯 Prefer natural US English voices
    const englishVoice =
      availableVoices.find(v => v.lang === 'en-US' && v.name.includes('Google')) ||
      availableVoices.find(v => v.lang === 'en-US' && v.name.includes('Samantha')) ||
      availableVoices.find(v => v.lang === 'en-US' && v.name.includes('Alex')) ||
      availableVoices.find(v => v.lang.startsWith('en'))

    if (englishVoice) {
      utter.voice = englishVoice
      utter.lang = 'en-US'
    } else {
      utter.lang = 'en-US'
    }

    // 👂 Natural-sounding settings
    utter.rate = 0.95
    utter.pitch = 1
    utter.volume = 1

    window.speechSynthesis.speak(utter)
  }

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  return {
    speak,
    stop,
    supported: () => 'speechSynthesis' in window,
    type: 'web',
  }
}
