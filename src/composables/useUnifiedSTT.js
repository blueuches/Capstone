// src/composables/useUnifiedSTT.js
import { Capacitor } from '@capacitor/core'
import { useWebSpeechStt } from './useWebSpeechStt'
import { useNativeSpeechStt } from './useNativeSpeechStt'

export function useUnifiedSTT() {
  const isNative = Capacitor.isNativePlatform()

  // If running inside a Capacitor native app, use the native plugin-based STT
  if (isNative) {
    const nativeStt = useNativeSpeechStt()
    return nativeStt
  }

  // Otherwise, use the browser Web Speech API
  const webStt = useWebSpeechStt()
  return webStt
}
