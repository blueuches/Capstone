// src/composables/useNativeTTS.ts
import { Capacitor } from '@capacitor/core'
import { TextToSpeech } from '@capacitor-community/text-to-speech'

export function useNativeTTS() {
  const isNative = Capacitor.isNativePlatform()

  const supported = () => isNative

  /**
   * Speak with native TTS.
   * @param {string} text - text to speak
   * @param {object} opts - optional { lang, rate, pitch, volume }
   */
  const speak = async (
    text: string,
    opts: {
      lang?: string
      rate?: number
      pitch?: number
      volume?: number
    } = {}
  ): Promise<void> => {
    if (!text || !text.trim()) return
    if (!isNative) {
      console.warn('Native TTS called on web')
      return
    }

    const {
      lang = 'id-ID', // try Bahasa Indonesia by default
      rate = 1.0,
      pitch = 1.2, // slightly higher pitch = “more feminine”
      volume = 1.0,
    } = opts

    try {
      await TextToSpeech.speak({
        text,
        lang,
        rate,
        pitch,
        volume,
        category: 'ambient',
      } as any)
    } catch (err) {
      console.error('Native TTS error:', err)
      throw err
    }
  }

  const stop = async (): Promise<void> => {
    if (!isNative) return
    try {
      await TextToSpeech.stop()
    } catch (err) {
      console.error('Native TTS stop error:', err)
    }
  }

  return {
    speak,
    stop,
    supported,
    type: 'native',
  }
}