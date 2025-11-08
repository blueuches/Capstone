// utils/answers.ts
export type AnswerRow = {
  field_id: number
  label: string
  type: string | null
  value_fmt: string
  raw: string | null
}

export function buildAnswerMap(rows: AnswerRow[]) {
  const map: Record<string, string> = {}
  for (const r of rows) {
    // prefer formatted; fall back to raw
    map[r.label] = (r.value_fmt ?? r.raw ?? '').toString()
  }
  return map
}
