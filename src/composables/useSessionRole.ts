// src/composables/useSessionRole.ts
import type { Profile, Role } from '@/types/profile'

export function useSessionRole(profile: Profile | null) {
  const role: Role | null = profile?.role ?? null
  return { role }
}