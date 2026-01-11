// src/composables/useSeniorFontSize.ts
import { ref, readonly, watch } from 'vue'

const MIN_SCALE = 0.9       // slight smaller (optional)
const MAX_SCALE = 1.4       // larger for seniors
const STEP = 0.1

// ✅ module-level ref = shared across ALL components that import this composable
const fontScale = ref<number>(
  Number(localStorage.getItem('senior-font-scale') || '1') || 1
)

// Apply to CSS variable on load
document.documentElement.style.setProperty(
  '--senior-font-scale',
  fontScale.value.toString()
)

// Persist + push to CSS var whenever it changes
watch(fontScale, (value) => {
  localStorage.setItem('senior-font-scale', String(value))
  document.documentElement.style.setProperty(
    '--senior-font-scale',
    value.toString()
  )
})

function increaseFont() {
  if (fontScale.value < MAX_SCALE) {
    fontScale.value = parseFloat((fontScale.value + STEP).toFixed(2))
  }
}

function decreaseFont() {
  if (fontScale.value > MIN_SCALE) {
    fontScale.value = parseFloat((fontScale.value - STEP).toFixed(2))
  }
}

function resetFont() {
  fontScale.value = 1
}

export function useSeniorFontSize() {
  return {
    fontScale: readonly(fontScale),
    increaseFont,
    decreaseFont,
    resetFont,
  }
}
