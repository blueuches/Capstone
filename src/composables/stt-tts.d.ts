// src/composables/stt-tts.d.ts

declare module '@/composables/useNativeSpeechStt' {
  export function useNativeSpeechStt(): any
}

declare module '@/composables/useWebSpeechStt' {
  export function useWebSpeechStt(): any
}

declare module '@/composables/useUnifiedTTS' {
  export function useUnifiedTTS(): {
    speak: (text: string) => Promise<void> | void
    stop: () => Promise<void> | void
  }
}

declare module '@/composables/useWebTTS' {
  export function useWebTTS(): any
}

declare module '@/composables/useNativeTTS' {
  export function useNativeTTS(): any
}
