<!-- SeniorProfile.vue (fixed) -->
<template>
  <div class="bg-gradient-to-b from-emerald-50 to-white min-h-screen flex flex-col items-center">
    <!-- Banner -->
      <div
        class="relative w-full h-32 sm:h-40 bg-gradient-to-r from-emerald-600 to-emerald-400 pt-[env(safe-area-inset-top)] shadow-md"
        role="img"
        aria-label="Senior Citizen Profile banner"
      >
        <!-- Dashboard (upper-left) -->
        <router-link to="/senior/dashboard"
          class="absolute top-3 left-4 text-white text-lg sm:text-xl font-semibold drop-shadow-md tracking-wide"
        >
          ← Dashboard
        </router-link>

        <!-- Main Title (center bottom) -->
        <h1
          class="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xl sm:text-2xl md:text-3xl font-bold drop-shadow-lg text-center"
        >
          Senior Citizen Profile
        </h1>
      </div>

    <main class="w-full max-w-4xl px-4 sm:px-6 -mt-16 sm:-mt-20 pb-8">
      <!-- Profile Card -->
      <section class="bg-white border border-emerald-200 rounded-2xl shadow-lg p-5 sm:p-6 mb-6 sm:mb-8">
        <div class="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
          <!-- Profile Image + Upload -->
          <div class="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0">
            <div class="w-full h-full rounded-full overflow-hidden border-4 border-emerald-500 shadow-md bg-emerald-50">
              <img
                :src="photoUrl"
                alt="Senior Photo"
                class="w-full h-full object-cover"
                @error="useInlinePlaceholder"
              />
            </div>

            <!-- Upload button -->
            <label
              class="absolute -bottom-2 -right-1 sm:bottom-0 sm:right-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              <span class="sr-only">Upload new profile photo</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15.232 5.232l3.536 3.536M9 13h.01M4 7v10a1 1 0 001 1h14a1 1 0 001-1V7a1 1 0 00-1-1h-4l-2-2H9L7 6H5a1 1 0 00-1 1z" />
              </svg>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                class="hidden"
                @change="onPhotoSelected"
              />
            </label>
          </div>

          <!-- Basic Info -->
          <div class="text-center sm:text-left space-y-2">
            <h2 class="text-xl sm:text-2xl font-bold text-emerald-700 leading-tight">
              {{ profile.fullName }}
            </h2>

            <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
              <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                {{ profile.milestone }}
              </span>
              <span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                {{ profile.age }} Years Old
              </span>
            </div>

            <p class="text-gray-600 text-sm">
              OSCA ID: <span class="font-medium">{{ profile.oscaId }}</span>
            </p>
            <p class="text-gray-600 text-sm">
              RRN: <span class="font-medium">{{ profile.rrn }}</span>
            </p>
          </div>
        </div>
      </section>

      <!-- Personal Information -->
      <section class="bg-white border border-emerald-200 rounded-xl shadow p-5 sm:p-6 mb-5 sm:mb-6">
        <h3 class="text-base sm:text-lg font-semibold text-emerald-600 mb-3 sm:mb-4">Personal Information</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-700">
          <p><span class="font-medium text-emerald-700">Full Name:</span> {{ profile.fullName }}</p>
          <p><span class="font-medium text-emerald-700">Date of Birth:</span> {{ profile.dob }}</p>
          <p><span class="font-medium text-emerald-700">Age:</span> {{ profile.age }}</p>
          <p><span class="font-medium text-emerald-700">Sex:</span> {{ profile.sex }}</p>
          <p><span class="font-medium text-emerald-700">Civil Status:</span> {{ profile.civilStatus }}</p>
          <p><span class="font-medium text-emerald-700">Citizenship:</span> {{ profile.citizenship }}</p>
          <p class="sm:col-span-2">
            <span class="font-medium text-emerald-700">Residential Address:</span>
            {{ profile.address }}
          </p>
        </div>
      </section>

      <!-- Contact Information -->
      <section class="bg-white border border-emerald-200 rounded-xl shadow p-5 sm:p-6 mb-5 sm:mb-6">
        <h3 class="text-base sm:text-lg font-semibold text-emerald-600 mb-3 sm:mb-4">Contact Information</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-700">
          <p><span class="font-medium text-emerald-700">Contact Number:</span> {{ profile.contact }}</p>
          <p><span class="font-medium text-emerald-700">Email:</span> {{ profile.email }}</p>
          <p><span class="font-medium text-emerald-700">Emergency Contact:</span> {{ profile.emergencyContact }}</p>
          <p><span class="font-medium text-emerald-700">Emergency Number:</span> {{ profile.emergencyNumber }}</p>
        </div>
      </section>

      <!-- Benefits -->
      <section class="bg-white border border-emerald-200 rounded-xl shadow p-5 sm:p-6 mb-5 sm:mb-6">
        <h3 class="text-base sm:text-lg font-semibold text-emerald-600 mb-3 sm:mb-4">Program &amp; Benefits</h3>
        <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li v-for="(benefit, idx) in profile.benefits" :key="idx">
            {{ benefit }}
          </li>
        </ul>
      </section>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row justify-end gap-3 mt-6">
        <button
          type="button"
          @click="goBack"
          class="inline-flex items-center justify-center px-4 py-3 bg-gray-100 border rounded-md hover:bg-gray-200 text-sm transition w-full sm:w-auto"
        >
          Back to List
        </button>
        <button
          type="button"
          @click="onEdit"
          class="inline-flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm transition w-full sm:w-auto"
        >
          Edit Profile
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
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

const props = defineProps<{
  profileData?: Partial<ProfileData>
  /** Optional: string path or route location object (must exist). Defaults to router.back() -> '/' */
  backTo?: string | Record<string, any>
}>()

const router = useRouter()

// Inline SVG data URI (always available, no network needed)
const INLINE_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
    <rect width="100%" height="100%" fill="#ecfdf5"/>
    <circle cx="150" cy="110" r="60" fill="#10b981" fill-opacity="0.2"/>
    <rect x="90" y="190" width="120" height="60" rx="12" fill="#10b981" fill-opacity="0.15"/>
    <text x="150" y="285" font-size="16" text-anchor="middle" fill="#047857" font-family="Arial, sans-serif">Senior Photo</text>
  </svg>`)

// Default data (fallback). Replace via props.profileData from Supabase.
const profile = reactive<ProfileData>({
  fullName: 'Junafe Miot Marban',
  milestone: 'Octogenarian',
  age: 81,
  oscaId: '2025-67890',
  rrn: 'NC-123456789',
  dob: 'Jun 21, 1944',
  sex: 'Female',
  civilStatus: 'Widowed',
  citizenship: 'Filipino',
  address: 'P-5, Barangay 6, De Oro',
  contact: '0912 345 6789',
  email: 'junafe.marban@example.com',
  emergencyContact: 'Maria Marban (Daughter)',
  emergencyNumber: '0998 765 4321',
  benefits: [
    'Eligible for R.A. 11982 milestone age benefit (80+ years old)',
    'Utilization of Cash Gifts: Food, Medicine, Medical Checkups',
    'Primary Beneficiary: Maria Marban (Daughter)',
  ],
  photoUrl: INLINE_PLACEHOLDER,
  ...props.profileData,
})

const objectUrl = ref<string | null>(null)
const photoUrl = ref<string>(profile.photoUrl || INLINE_PLACEHOLDER)

function onPhotoSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  objectUrl.value = URL.createObjectURL(file)
  photoUrl.value = objectUrl.value

  // TODO: Upload to Supabase Storage and persist URL
}

function useInlinePlaceholder() {
  photoUrl.value = INLINE_PLACEHOLDER
}

onUnmounted(() => {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
})

function goBack() {
  // If a valid backTo prop is provided, try that first
  if (props.backTo) {
    try {
      // If it's a string path, push it; if object, push it as-is
      if (typeof props.backTo === 'string') {
        router.push(props.backTo)
        return
      } else {
        const r = router.resolve(props.backTo as any)
        if (r.matched.length) {
          router.push(props.backTo as any)
          return
        }
      }
    } catch {
      // fall through to safe back
    }
  }
  // Safe fallback: go back, else go home
  if (window.history.length > 1) router.back()
  else router.push('/')
}

function onEdit() {
  // Navigate to your edit route; ensure this route exists in router
  // Change 'SeniorEdit' to your real route name or path
  try {
    const r = router.resolve({ name: 'SeniorEdit', query: { oscaId: profile.oscaId } })
    if (r.matched.length) router.push(r)
    else router.push(`/seniors/edit?oscaId=${encodeURIComponent(profile.oscaId)}`)
  } catch {
    router.push(`/seniors/edit?oscaId=${encodeURIComponent(profile.oscaId)}`)
  }
}
</script>
