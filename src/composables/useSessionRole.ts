// src/composables/useSessionRole.ts
import { computed } from 'vue'

export function useSessionRole(profile) {
  const role = computed(() => profile.value?.role )

  return {
    isAdmin: computed(() => role.value === 'admin'),
    isOSCA: computed(() => role.value === 'osca_staff'),
    isBarangay: computed(() => role.value === 'barangay_staff'),
    isSenior: computed(() => role.value === 'senior')
  }
}
