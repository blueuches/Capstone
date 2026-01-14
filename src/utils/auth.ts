// src/utils/auth.ts
import { router } from '@/router'
import { useAuth } from '@/composables/useAuth'

/**
 * After a successful login, send the user to the right dashboard.
 * Uses the unified auth composable (session + role from RPCs).
 */
export async function handleLoginRedirect(): Promise<void> {
  const auth = useAuth()
  await auth.init()

  if (!auth.isSignedIn.value) {
    await router.push('/login')
    return
  }

  if (auth.isOsca.value) {
    await router.push('/osca/dashboard')
    return
  }
  if (auth.isBrgy.value) {
    await router.push('/barangay/dashboard')
    return
  }
  if (auth.isSenior.value) {
    await router.push('/senior/dashboard')
    return
  }
  if (auth.isAdmin.value) {
    await router.push('/admin/dashboard')
    return
  }

  // Fallback when no recognized role
  await router.push('/')
}
