// src/composables/useSessionRole.ts
import { useAuth } from '@/composables/useAuth'

/**
 * Returns the current role code from the unified auth composable:
 * 'senior' | 'brgy_staff' | 'osca_staff' | null
 */
export async function resolveRoleAndRoute(): Promise<string | null> {
  const auth = useAuth()
  await auth.init() // idempotent
  return auth.role.value ?? null
}

/** Optional small helper if you also want easy booleans elsewhere */
export function useSessionRole() {
  const auth = useAuth()
  // caller should have called auth.init() earlier (router or app startup)
  return {
    role: auth.role,               // Ref<string|null>
    isSenior: auth.isSenior,       // Computed<boolean>
    isBrgy: auth.isBrgy,           // Computed<boolean>
    isOsca: auth.isOsca,           // Computed<boolean>
    seniorId: auth.seniorId,       // Ref<number|null>
    orgId: auth.orgId,             // Ref<number|null>
    init: auth.init,               // expose init if needed
  }
}
