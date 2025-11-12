import { ref } from 'vue'
import { VoskRecognizer } from 'vosk-browser'  // high-level helper
// If your version exposes different names: import * as vosk from 'vosk-browser';

type PartialCb = (text: string) => void
type FinalCb = (text: string) => void

let recognizer: VoskRecognizer | null = null
let audioStream: MediaStream | null = null
let mediaNode: MediaStreamAudioSourceNode | null = null
let audioCtx: AudioContext | null = null
let initializing = false

const isReady = ref(false)
const isListening = ref(false)
const lang = 'tl-PH' // Filipino; you’ll still load the Filipino model via path below

// Optional small grammar bias for field prompts / common words (Cebuano & Filipino mix)
const HINTS = [
  'oo','hindi','wala','meron','tama','mali','sige','next','sunod','back','balik','ulitin','uliton',
  // numbers & common slots:
  'isa','dalawa','tatlo','apat','lima','anim','pito','walo','siyam','sampu',
  // months, typical address parts, etc.:
  'enero','pebrero','marso','abril','mayo','hunyo','hulyo','agosto','setyembre','oktubre','nobyembre','disyembre',
  'barangay','purok','butuan','agusan','caraga'
]

export function useVoskFilipino() {
  async function init(modelPath = '/models/tl') {
    if (isReady.value || initializing) return
    initializing = true

    // 1) Load WASM + model
    // VoskRecognizer can accept a model URL/path. Some builds use worker; check your installed API.
    recognizer = await VoskRecognizer.create({
      modelUrl: modelPath,           // served from public/models/tl
      sampleRate: 16000,             // Vosk expects 8k/16k; we’ll resample below
      grammar: HINTS                 // simple bias; optional
    })

    isReady.value = true
    initializing = false
  }

  async function startListening(onPartial?: PartialCb, onFinal?: FinalCb) {
    if (!isReady.value || isListening.value) return

    // 2) Get mic
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 })
    mediaNode = audioCtx.createMediaStreamSource(audioStream)

    // 3) Pipe audio to recognizer
    await recognizer!.start()
    isListening.value = true

    // Minimal processor (AudioWorklet or ScriptProcessor). For simplicity, use ScriptProcessor here.
    const proc = audioCtx.createScriptProcessor(4096, 1, 1)
    mediaNode.connect(proc)
    proc.connect(audioCtx.destination)

    proc.onaudioprocess = async (e) => {
      if (!isListening.value) return
      const inputData = e.inputBuffer.getChannelData(0)
      // Push raw float data to recognizer
      const result = await recognizer!.acceptWaveform(inputData)
      // result: { partial?: string, text?: string, result?: ... } depending on lib version
      if (result?.partial && onPartial) onPartial(result.partial)
      if (result?.text && result.text.trim().length) {
        if (onFinal) onFinal(result.text.trim())
      }
    }
  }

  async function stopListening() {
    isListening.value = false
    try {
      await recognizer?.stop()
      mediaNode?.disconnect()
      audioCtx?.close()
    } catch {}
    audioStream?.getTracks().forEach(t => t.stop())
    mediaNode = null
    audioCtx = null
    audioStream = null
  }

  return {
    init,
    startListening,
    stopListening,
    isReady,
    isListening,
    lang
  }
}
