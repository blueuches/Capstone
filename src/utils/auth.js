// src/utils/auth.js
import { router } from '@/router'
import { useAuth } from '@/composables/useAuth'

/**
 * After a successful login, send the user to the right dashboard.
 * Uses the unified auth composable (session + role from RPCs).
 */
export async function handleLoginRedirect() {
  const auth = useAuth()
  await auth.init()

  if (!auth.isSignedIn.value) {
    return router.push('/login')
  }

  if (auth.isOsca.value)   return router.push('/osca/dashboard')
  if (auth.isBrgy.value)   return router.push('/barangay/dashboard')
  if (auth.isSenior.value) return router.push('/senior/dashboard')
  if (auth.isAdmin.value) return router.push('/admin/dashboard')

  // Fallback when no recognized role
  return router.push('/')
}
