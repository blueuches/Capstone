<template>
  <div class="min-h-screen bg-gray-50 font-poppins pb-16 flex flex-col">
    <Header @toggle-menu="open = true" />
    <SideBurger :open="open" @close="open = false" />

    <main class="flex-1 px-4 pt-4 overflow-y-auto">
      <!-- Breadcrumb -->
      <RouterLink
        to="/senior/dashboard"
        class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4"
      >
        <component :is="Left" class="w-5 h-5 text-yellow-500" />
        <span class="text-gray-500">Dashboard</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900">Profile</span>
      </RouterLink>

      <!-- Page Header -->
      <div class="mb-3">
        <h1 class="text-lg font-bold text-gray-900">My Profile</h1>
        <p class="text-sm text-gray-600">
          Review your details. You can edit your profile anytime.
        </p>
      </div>

      <!-- Head Card -->
      <section class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 px-5 pt-6 pb-5">
        <div class="flex items-center gap-4">
          <!-- Avatar -->
          <div
            class="h-20 w-20 rounded-full bg-yellow-50 ring-1 ring-yellow-200 border-4 border-white shadow-sm overflow-hidden flex items-center justify-center"
          >
            <!-- placeholder image -->
            <img
              :src="avatarPlaceholder"
              alt="Profile photo"
              class="h-full w-full object-cover"
            />
          </div>

          <!-- Name + meta -->
          <div class="min-w-0 flex-1">
            <p class="text-xl font-extrabold text-gray-900 leading-tight">
            {{ profile?.first_name }} {{ profile?.last_name }}
            </p>
            <p class="text-sm text-gray-600 mt-1">
              OSCA ID: <span class="font-semibold text-gray-800">[XXXX-XXXX]</span>
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Status: <span class="font-semibold text-gray-700">[Verified]</span>
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            class="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-semibold
                   bg-yellow-50 text-yellow-800 ring-1 ring-yellow-200 shadow-sm hover:bg-yellow-100"
          >
            Edit Profile
          </button>

          <button
            type="button"
            class="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-semibold
                   bg-white text-gray-700 ring-1 ring-gray-200 shadow-sm hover:bg-gray-50"
          >
            Change Photo
          </button>
        </div>
      </section>

      <!-- PERSONAL INFORMATION -->
      <section class="mt-5">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-gray-500">[Last updated: --]</span>
        </div>

        <div class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <div class="kv-row">
            <span>Date of Birth</span>
            <span>{{ profile?.birthdate }}</span>
          </div>
          <div class="kv-row">
            <span>Age</span>
            <span>[--] years old</span>
          </div>
          <div class="kv-row">
            <span>Gender</span>
            <span>{{ profile?.gender }}</span>
          </div>
                    <div class="kv-row">
            <span>Barangay</span>
            <span class="text-right">[Barangay Name]</span>
          </div>

        </div>
      </section>

      <!-- Logout -->
      <section class="mt-6">
        <button
          @click="handleLogout"
          class="w-full px-5 py-3 rounded-2xl bg-gray-900 text-white font-semibold shadow hover:bg-black"
        >
          Log Out
        </button>
      </section>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Senior/Header.vue'
import SideBurger from '@/components/Senior/SideBurger.vue'
import BottomNav from '@/components/Senior/BottomNav.vue'
import Left from '@/assets/icons/senior/left-arrow.svg'
import { useAuth } from '@/composables/useAuth'

const { profile, logout } = useAuth()

const open = ref(false)

const handleLogout = async () => {
  await logout()
}

// purely UI placeholder avatar
const avatarPlaceholder =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <rect width="100%" height="100%" fill="#fff7ed"/>
    <circle cx="100" cy="78" r="42" fill="#f59e0b" fill-opacity="0.22"/>
    <rect x="55" y="132" width="90" height="44" rx="14" fill="#f59e0b" fill-opacity="0.16"/>
  </svg>`)
</script>

<style scoped>
/* clean “lined rows” like Profile 2, but gray theme */
.kv-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.10);
  font-size: 0.95rem; /* ~15px */
  line-height: 1.25rem;
}
.kv-row:last-child {
  border-bottom: 0;
}
.kv-row > span:first-child {
  font-weight: 600;
  color: rgb(31 41 55); /* gray-800 */
}
.kv-row > span:last-child {
  color: rgb(75 85 99); /* gray-600 */
}
</style>
