// src/composables/useNativeSpeechStt.ts
import { ref } from 'vue'
import { Capacitor } from '@capacitor/core'
import { SpeechRecognition } from '@capacitor-community/speech-recognition'

export function useNativeSpeechStt() {
  const isNative = Capacitor.isNativePlatform()

  const supported = ref<boolean>(false)
  const listening = ref<boolean>(false)
  const interimTranscript = ref<string>('')
  const finalTranscript = ref<string>('')
  const logText = ref<string>('')
  const lang = ref<string>('en-US')

  const permissionsGranted = ref<boolean>(false)

  // controls for “continuous” feel
  const autoRestart = ref<boolean>(true) // you can bind this to a checkbox if you want
  let stopRequested = false // true only when user taps Stop
  let restartTimeout: ReturnType<typeof setTimeout> | null = null
  const RESTART_DELAY_MS = 350 // small delay between chained sessions

  function log(msg: string) {
    const t = new Date().toLocaleTimeString()
    logText.value = `[${t}] ${msg}\n` + logText.value
  }

  // 1) Check availability once
  ;(async () => {
    if (!isNative) {
      supported.value = false
      log('Native STT: not running on a native platform.')
      return
    }
    try {
      const avail: any = await SpeechRecognition.available()
      const isAvail = !!(avail && (avail.available ?? avail))
      supported.value = isAvail
      log(
        isAvail
          ? 'Native SpeechRecognition is available.'
          : 'Native SpeechRecognition NOT available on this device.'
      )
    } catch (e: any) {
      supported.value = false
      log('Error checking availability: ' + (e?.message ?? String(e)))
    }
  })()

  // 2) Permissions
  async function ensurePermissions(): Promise<boolean> {
    if (!isNative) return false
    if (permissionsGranted.value) return true

    try {
      const perm: any = await SpeechRecognition.requestPermissions()
      const status = perm && perm.speechRecognition
      if (status === 'granted') {
        permissionsGranted.value = true
        log('Native STT permission granted.')
        return true
      } else {
        log('Native STT permission not granted: ' + status)
        return false
      }
    } catch (e: any) {
      log('Error requesting permissions: ' + (e?.message ?? String(e)))
      return false
    }
  }

  // 3) Start recognition (one session)
  async function start(): Promise<void> {
    if (!isNative) {
      log('Cannot start native STT on web.')
      return
    }
    if (!supported.value) {
      log('Native STT not supported.')
      return
    }

    const ok = await ensurePermissions()
    if (!ok) return

    try {
      stopRequested = false // this is a fresh session
      interimTranscript.value = ''
      log('Native STT: starting…')

      listening.value = true

      await SpeechRecognition.start({
        language: lang.value,
        maxResults: 1,
        partialResults: true,
        popup: false,
      })
      // With partialResults: true, start() resolves quickly;
      // speech comes via partialResults listener below.
    } catch (e: any) {
      listening.value = false
      log('Native STT start error: ' + (e?.message ?? String(e)))
    }
  }

  // 4) Stop recognition and cancel auto-restart
  async function stop(): Promise<void> {
    if (!isNative) return
    try {
      log('Native STT: stop requested.')
      autoRestart.value = false // user explicitly stopped -> no auto restart
      stopRequested = true

      await SpeechRecognition.stop()
    } catch (e: any) {
      log('Native STT stop error: ' + (e?.message ?? String(e)))
    } finally {
      listening.value = false
      if (restartTimeout) {
        clearTimeout(restartTimeout)
        restartTimeout = null
      }
    }
  }

  // 5) Clear transcripts
  function clear(): void {
    finalTranscript.value = ''
    interimTranscript.value = ''
    log('Transcripts cleared.')
  }

  // 6) Send to backend (Rasa)
  async function sendToBackend(textOverride?: string): Promise<void> {
    const text = textOverride || finalTranscript.value
    if (!text || !text.trim()) {
      log('No text to send.')
      return
    }
    log('Sending to backend: ' + text)
    try {
      const res = await fetch('/stt-to-rasa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      log('Backend response: ' + JSON.stringify(data))
    } catch (err: any) {
      log('Network error: ' + (err?.message ?? String(err)))
    }
  }

  // 7) Plugin listeners

  // Streaming text while you speak
  SpeechRecognition.addListener('partialResults', (data: any) => {
    const matches = Array.isArray(data.matches) ? data.matches : []
    const text = matches.join(' ')
    interimTranscript.value = text
    log('Native STT partial: ' + text)

    // treat latest partial as current “final”
    finalTranscript.value = text
  })

  // Listening state – used for auto-restart chaining
  SpeechRecognition.addListener('listeningState', (data: any) => {
    const status = data && data.status // 'started' | 'stopped'
    listening.value = status === 'started'
    log('Native STT listeningState: ' + status)

    if (status === 'stopped') {
      // Session ended – if autoRestart = true and user did NOT press Stop,
      // start a new session after a short delay.
      if (autoRestart.value && !stopRequested) {
        if (restartTimeout) clearTimeout(restartTimeout)
        restartTimeout = setTimeout(() => {
          log('Native STT: auto-restarting new session…')
          start()
        }, RESTART_DELAY_MS)
      }
    }
  })

  return {
    supported,
    listening,
    interimTranscript,
    finalTranscript,
    logText,
    lang,
    autoRestart, // you can expose this to UI if you want a checkbox
    start,
    stop,
    clear,
    sendToBackend,
  }
}