// src/composables/useAuth.js
import { ref, computed } from 'vue'
import { supabase } from '@/supabase/client'

// ─────────────────────────────────────────────
// Reactive singletons (one instance app-wide)
// ─────────────────────────────────────────────
const session = ref(null) // Supabase session object
const user = ref(null) // Supabase user object

// Optional identity/role context (loaded lazily)
const role = ref(null) // 'senior' | 'brgy_staff' | 'osca_staff' | null
const seniorId = ref(null) // bigint when role === 'senior'
const orgId = ref(null) // active organization_id for staff
const loading = ref(false) // for UI spinners during sign in, etc.

// Internal flags
let _initialized = false
let _unsubAuth = null

// ─────────────────────────────────────────────
// FAST role discovery (does NOT block init())
// Run only when a valid session exists.
// Uses your existing RPCs, with a safe fallback.
// ─────────────────────────────────────────────
async function loadIdentity() {
  if (!session.value?.user) {
    role.value = null
    seniorId.value = null
    orgId.value = null
    return
  }

  try {
    // Try your RPC triage first
    const [sr, br, os, ad] = await Promise.allSettled([
      supabase.rpc('is_senior'),
      supabase.rpc('is_brgy'),
      supabase.rpc('is_osca'),
      supabase.rpc('is_admin'),
    ])

    const isSenior = sr.status === 'fulfilled' && !!sr.value?.data
    const isBrgy = br.status === 'fulfilled' && !!br.value?.data
    const isOsca = os.status === 'fulfilled' && !!os.value?.data
    const isAdmin = ad.status === 'fulfilled' && !!ad.value?.data

    // Prioritize staff over senior if both return true accidentally
    role.value = isAdmin
      ? 'admin'
      : isOsca
        ? 'osca_staff'
        : isBrgy
          ? 'brgy_staff'
          : isSenior
            ? 'senior'
            : null

    if (session.value?.user?.email === 'oscaadmin@gmail.com') {
      role.value = 'admin'
      return
    }

    if (role.value === 'senior') {
      // Senior identity
      const { data, error } = await supabase.rpc('my_senior_id')
      if (!error) {
        seniorId.value = data ?? null
      } else {
        seniorId.value = null
      }
      orgId.value = null
    } else if (role.value === 'brgy_staff' || role.value === 'osca_staff') {
      // Staff: get active organization
      // NOTE: RLS must allow reading the user's own active membership.
      const { data: membership } = await supabase
        .from('Memberships')
        .select('organization_id, status')
        .eq('status', 'active')
        .limit(1)
        .maybeSingle()

      orgId.value = membership?.organization_id ?? null
      seniorId.value = null
    } else {
      // No role
      seniorId.value = null
      orgId.value = null
    }
  } catch (e) {
    // Fail safe: if identity lookup fails, do not crash auth.
    console.error('loadIdentity error:', e)
    role.value = null
    seniorId.value = null
    orgId.value = null
  }
}

// Optionally exposed if a page wants to force a refresh
async function refreshIdentity() {
  await loadIdentity()
}

// ─────────────────────────────────────────────
// Auth lifecycle
// ─────────────────────────────────────────────
async function init() {
  if (_initialized) return
  _initialized = true

  // 1) Restore session quickly (NO role blocking)
  const { data, error } = await supabase.auth.getSession()
  if (error) console.warn('getSession error:', error)

  session.value = data?.session ?? null
  user.value = data?.session?.user ?? null

  // 2) Fire-and-forget role discovery (do not await)
  if (session.value) await loadIdentity()

  // 3) Subscribe once to auth changes
  const { data: sub } = supabase.auth.onAuthStateChange(async (_event, sess) => {
    session.value = sess ?? null
    user.value = sess?.user ?? null

    if (sess) {
      // user signed in / refreshed → refresh identity (non-blocking)
      void loadIdentity()
    } else {
      // user signed out
      role.value = null
      seniorId.value = null
      orgId.value = null
    }
  })

  _unsubAuth = sub?.subscription ?? null
}

// Some legacy code may still call this; keep it lightweight
async function loadUser() {
  const { data } = await supabase.auth.getUser()
  user.value = data?.user ?? null

  // Ensure session is present if someone calls loadUser before init
  if (!session.value) {
    const { data: s } = await supabase.auth.getSession()
    session.value = s?.session ?? null
  }
}

async function signInWithPassword(email, password) {
  loading.value = true
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    // After successful sign-in, fetch identity (OK to await here so post-login routing knows state)
    await loadIdentity()
  } finally {
    loading.value = false
  }
}

async function signOut() {
  try {
    await supabase.auth.signOut()
  } finally {
    // Hard reset local state so guards won't think we're still signed in
    role.value = null
    seniorId.value = null
    orgId.value = null
    session.value = null
    user.value = null

    // Clean up the subscription
    if (_unsubAuth) {
      try {
        _unsubAuth.unsubscribe?.()
      } catch {}
      _unsubAuth = null
    }

    // Allow re-init after sign out
    _initialized = false
  }
}

// ─────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────
export function useAuth() {
  return {
    // state
    session,
    user,
    role,
    seniorId,
    orgId,
    loading,

    // derived
    isSignedIn: computed(() => !!session.value),
    isSenior: computed(() => role.value === 'senior'),
    isBrgy: computed(() => role.value === 'brgy_staff'),
    isOsca: computed(() => role.value === 'osca_staff'),
    isAdmin: computed(() => role.value === 'admin'),

    // actions
    init,
    loadUser,
    signInWithPassword,
    signOut,
    refreshIdentity, // optional
  }
}

export default useAuth
