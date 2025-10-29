<!-- src/pages/ApplyRequest.vue -->
<template>
  <div class="relative min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white overflow-hidden">
    <!-- 🔹 Top Header -->
    <header class="sticky top-0 z-50 bg-emerald-50/90 backdrop-blur-sm border-b border-emerald-100">
      <SeniorHeader @toggle-sidebar="toggleSidebar" />
    </header>

    <!-- 🔹 Sidebar Overlay (background dim) -->
    <transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-40 bg-black/30 lg:hidden"
        @click="toggleSidebar"
      ></div>
    </transition>

    <!-- 🔹 Sidebar Menu (slides in) -->
    <transition name="slide">
      <aside
        v-if="sidebarOpen"
        class="fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl ring-1 ring-emerald-100 p-4 flex flex-col space-y-4 lg:hidden"
      >
        <div class="flex justify-between items-center border-b pb-2">
          <h2 class="font-semibold text-emerald-700">Menu</h2>
          <button @click="toggleSidebar" class="text-emerald-700 text-lg">✕</button>
        </div>

        <nav class="flex flex-col space-y-3">
          <router-link to="/senior/dashboard" class="text-emerald-700 hover:text-emerald-900">Dashboard</router-link>
          <router-link to="/senior/profile" class="text-emerald-700 hover:text-emerald-900">Profile</router-link>
          <router-link to="/senior/requirements" class="text-emerald-700 hover:text-emerald-900">My Requirements</router-link>
          <router-link to="/logout" class="text-red-600 font-semibold hover:text-red-700">Log out</router-link>
        </nav>
      </aside>
    </transition>

    <!-- 🔹 Main Content -->
    <main class="flex-1 w-full max-w-3xl mx-auto p-4 space-y-4">
      <!-- Program card -->
      <section class="bg-white rounded-2xl shadow p-4 ring-1 ring-emerald-100">
        <h2 class="text-xl font-semibold text-emerald-800">{{ program?.name || program?.title }}</h2>
        <p class="text-sm text-gray-700 mt-1 whitespace-pre-line">{{ program?.description }}</p>

        <div class="mt-3">
          <h3 class="text-sm font-semibold text-emerald-800">Process (short)</h3>
          <p class="text-sm text-gray-700 whitespace-pre-line">
            {{ (program?.process || '').split('\n').slice(0,3).join('\n') }}
          </p>
        </div>
      </section>

      <!-- Requirements + upload -->
      <section class="bg-white rounded-2xl shadow p-4 ring-1 ring-emerald-100">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <h3 class="text-base font-semibold text-emerald-800">Requirements</h3>
          <span v-if="requestId" class="text-xs text-gray-500">Request #{{ requestId }}</span>
        </div>

        <div v-if="loading" class="text-sm text-gray-600 mt-2">Loading…</div>
        <div v-else-if="!program?.requirements?.length" class="text-sm text-gray-500 mt-2">
          No specific requirements listed for this program.
        </div>

        <div v-else class="mt-2 space-y-2">
          <div
            v-for="(req, i) in program.requirements"
            :key="i"
            class="border rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div class="flex-1">
              <p class="font-medium text-emerald-900">{{ req }}</p>
              <p class="text-sm" v-if="uploads[req]">📎 File uploaded</p>
              <p class="text-sm text-red-700" v-else>⚠️ No file yet</p>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                v-if="uploads[req]"
                class="px-3 py-1 rounded-lg bg-gray-100 text-sm"
                @click="openFile(uploads[req])"
              >Open</button>

              <label class="px-3 py-1 rounded-lg bg-emerald-600 text-white text-sm cursor-pointer">
                <input
                  type="file"
                  class="hidden"
                  :disabled="busyKind===req"
                  @change="(e:any)=>onUpload(req, e.target.files?.[0])"
                >
                {{ busyKind===req ? 'Uploading…' : (uploads[req] ? 'Replace' : 'Upload') }}
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA buttons -->
      <section class="flex items-center gap-3">
        <router-link
          to="/senior/dashboard"
          class="px-4 py-3 rounded-2xl bg-emerald-100 text-emerald-700 font-medium w-full sm:w-auto text-center"
        >
          Back
        </router-link>

<button
  @click="continueToForm"
  class="ml-auto px-4 py-3 rounded-2xl bg-emerald-600 text-white font-semibold w-full sm:w-auto"
  :disabled="loading || !(variantId ? program?.program_id : programId)"
>
  Continue to form
</button>

      </section>

      <!-- Accessibility: optional TTS cue -->
      <p class="sr-only" aria-live="polite">{{ ariaHint }}</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabase/client'  
import SeniorHeader from '@/components/SeniorHeader.vue'
import SeniorNav from '@/components/SeniorNav.vue'

const route = useRoute()
const router = useRouter()
const programId = Number(route.params.programId)

const loading = ref(true)
const program = ref<any>(null)
const requestId = ref<number | null>(null)
const uploads = ref<Record<string, any>>({})  // track uploaded files per requirement
const busyKind = ref<string | null>(null)
const ariaHint = ref('')
const variantId = Number(route.params.variantId || 0)


const sidebarOpen = ref(false)
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

onMounted(init)

async function init() {
  loading.value = true

  if (variantId) {
    // Fetch ProgramVariant instead
    const { data: v, error: vErr } = await supabase
      .from('ProgramVariants')
      .select('id, name, description, process, requirements, program_id')
      .eq('id', variantId)
      .single()

    if (vErr) {
      alert('Failed to load variant')
      loading.value = false
      return
    }
    program.value = v
  } else {
    // fallback to base program
    const { data: p, error: pErr } = await supabase
      .from('Programs')
      .select('id, name, description, process, requirements')
      .eq('id', programId)
      .single()
    if (pErr) {
      alert('Failed to load program')
      loading.value = false
      return
    }
    program.value = p
  }

  // Create draft request
  const { data: reqId, error } = await supabase.rpc('ensure_draft_request', {
    p_program_id: programId,
  })
  if (error) {
    alert(error.message)
    loading.value = false
    return
  }
  requestId.value = reqId
  loading.value = false
}

function storagePublicURLFromPath(path: string) {
  return `${import.meta.env.VITE_SB_URL}/storage/v1/object/public/requirements/${path.replace(/^requirements\//, '')}`
}

function openFile(path: string) {
  window.open(storagePublicURLFromPath(path), '_blank')
}

function buildStoragePath(filename: string, kind: string) {
  return `requirements/${requestId.value}/${kind}_${Date.now()}_${filename}`
}

async function onUpload(reqLabel: string, file?: File) {
  if (!file || !requestId.value) return
  busyKind.value = reqLabel

  try {
    const fullPath = buildStoragePath(file.name, reqLabel)
    const { error: upErr } = await supabase.storage
      .from('requirements')
      .upload(fullPath, file, { upsert: true })
    if (upErr) throw upErr

    const enumKind = mapDocKind(reqLabel)

    // Update the row seeded for this label (set enum + file)
    const { error: saveErr } = await supabase
      .from('RequestDocuments')
      .update({
        kind: enumKind,                // valid enum now
        file_path: fullPath,
        uploaded_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .eq('request_id', requestId.value)
      .eq('label', reqLabel)          // match the seeded row by label
    if (saveErr) throw saveErr

    uploads.value[reqLabel] = fullPath
    speak(`${reqLabel} uploaded`)
  } catch (e: any) {
    alert(e.message || String(e))
  } finally {
    busyKind.value = null
  }
}


function continueToForm() {
  // If this page was opened via a ProgramVariant, use its parent program_id
  const pid = variantId
    ? Number(program.value?.program_id)   // variant → parent program
    : Number(programId)                   // base program

  if (!Number.isFinite(pid)) {
    alert('Program not ready yet. Please try again in a moment.')
    return
  }

  router.push({ name: 'form-page', params: { programId: pid } })
}


/* Accessibility: simple web TTS */
function speak(text: string) {
  ariaHint.value = text
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(u)
  }
}

// Minimal mapper: expand rules as needed
function mapDocKind(label: string):
  'id_photo' | 'selfie' | 'birth_cert' | 'marriage_cert' | 'death_cert' |
  'barangay_cert' | 'medical_cert' | 'proof_of_addr' | 'others' {
  const s = (label || '').toLowerCase();

  if (s.includes('barangay') && s.includes('cert')) return 'barangay_cert';
  if (s.includes('registered death') || s.includes('death cert')) return 'death_cert';

  if (s.includes('proof of relationship')) {
    // choose one, or upload twice—your call:
    return 'marriage_cert'; // or 'birth_cert'
  }
  if (s.includes('marriage cert')) return 'marriage_cert';
  if (s.includes('birth cert'))    return 'birth_cert';

  if (s.includes('proof of address') || s.includes('residence') || s.includes('utility bill') || s.includes('billing'))
    return 'proof_of_addr';

  if (s.includes('medical cert') || s.includes('medical certificate'))
    return 'medical_cert';

  if (s.includes('selfie')) return 'selfie';
  if (s.includes('id') && s.includes('photo')) return 'id_photo';

  // OSCA ID / referral / SPA / CSWD etc. not in enum → others
  return 'others';
}

</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* ✅ Slide animation for sidebar */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}

/* Optional: smooth scroll and spacing */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>



