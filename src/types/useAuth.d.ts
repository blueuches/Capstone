// src/types/useAuth.d.ts
declare module '@/composables/useAuth' {
  import type { Ref, ComputedRef } from 'vue'

  type RoleCode = 'senior' | 'brgy_staff' | 'osca_staff' | null

  interface UseAuthApi {
    // state
    session: Ref<any | null>
    user: Ref<any | null>
    role: Ref<RoleCode>
    seniorId: Ref<number | null>
    orgId: Ref<number | null>
    loading: Ref<boolean>

    // derived
    isSignedIn: ComputedRef<boolean>
    isSenior: ComputedRef<boolean>
    isBrgy: ComputedRef<boolean>
    isOsca: ComputedRef<boolean>
    isAdmin: ComputedRef<boolean>

    // actions
    init: () => Promise<void>
    loadUser: () => Promise<void>
    signInWithPassword: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
  }

  export function useAuth(): UseAuthApi
}
