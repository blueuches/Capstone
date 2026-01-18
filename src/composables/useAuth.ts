// src/composables/useAuth.ts
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase/client'
import { signIn, signOut, signUp } from '@/utils/auth'
import type { Profile } from '@/types/profile'

const profile = ref<Profile | null>(null)
const session = ref<any>(null)
const loading = ref<boolean>(false)

type SignupPayload = {
  email: string
  password: string
  role: 'senior' | 'osca_staff' | 'barangay_staff'

  first_name: string
  middle_name?: string | null
  last_name: string

  // optional in DB (can be empty for staff if you want)
  birthdate?: string | null
  gender?: string | null
  contact_no?: string | null

  // required only for senior / barangay_staff
  barangay_id?: string | null
}

export function useAuth() {
  const router = useRouter()

  const loadSession = async () => {
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    if (session.value) await loadProfile()
  }

const loadProfile = async () => {
  const userId = session.value.user.id

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      role,
      first_name,
      middle_name,
      last_name,
      birthdate,
      gender,
      contact_no,
      barangay_id,
      barangays (
        id,
        name
      )
    `)
    .eq('id', userId)
    .single()

  if (error) throw error
  profile.value = data
}


  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const { error } = await signIn(email, password)
      if (error) throw error

      await loadSession()
      redirectByRole()
    } finally {
      loading.value = false
    }
  }

    const signup = async (payload: SignupPayload) => {
      loading.value = true
      try {
        const needsBarangay = payload.role === 'senior' || payload.role === 'barangay_staff'
        if (needsBarangay && !payload.barangay_id) {
          throw new Error('Barangay is required for Seniors and Barangay Staff.')
        }

        // 1) Create auth user
        const { data, error } = await signUp(payload.email, payload.password)
        if (error) throw error
        if (!data.user?.id) throw new Error('Signup failed: missing user id.')

        // 2) Insert profile row (respect your CHECK constraint)
        const profileRow = {
          id: data.user.id,
          role: payload.role,
          barangay_id: needsBarangay ? payload.barangay_id : null,
          first_name: payload.first_name,
          middle_name: payload.middle_name ?? null,
          last_name: payload.last_name,
          birthdate: payload.birthdate ?? null,
          gender: payload.gender ?? null,
          contact_no: payload.contact_no ?? null
        }

        const { error: profileError } = await supabase.from('profiles').insert(profileRow)
        if (profileError) throw profileError

        // 3) Set session + profile locally (so router + UI immediately know)
        // With email confirmation OFF, this should exist:
        if (data.session) {
          session.value = data.session
        } else {
          // fallback (rare)
          const { data: s } = await supabase.auth.getSession()
          session.value = s.session
        }

        // we already know the profile row we inserted, so set it
        profile.value = profileRow as any

        // 4) Redirect immediately
        redirectByRole()
      } finally {
        loading.value = false
      }
    }

  const logout = async () => {
    await signOut()
    session.value = null
    profile.value = null
    router.push('/login')
  }

  const redirectByRole = () => {
    if (!profile.value) return

    switch (profile.value.role) {
      case 'admin':
        router.push('/admin/dashboard')
        break
      case 'osca_staff':
        router.push('/osca/dashboard')
        break
      case 'barangay_staff':
        router.push('/barangay/dashboard')
        break
      case 'senior':
        router.push('/senior/dashboard')
        break
      default:
        router.push('/not-authorized')
    }
  }

  return {
    session,
    profile,
    loading,
    login,
    signup,
    logout,
    loadSession
  }
}

export default useAuth