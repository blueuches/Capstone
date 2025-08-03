import { supabase } from '../supabase/client'
import { router } from '../router'

export async function handleLoginRedirect() {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('User not found or error fetching user:', userError)
    return
  }

  const { data: profile, error: profileError } = await supabase
    .from('Users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('Role not found or error fetching role:', profileError)
    return
  }

  switch (profile.role) {
    case 'osca':
      router.push('/osca/dashboard')
      break
    case 'barangay':
      router.push('/barangay/dashboard')
      break
    case 'senior':
      router.push('/senior/dashboard')
      break
    default:
      console.warn('Unknown role:', profile.role)
  }
}
