<template>
  <div class="min-h-dvh grid place-items-center bg-emerald-50">
    <div class="bg-white rounded-2xl shadow p-8 max-w-md text-center">
      <h1 class="text-2xl font-bold text-emerald-700 mb-2">{{ title }}</h1>
      <p class="text-gray-600 mb-6">{{ message }}</p>

      <div class="flex gap-3 justify-center">
        <button @click="goHome"
          class="px-4 py-2 rounded-xl border border-emerald-600 text-emerald-700">
          Home
        </button>
        <router-link to="/logout"
          class="px-4 py-2 rounded-xl bg-emerald-600 text-white">
          Log out
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const auth = useAuth()

const title = computed(() =>
  auth.isSignedIn.value ? "This page isn't for you" : "No Role Assigned"
)

const message = computed(() =>
  auth.isSignedIn.value
    ? "You’re signed in, but you don’t have permission to view this page."
    : "Please log in or contact support if this persists."
)

function goHome() {
  if (!auth.isSignedIn.value) return router.push('/')
  switch (auth.role.value) {
    case 'admin': return router.push('/admin/dashboard')
    case 'osca_staff': return router.push('/osca/dashboard')
    case 'brgy_staff': return router.push('/barangay/dashboard')
    case 'senior': return router.push('/senior/dashboard')
    default: return router.push('/')
  }
}
</script>
