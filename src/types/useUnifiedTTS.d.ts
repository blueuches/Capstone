// src/types/useUnifiedTTS.d.ts
declare module '@/composables/useUnifiedTTS' {
  export function useUnifiedTTS(): {
    isSpeaking: import('vue').Ref<boolean>
    speak: (text: string, options?: { lang?: string; rate?: number; pitch?: number }) => void
    stop: () => void
  }
}
