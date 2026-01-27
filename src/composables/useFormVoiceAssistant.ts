// src/composables/useFormVoiceAssistant.ts
import { ref, computed, nextTick } from 'vue'
import { useUnifiedTTS } from '@/composables/useUnifiedTTS'
import { useUnifiedSTT } from '@/composables/useUnifiedSTT'

type FormFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'multiselect'

export type VoiceAssistMode =
  | 'idle'
  | 'intro'
  | 'ask_field'
  | 'listening'
  | 'confirming'
  | 'spelling'
  | 'done'

type Choice = { label: string; value: any }

export type VoiceAssistField = {
  id: string
  label: string
  field_key: string
  field_type: FormFieldType
  required: boolean
  options?: any
}

type Params = {
  // supply already-filtered + sorted fields (your visibleFields)
stt: ReturnType<typeof useUnifiedSTT>
  fields: () => VoiceAssistField[]
  answers: Record<string, any>

  // UI hooks
  onOpenModal: () => void
  onCloseModal: () => void

  // modal state setters
  setModalTitle: (t: string) => void
  setModalMessage: (t: string) => void
  setModalPreview: (t: string) => void
  setModalMode: (m: 'listening' | 'confirm' | 'spelling' | 'finish') => void

  // finish action
  onSubmit: () => Promise<void>
  onGoSubmitList: () => void
}

function normalize(s: string) {
  return (s || '')
    .toLowerCase()
    .replace(/[.,!?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function pickFromChoices(text: string, choices: Choice[]) {
  const n = normalize(text)
  // try label match
  const byLabel = choices.find((c) => normalize(c.label) === n)
  if (byLabel) return byLabel.value

  // contains label
  const contains = choices.find((c) => n.includes(normalize(c.label)))
  if (contains) return contains.value

  // contains value
  const byValue = choices.find((c) => n.includes(String(c.value).toLowerCase()))
  if (byValue) return byValue.value

  return null
}

function extractDigits(text: string) {
  const m = (text || '').match(/\d+/g)
  return m ? m.join('') : ''
}

// super-basic date parser (v1):
// Accept: "01/27/2026", "1 27 2026", "January 27 2026"
function parseDateToISO(text: string): string | null {
  const raw = normalize(text)

  // mm/dd/yyyy
  const m1 = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/)
  if (m1) {
    const mm = String(m1[1]).padStart(2, '0')
    const dd = String(m1[2]).padStart(2, '0')
    const yyyy = m1[3].length === 2 ? `20${m1[3]}` : m1[3]
    return `${yyyy}-${mm}-${dd}`
  }

  // "mm dd yyyy" digits
  const nums = raw.match(/\d+/g)
  if (nums && nums.length >= 3) {
    const mm = String(nums[0]).padStart(2, '0')
    const dd = String(nums[1]).padStart(2, '0')
    const yyyy = nums[2].length === 2 ? `20${nums[2]}` : nums[2]
    return `${yyyy}-${mm}-${dd}`
  }

  // month name
  const months: Record<string, string> = {
    january: '01',
    february: '02',
    march: '03',
    april: '04',
    may: '05',
    june: '06',
    july: '07',
    august: '08',
    september: '09',
    october: '10',
    november: '11',
    december: '12',
  }
  const parts = raw.split(' ')
  const monthIdx = parts.findIndex((p) => months[p])
  if (monthIdx >= 0) {
    const mm = months[parts[monthIdx]]
    const dd = parts[monthIdx + 1] ? String(extractDigits(parts[monthIdx + 1])).padStart(2, '0') : ''
    const yyyy = parts[monthIdx + 2] ? extractDigits(parts[monthIdx + 2]) : ''
    if (mm && dd && yyyy.length >= 4) return `${yyyy}-${mm}-${dd}`
  }

  return null
}

// spelling: map common spoken letters
function parseSpelledLetters(text: string): string {
  const n = normalize(text)
  if (!n) return ''

  const map: Record<string, string> = {
    a: 'A', ay: 'A',
    b: 'B', bee: 'B',
    c: 'C', see: 'C',
    d: 'D', dee: 'D',
    e: 'E', ee: 'E',
    f: 'F', ef: 'F',
    g: 'G', jee: 'G', gee: 'G',
    h: 'H', aitch: 'H', eyts: 'H',
    i: 'I', eye: 'I',
    j: 'J', jay: 'J',
    k: 'K', kay: 'K',
    l: 'L', el: 'L',
    m: 'M', em: 'M',
    n: 'N', en: 'N',
    o: 'O', oh: 'O',
    p: 'P', pee: 'P',
    q: 'Q', cue: 'Q', kyoo: 'Q',
    r: 'R', ar: 'R',
    s: 'S', es: 'S',
    t: 'T', tee: 'T',
    u: 'U', you: 'U', yu: 'U',
    v: 'V', vee: 'V',
    w: 'W', doubleyou: 'W',
    x: 'X', ex: 'X',
    y: 'Y', why: 'Y',
    z: 'Z', zee: 'Z', zed: 'Z',

    // allow “space”
    space: ' ',
    hyphen: '-',
    dash: '-',
  }

  const tokens = n.split(' ')
  let out = ''
  for (const tok of tokens) {
    if (map[tok]) out += map[tok]
    else if (tok.length === 1 && /^[a-z]$/.test(tok)) out += tok.toUpperCase()
  }
  return out
}

export function useFormVoiceAssistant(p: Params) {
  const { speak, stop: stopTTS } = useUnifiedTTS()
  const stt = p.stt

  const mode = ref<VoiceAssistMode>('idle')
  const active = computed(() => mode.value !== 'idle')

  const fieldIndex = ref(0)
  const currentField = computed(() => p.fields()[fieldIndex.value] ?? null)

  const pendingTranscript = ref('')
  const spellingBuffer = ref('')

  const stopAll = async () => {
    try {
      stt.autoRestart.value = false
      stt.stop()
    } catch {}
    try {
      await stopTTS()
    } catch {}
    mode.value = 'idle'
    pendingTranscript.value = ''
    spellingBuffer.value = ''
    p.onCloseModal()
  }

  const askCurrentField = async () => {
    const f = currentField.value
    if (!f) {
      mode.value = 'done'
      p.setModalMode('finish')
      p.setModalTitle('All done')
      p.setModalMessage('Finish now?')
      p.setModalPreview('')
      p.onOpenModal()
      await speak('All done. Finish now?')
      return
    }

    // Skip asking Age if you want, since your UI auto-computes from birthdate
    if (f.field_key === 'age') {
      fieldIndex.value++
      return askCurrentField()
    }

    mode.value = 'ask_field'

    // Build question prompt
    const label = f.label
    let prompt = `What is your ${label}?`
    if (f.field_type === 'select' || f.field_type === 'radio' || f.field_type === 'multiselect') {
      const choices: Choice[] = (f.options?.choices ?? []) as any
      if (choices.length) {
        const choiceText = choices.map((c) => c.label).join(', ')
        prompt = `${label}. Your choices are: ${choiceText}.`
      } else {
        prompt = `Please choose for: ${label}.`
      }
    }
    if (f.field_type === 'date') {
      prompt = `${label}. Please say the date like month day year. For example: January 27 2026.`
    }

    p.setModalMode('listening')
    p.setModalTitle('Listening…')
    p.setModalMessage(label)
    p.setModalPreview('')
    p.onOpenModal()

    await speak(prompt)

    // start listening
    mode.value = 'listening'
    pendingTranscript.value = ''
    stt.clear()
    stt.autoRestart.value = false // we want single answer per field
    stt.start()
  }

  // Call this from UI when user taps "Stop" inside listening UI
  const stopListening = () => {
    try {
      stt.autoRestart.value = false
      stt.stop()
    } catch {}
  }

  // We will poll finalTranscript changes from the page (watch)
  const onFinalTranscript = async (text: string) => {
    if (mode.value !== 'listening' && mode.value !== 'spelling') return
    const f = currentField.value
    if (!f) return
    const t = (text || '').trim()
    if (!t) return

    if (mode.value === 'spelling') {
      const letters = parseSpelledLetters(t)
      if (letters) {
        spellingBuffer.value = (spellingBuffer.value + letters).replace(/\s{2,}/g, ' ')
        p.setModalPreview(spellingBuffer.value)
      }
      return
    }

    // Normal (non-spelling) capture
    pendingTranscript.value = t

    p.setModalMode('confirm')
    p.setModalTitle('Is this correct?')
    p.setModalMessage(f.label)
    p.setModalPreview(pendingTranscript.value)
    mode.value = 'confirming'

    await speak(`I heard: ${pendingTranscript.value}. Is this correct?`)
    stopListening()
  }

  const confirmYes = async () => {
    const f = currentField.value
    if (!f) return

    let value: any = pendingTranscript.value

    if (f.field_type === 'number') {
      const digits = extractDigits(pendingTranscript.value)
      if (!digits) {
        await speak('Sorry, I did not hear a number. Please try again.')
        return askCurrentField()
      }
      value = Number(digits)
    }

    if (f.field_type === 'date') {
      const iso = parseDateToISO(pendingTranscript.value)
      if (!iso) {
        await speak('Sorry, I could not understand the date. Please try again.')
        return askCurrentField()
      }
      value = iso
    }

    if (f.field_type === 'select' || f.field_type === 'radio') {
      const choices: Choice[] = (f.options?.choices ?? []) as any
      const picked = pickFromChoices(pendingTranscript.value, choices)
      if (picked === null) {
        await speak('Sorry, please choose one of the options. Let us try again.')
        return askCurrentField()
      }
      value = picked
    }

    if (f.field_type === 'multiselect') {
      // v1: accept "done" to finish multiselect; otherwise add one choice at a time
      const n = normalize(pendingTranscript.value)
      if (n.includes('done') || n.includes('tapos') || n.includes('human')) {
        fieldIndex.value++
        p.onCloseModal()
        return askCurrentField()
      }

      const choices: Choice[] = (f.options?.choices ?? []) as any
      const picked = pickFromChoices(pendingTranscript.value, choices)
      if (picked === null) {
        await speak('Sorry, I did not match that choice. Please say one option, or say done.')
        mode.value = 'listening'
        stt.clear()
        stt.start()
        return
      }

      const arr = Array.isArray(p.answers[f.field_key]) ? p.answers[f.field_key] : []
      if (!arr.includes(picked)) arr.push(picked)
      p.answers[f.field_key] = arr

      // continue listening for more items
      await speak('Added. Say another option, or say done.')
      mode.value = 'listening'
      pendingTranscript.value = ''
      stt.clear()
      stt.start()
      return
    }

    // set answer
    p.answers[f.field_key] = value

    // next
    pendingTranscript.value = ''
    fieldIndex.value++
    p.onCloseModal()
    await nextTick()
    return askCurrentField()
  }

  const confirmNo = async () => {
    // go to spelling flow (for text-like fields only)
    const f = currentField.value
    if (!f) return

    // For select/radio/date/number, re-ask instead of spelling
    if (f.field_type === 'select' || f.field_type === 'radio' || f.field_type === 'date' || f.field_type === 'number') {
      await speak('Okay. Let us try again.')
      return askCurrentField()
    }

    spellingBuffer.value = ''
    p.setModalMode('spelling')
    p.setModalTitle('Spell it')
    p.setModalMessage('Say letters one by one. Tap Stop Spelling when finished.')
    p.setModalPreview('')
    mode.value = 'spelling'

    await speak('Okay. Spell the word please. Say letters one by one.')
    stt.clear()
    stt.autoRestart.value = true // keep catching letters
    stt.start()
  }

  const stopSpelling = async () => {
    stopListening()

    // ask confirm for spellingBuffer
    pendingTranscript.value = spellingBuffer.value.trim()

    p.setModalMode('confirm')
    p.setModalTitle('Is this correct?')
    p.setModalMessage(currentField.value?.label ?? '')
    p.setModalPreview(pendingTranscript.value)
    mode.value = 'confirming'

    await speak(`I got: ${pendingTranscript.value}. Is this correct?`)
  }

  const start = async () => {
    if (active.value) return
    mode.value = 'intro'
    fieldIndex.value = 0
    pendingTranscript.value = ''
    spellingBuffer.value = ''

    p.onOpenModal()
    p.setModalMode('listening')
    p.setModalTitle('Voice Assist')
    p.setModalMessage('Starting…')
    p.setModalPreview('')

    await speak('Hello. We will now answer the form. You can tap and not type anymore.')
    return askCurrentField()
  }

  const finishYes = async () => {
    await speak('Submitting now.')
    await p.onSubmit()
    p.onGoSubmitList()
  }

  const finishNo = async () => {
    await speak('Okay. You can review first, then press Finish anytime.')
    await stopTTS()
    mode.value = 'idle'
    p.onCloseModal()
  }

  return {
    mode,
    active,
    currentField,
    pendingTranscript,
    spellingBuffer,

    start,
    stopAll,

    onFinalTranscript,

    confirmYes,
    confirmNo,
    stopSpelling,

    stopListening,

    finishYes,
    finishNo,
  }
}
