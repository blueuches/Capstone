import { ref, onMounted, onUnmounted } from 'vue'

const STORAGE_KEY = 'senior_font_scale'

// tweak these if you want
const BASE_PX = 16
const MIN_SCALE = 0.85
const MAX_SCALE = 1.35
const STEP = 0.05

const scale = ref<number>(1)

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function applyToRoot() {
  // This makes Tailwind rem-based sizes scale everywhere
  const px = BASE_PX * scale.value
  document.documentElement.style.fontSize = `${px}px`
}

function resetRoot() {
  document.documentElement.style.fontSize = `${BASE_PX}px`
}

function load() {
  const raw = localStorage.getItem(STORAGE_KEY)
  const parsed = raw ? Number(raw) : 1
  scale.value = Number.isFinite(parsed) ? clamp(parsed, MIN_SCALE, MAX_SCALE) : 1
}

function save() {
  localStorage.setItem(STORAGE_KEY, String(scale.value))
}

export function useSeniorFontSize() {
  const increaseFont = () => {
    scale.value = clamp(Number((scale.value + STEP).toFixed(2)), MIN_SCALE, MAX_SCALE)
    save()
    applyToRoot()
  }

  const decreaseFont = () => {
    scale.value = clamp(Number((scale.value - STEP).toFixed(2)), MIN_SCALE, MAX_SCALE)
    save()
    applyToRoot()
  }

  onMounted(() => {
    // When you enter Senior pages (BottomNav exists), load + apply
    load()
    applyToRoot()
  })

  onUnmounted(() => {
    // When you leave Senior pages (BottomNav disappears), reset to normal
    resetRoot()
  })

  return {
    scale,
    increaseFont,
    decreaseFont,
    applyToRoot,
    resetRoot,
  }
}
