<!-- SeniorProfile.vue (polished to match mock) -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
    <!-- Top bar -->
    <header class="sticky top-0 z-30 bg-emerald-600 text-white shadow">
      <div class="px-4 py-3 flex items-center justify-between">
        <router-link
          to="/senior/dashboard"
          aria-label="Back"
          class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </router-link>

        <div class="px-4 py-1.5 rounded-xl bg-emerald-500 font-semibold text-sm sm:text-base">
          My Profile
        </div>

        <span class="w-8 h-8" />
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 px-4 pb-8">
      <!-- Head card -->
      <section class="max-w-md mx-auto -mt-4">
        <div class="bg-white rounded-2xl shadow-sm ring-1 ring-emerald-100 px-6 pt-8 pb-6 text-center">
          <div class="w-28 h-28 mx-auto rounded-full bg-emerald-100 border-4 border-white shadow-sm flex items-center justify-center">
            <!-- photo -->
            <img :src="photoUrl" @error="useInlinePlaceholder" alt="Profile photo"
                 class="w-full h-full rounded-full object-cover"/>
          </div>

          <h1 class="mt-4 text-xl sm:text-2xl font-extrabold text-emerald-800 leading-tight">
            {{ profile.fullName }}
          </h1>
          <p class="text-xs text-gray-500 mt-1">
            Senior Citizen ID: <span class="font-medium text-gray-600">{{ profile.oscaId }}</span>
          </p>

          <button
            type="button"
            @click="onEdit"
            class="mt-3 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold
                   bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Edit Profile
          </button>
        </div>
      </section>

      <!-- PERSONAL INFO -->
      <section class="max-w-md mx-auto mt-6">
        <h2 class="section-title">PERSONAL INFORMATION</h2>
        <div class="kv-card">
          <div class="kv-row">
            <span>Date Of Birth:</span>
            <span>{{ profile.dob }}</span>
          </div>
          <div class="kv-row">
            <span>Age:</span>
            <span>{{ profile.age }} years old</span>
          </div>
          <div class="kv-row">
            <span>Gender:</span>
            <span>{{ profile.sex }}</span>
          </div>
          <div class="kv-row">
            <span>Civil Status:</span>
            <span>{{ profile.civilStatus }}</span>
          </div>
        </div>
      </section>

      <!-- CONTACT INFO -->
      <section class="max-w-md mx-auto mt-6">
        <h2 class="section-title">CONTACT INFORMATION</h2>
        <div class="kv-card">
          <div class="kv-row">
            <span>Address:</span>
            <span class="text-right">{{ profile.address }}</span>
          </div>
          <div class="kv-row">
            <span>City:</span>
            <span>Butuan</span>
          </div>
          <div class="kv-row">
            <span>Phone:</span>
            <span>{{ profile.contact }}</span>
          </div>
          <div class="kv-row">
            <span>Email:</span>
            <span class="truncate max-w-[60%] text-emerald-700">{{ profile.email }}</span>
          </div>
        </div>
      </section>

      <!-- Logout -->
      <section class="max-w-md mx-auto mt-7">
        <router-link
          type="button"
          to="/logout"
          class="w-full sm:w-56 mx-auto block px-5 py-3 rounded-full bg-emerald-700 text-white font-semibold
                 shadow hover:bg-gray-800"
        >
          Log Out
        </router-link>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
const router = useRouter()

const INLINE_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <rect width="100%" height="100%" fill="#ecfdf5"/>
    <circle cx="100" cy="80" r="40" fill="#10b981" fill-opacity="0.25"/>
    <rect x="60" y="135" width="80" height="40" rx="12" fill="#10b981" fill-opacity="0.18"/>
  </svg>`)

const state = reactive({
  loading: true,
  row: null as any
})

const photoUrl = ref<string>(INLINE_PLACEHOLDER)
function useInlinePlaceholder() { photoUrl.value = INLINE_PLACEHOLDER }

const profile = computed(() => {
  const r = state.row ?? {}
  const fullName = r.full_name ?? '—'
  const oscaId   = r.osca_id ?? '—'
  const rrn      = r.rrn ?? '—'
  const dobStr   = r.birthdate ? new Date(r.birthdate).toLocaleDateString() : '—'
  const age      = r.age ?? '—'
  const sex      = r.sex ? (r.sex as string).charAt(0).toUpperCase() + (r.sex as string).slice(1) : '—'
  const address  = [r.house_no, r.street].filter(Boolean).join(' ') || '—'
  const city     = r.city ?? '—'
  const phone    = r.phone ?? '—'
  const email    = user.value?.email ?? '—'
  return {
    fullName, oscaId, rrn, dob: dobStr, age, sex,
    civilStatus: '—', // not in schema yet
    address, city, contact: phone, email
  }
})

onMounted(async () => {
  if (!user.value) return
  // 1) pull the merged profile
  const { data, error } = await supabase
    .from('SeniorProfiles_v1')
    .select('*')
    .eq('user_id', user.value.id)
    .maybeSingle()

  if (!error && data) {
    state.row = data
    // 2) resolve avatar: if stored path in Users.photo_url, get a signed URL
    if (data.photo_url) {
      // if you used a private bucket:
      const { data: signed, error: signErr } = await supabase
        .storage.from('avatars')
        .createSignedUrl(data.photo_url.replace(/^avatars\//,''), 60 * 10) // 10 min
      photoUrl.value = (!signErr && signed?.signedUrl) ? signed.signedUrl : INLINE_PLACEHOLDER
    } else {
      photoUrl.value = INLINE_PLACEHOLDER
    }
  } else {
    // still render placeholder labels with blanks
    state.row = {}
    photoUrl.value = INLINE_PLACEHOLDER
  }

  state.loading = false
})

function onEdit() {
  try {
    // pass oscaId if present
    const oscaId = state.row?.osca_id
    if (oscaId) router.push({ name: 'SeniorEdit', query: { oscaId } })
    else router.push('/senior/profile/edit')
  } catch {
    router.push('/senior/profile/edit')
  }
}
</script>

<style scoped>
.section-title{
  @apply text-xs font-semibold tracking-widest text-emerald-800/90 mb-2;
}

/* card wrapper to mimic the lined table look */
.kv-card{
  @apply bg-white rounded-xl shadow-sm ring-1 ring-emerald-100 overflow-hidden;
}
.kv-row{
  display:flex; align-items:center; justify-content:space-between;
  padding:.60rem .90rem;
  border-bottom:1px solid rgba(15,23,42,.15);
  font-size: .95rem; /* ~15px */
  line-height: 1.25rem;
}
.kv-row:last-child{ border-bottom:0; }

/* keep labels slightly darker, values aligned right on narrow screens */
.kv-row > span:first-child{ @apply font-medium text-emerald-900; }
.kv-row > span:last-child{ @apply text-gray-700; }
</style>
