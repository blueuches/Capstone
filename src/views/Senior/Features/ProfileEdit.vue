<!-- src/pages/ProfileEdit.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
    <!-- Top bar -->
    <header class="sticky top-0 z-30 bg-emerald-600 text-white shadow">
      <div class="px-4 py-3 flex items-center justify-between">
        <button @click="goBack" aria-label="Back"
          class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="px-4 py-1.5 rounded-xl bg-emerald-500 font-semibold text-sm sm:text-base">
          Edit Profile
        </div>
        <span class="w-8 h-8" />
      </div>
    </header>

    <main class="flex-1 px-4 pb-20">
      <form @submit.prevent="save" class="max-w-xl mx-auto mt-4 space-y-8">
        <!-- Account -->
        <section class="bg-white rounded-2xl shadow-sm ring-1 ring-emerald-100 p-5">
          <h2 class="section-title">ACCOUNT</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">Full Name</label>
              <input v-model.trim="form.full_name" type="text" class="input" placeholder="e.g., Juan C. Dela Cruz" />
            </div>
            <div>
              <label class="label">Phone</label>
              <input v-model.trim="form.phone" type="tel" class="input" placeholder="09xx-xxx-xxxx" />
            </div>
            <div class="sm:col-span-2">
              <label class="label">Email (read-only)</label>
              <input :value="email" disabled class="input bg-gray-50" />
            </div>
          </div>
        </section>

        <!-- Senior Details -->
        <section class="bg-white rounded-2xl shadow-sm ring-1 ring-emerald-100 p-5">
          <h2 class="section-title">SENIOR DETAILS</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">OSCA ID</label>
              <input v-model.trim="form.osca_id" type="text" class="input" placeholder="SC-XXXXXXX" />
            </div>
            <div>
              <label class="label">RRN</label>
              <input v-model.trim="form.rrn" type="text" class="input" placeholder="Registry Reference No." />
            </div>
            <div>
              <label class="label">Birthdate</label>
              <input v-model="form.birthdate" type="date" class="input"   :min="'1900-01-01'"  :max="todayISO"          />
            </div>
            <div>
              <label class="label">Sex</label>
              <select v-model="form.sex" class="input">
                <option value="" disabled>Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Address -->
        <section class="bg-white rounded-2xl shadow-sm ring-1 ring-emerald-100 p-5">
          <h2 class="section-title">ADDRESS</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">House / Purok</label>
              <input v-model.trim="form.house_no" type="text" class="input" placeholder="e.g., P-7" />
            </div>
            <div>
              <label class="label">Street</label>
              <input v-model.trim="form.street" type="text" class="input" placeholder="e.g., De Oro St." />
            </div>
            <div>
              <label class="label">City</label>
              <input v-model.trim="form.city" type="text" class="input" placeholder="Butuan" />
            </div>
            <div>
              <label class="label">Province</label>
              <input v-model.trim="form.province" type="text" class="input" placeholder="Agusan del Norte" />
            </div>
            <div>
              <label class="label">ZIP</label>
              <input v-model.trim="form.zip" type="text" class="input" placeholder="8600" />
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Barangay linking can be added later. For now, type your address fields.
          </p>
        </section>

        <!-- Actions -->
        <div class="flex items-center justify-between">
          <button type="button" @click="goBack"
            class="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" :disabled="saving"
            class="px-5 py-2 rounded-full bg-emerald-700 text-white font-semibold shadow hover:bg-emerald-800 disabled:opacity-60">
            <span v-if="saving">Saving…</span>
            <span v-else>Save Changes</span>
          </button>
        </div>

        <!-- Toasts -->
        <p v-if="toast.message" :class="['mt-2 text-sm', toast.ok ? 'text-emerald-700' : 'text-red-600']">
          {{ toast.message }}
        </p>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user } = useAuth()

const email = computed(() => user.value?.email ?? '')

const toast = reactive<{ message: string; ok: boolean }>({ message: '', ok: true })
function showToast(message: string, ok = true) {
  toast.message = message; toast.ok = ok
  setTimeout(() => (toast.message = ''), 3500)
}

// helpers for the date input
function toLocalISODate(d = new Date()) {
  const off = d.getTimezoneOffset()
  const local = new Date(d.getTime() - off * 60000)
  return local.toISOString().slice(0, 10) // YYYY-MM-DD
}
const todayISO = toLocalISODate()

function asISODateOnly(v: any) {
  if (!v) return ''
  const m = String(v).match(/^(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : ''
}

const form = reactive({
  // Users
  full_name: '',
  phone: '',
  // SeniorCitizens
  osca_id: '',
  rrn: '',
  birthdate: '' as string | '',
  sex: '' as 'male' | 'female' | 'other' | '' ,
  house_no: '',
  street: '',
  city: '',
  province: '',
  zip: ''
})

const saving = ref(false)

function goBack() { router.back() }

onMounted(async () => {
  if (!user.value?.id) return

  const { data, error } = await supabase
    .from('SeniorProfiles_v1')
    .select('*')
    .eq('user_id', user.value.id)
    .maybeSingle()

  if (error) {
    showToast('Could not load profile.', false)
    return
  }

  if (data) {
    form.full_name = data.full_name ?? ''
    form.phone     = data.phone ?? ''
    form.osca_id   = data.osca_id ?? ''
    form.rrn       = data.rrn ?? ''
    form.birthdate = asISODateOnly(data.birthdate)  // ✅ use helper here
    form.sex       = data.sex ?? ''
    form.house_no  = data.house_no ?? ''
    form.street    = data.street ?? ''
    form.city      = data.city ?? ''
    form.province  = data.province ?? ''
    form.zip       = data.zip ?? ''
  }
})

async function save() {
  if (!user.value?.id) return
  saving.value = true
  try {
    // optional local validation
    if (form.birthdate && form.birthdate > todayISO) {
      showToast('Birthdate cannot be in the future.', false)
      saving.value = false
      return
    }

    // 1) Update Users
    const usersUpdate: any = {
      full_name: form.full_name || null,
      phone: form.phone || null
    }
    const { error: uErr } = await supabase
      .from('Users')
      .update(usersUpdate)
      .eq('user_id', user.value.id)
    if (uErr) throw uErr

    // 2) Upsert SeniorCitizens by user_id
    const seniorsPayload: any = {
      user_id: user.value.id,
      osca_id: form.osca_id || null,
      rrn: form.rrn || null,
      birthdate: form.birthdate || null,
      sex: form.sex || null,
      house_no: form.house_no || null,
      street: form.street || null,
      city: form.city || null,
      province: form.province || null,
      zip: form.zip || null
    }

    const { error: sErr } = await supabase
      .from('SeniorCitizens')
      .upsert(seniorsPayload, { onConflict: 'user_id' })
    if (sErr) throw sErr

    showToast('Profile saved!', true)
  } catch (e) {
    console.error(e)
    showToast('Save failed. Please try again.', false)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.section-title{
  @apply text-xs font-semibold tracking-widest text-emerald-900 mb-4;
}
.label { @apply block text-xs font-semibold tracking-widest text-emerald-900 mb-1; }
.input {
  @apply w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm
         focus:outline-none focus:ring-2 focus:ring-emerald-400;
}
</style>
