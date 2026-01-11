export type RasaEntity = { entity: string; value: any; start?: number; end?: number }
export type RasaParse = {
  text: string
  intent: { name: string; confidence: number }
  entities: RasaEntity[]
}

const RASA_URL = import.meta.env.VITE_RASA_URL || 'http://localhost:5005'

export async function parseWithRasa(text: string): Promise<RasaParse | null> {
  try {
    const res = await fetch(`${RASA_URL}/model/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
