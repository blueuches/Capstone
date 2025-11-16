declare module '@/composables/useUnifiedTTS' {
  export function speak(text: string): void
}

declare module './useWebTTS' {
  export function useWebTTS(): {
    speak: (text: string) => void
    isSupported: boolean
  }
}

declare module './useNativeTTS' {
  export function useNativeTTS(): {
    speak: (text: string) => void
    isSupported: boolean
  }
}
declare module '@/composables/useTTS' {
  export function useTTS(): {
    speak: (text: string) => void
    isSupported?: boolean
  }

}