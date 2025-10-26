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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

interface ProfileData {
  fullName: string
  milestone: string
  age: number
  oscaId: string
  rrn: string
  dob: string
  sex: string
  civilStatus: string
  citizenship: string
  address: string
  contact: string
  email: string
  emergencyContact: string
  emergencyNumber: string
  benefits: string[]
  photoUrl?: string
}

const props = defineProps<{ profileData?: Partial<ProfileData> }>()

const router = useRouter()

const INLINE_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <rect width="100%" height="100%" fill="#ecfdf5"/>
    <circle cx="100" cy="80" r="40" fill="#10b981" fill-opacity="0.25"/>
    <rect x="60" y="135" width="80" height="40" rx="12" fill="#10b981" fill-opacity="0.18"/>
  </svg>`)

const profile = reactive<ProfileData>({
  fullName: 'Juan C. Dela Cruz',
  milestone: '—',
  age: 70,
  oscaId: 'SC-12345678',
  rrn: '—',
  dob: 'January 15, 1955',
  sex: 'Male',
  civilStatus: 'Married',
  citizenship: 'Filipino',
  address: 'P-7 DeOro',
  contact: '0946-123-9867',
  email: 'juan.cruz@gmail.com',
  emergencyContact: '',
  emergencyNumber: '',
  benefits: [],
  photoUrl: INLINE_PLACEHOLDER,
  ...props.profileData,
})

const photoUrl = ref<string>(profile.photoUrl || INLINE_PLACEHOLDER)
function useInlinePlaceholder() { photoUrl.value = INLINE_PLACEHOLDER }

function onEdit() {
  // go to your edit page
  try {
    router.push({ name: 'SeniorEdit', query: { oscaId: profile.oscaId } })
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
