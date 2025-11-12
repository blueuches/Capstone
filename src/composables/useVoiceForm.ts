import { ref, nextTick } from 'vue'
import { useVoskFilipino } from './useVoskFilipino'
import { parseWithRasa } from './useRasa'
import { speak } from '@/composables/useTTS' // adjust to your actual path

type DynField = {
  id: number | string
  label: string
  name?: string
  type?: string
  required?: boolean
  visible?: boolean
}

type FormModel = Record<string, any>

const COMMANDS = {
  NEXT: ['next','sunod','sige'],
  BACK: ['back','balik'],
  REDO: ['ulitin','uliton','ulit','mali'],
  DONE: ['tapos na','done','finish','submit']
}

export function useVoiceForm() {
  const { init, startListening, stopListening, isReady, isListening } = useVoskFilipino()
  const activeIndex = ref<number>(0)
  const partial = ref('')
  const lastFinal = ref('')
  const running = ref(false)

  function normalizeFieldKey(f: DynField) {
    return (f.name || f.label || '').toLowerCase().trim()
  }

  function findFieldKey(fields: DynField[], entityName: string) {
    const key = entityName.toLowerCase()
    // Try match entity → field label/name
    return fields.findIndex(f => normalizeFieldKey(f).includes(key))
  }

  function tryCommands(t: string): keyof typeof COMMANDS | null {
    const low = t.toLowerCase()
    for (const k of Object.keys(COMMANDS) as (keyof typeof COMMANDS)[]) {
      if (COMMANDS[k].some(w => low.includes(w))) return k
    }
    return null
  }

  async function confirmAndAdvance(value: string, field: DynField, model: FormModel) {
    // Write into model by name or label key
    const key = field.name || field.label
    if (key) model[key] = value

    await speak(`Okay. ${field.label}: ${value}. Sige, susunod tayo.`,'fil-PH')
    activeIndex.value++
  }

  async function run(fields: DynField[], model: FormModel) {
    if (running.value) return
    running.value = true
    await init('/models/tl') // Filipino model path

    // Ensure we start at first visible field
    const visible = fields.filter(f => f.visible !== false)
    activeIndex.value = 0

    while (activeIndex.value < visible.length) {
      const field = visible[activeIndex.value]

      // 1) TTS prompt
      await speak(`Paki sagot: ${field.label}.`, 'fil-PH')

      // 2) Listen once per field (stop on first final or command)
      await new Promise<void>((resolve) => {
        startListening(
          (p) => { partial.value = p || '' },
          async (finalText) => {
            lastFinal.value = finalText

            // Commands?
            const cmd = tryCommands(finalText)
            if (cmd === 'BACK') {
              await speak('Babalik tayo sa nakaraang tanong.','fil-PH')
              activeIndex.value = Math.max(0, activeIndex.value - 1)
              await stopListening()
              resolve()
              return
            }
            if (cmd === 'REDO') {
              await speak('Sige, uulitin natin ang tanong.','fil-PH')
              await stopListening()
              resolve()
              return
            }
            if (cmd === 'NEXT') {
              await speak('Sige, lilaktawan natin.','fil-PH')
              activeIndex.value++
              await stopListening()
              resolve()
              return
            }
            if (cmd === 'DONE') {
              await speak('Tapos na.','fil-PH')
              activeIndex.value = visible.length
              await stopListening()
              resolve()
              return
            }

            // 3) Send to Rasa
            const rasa = await parseWithRasa(finalText)

            // 4) Map entities → field or raw fill
            let value = finalText
            if (rasa?.entities?.length) {
              // Strategy A: entity named exactly the field (e.g., "address", "full_name")
              const hit = rasa.entities.find(e => normalizeFieldKey(field).includes(e.entity.toLowerCase()))
              if (hit && (hit.value ?? '') !== '') value = String(hit.value)

              // Strategy B: if entity says which field & separate value entity
              // e.g., entities: [{entity:'field',value:'address'}, {entity:'value',value:'Purok 3, Ampayon'}]
              const entField = rasa.entities.find(e => e.entity === 'field')
              const entValue = rasa.entities.find(e => e.entity === 'value')
              if (entField && entValue) {
                // If user said a different field out-of-order, drop it into that field
                const idx = findFieldKey(visible, String(entField.value))
                if (idx >= 0) {
                  const k = visible[idx].name || visible[idx].label
                  if (k) model[k] = String(entValue.value)
                  await speak(`Naunawaan ko. Nilagay ko sa ${visible[idx].label}: ${entValue.value}.`,'fil-PH')
                  // Stay on the current field to still capture it later
                  await stopListening()
                  resolve()
                  return
                }
              }
            }

            // 5) Confirm & advance
            await confirmAndAdvance(value, field, model)
            await stopListening()
            resolve()
          }
        )
      })

      // give the UI a tick between fields
      await nextTick()
    }

    running.value = false
    await speak('Nakompleto na ang form. Maaari mo na itong isumite.','fil-PH')
  }

  function cancel() {
    running.value = false
    stopListening()
  }

  return {
    run,
    cancel,
    isReady,
    isListening,
    activeIndex,
    partial,
    lastFinal,
    running
  }
}
