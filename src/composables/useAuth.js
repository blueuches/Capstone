// src/composables/useAuth.js
import { ref, computed } from 'vue'
import { supabase } from '@/supabase/client'

// --- reactive singletons ---
const session = ref(null)          // full Supabase session
const user = ref(null)             // keep your original export
const role = ref(null)             // 'senior' | 'brgy_staff' | 'osca_staff' | null
const seniorId = ref(null)         // bigint when role === 'senior'
const orgId = ref(null)            // active organization for staff
const loading = ref(false)

// internal flags
let _initialized = false
let _unsubAuth = null

async function loadIdentity() {
  // discover role via your RPC helpers
  const [sr, br, os] = await Promise.all([
    supabase.rpc('is_senior'),
    supabase.rpc('is_brgy'),
    supabase.rpc('is_osca')
  ])

  role.value = os.data ? 'osca_staff'
            : br.data ? 'brgy_staff'
            : sr.data ? 'senior'
            : null

  if (role.value === 'senior') {
    const { data } = await supabase.rpc('my_senior_id')
    seniorId.value = data ?? null
    orgId.value = null
  } else if (role.value === 'brgy_staff' || role.value === 'osca_staff') {
    const { data: membership } = await supabase
      .from('Memberships')
      .select('organization_id, status')
      .eq('status', 'active')
      .limit(1)
      .maybeSingle()
    orgId.value = membership?.organization_id ?? null
    seniorId.value = null
  } else {
    seniorId.value = null
    orgId.value = null
  }
}

async function init() {
  if (_initialized) return
  _initialized = true

  // restore session on app start
  const { data } = await supabase.auth.getSession()
  session.value = data.session ?? null
  user.value = data.session?.user ?? null
  if (session.value) await loadIdentity()

  // subscribe to auth changes once
  const { data: sub } = supabase.auth.onAuthStateChange(async (_event, sess) => {
    session.value = sess ?? null
    user.value = sess?.user ?? null
    if (sess) {
      await loadIdentity()
    } else {
      role.value = null
      seniorId.value = null
      orgId.value = null
    }
  })
  _unsubAuth = sub?.subscription
}

// keep your original function name (some pages may call it)
async function loadUser() {
  const { data } = await supabase.auth.getUser()
  user.value = data.user
  // if someone calls this before init(), make sure we have a session too
  if (!session.value) {
    const { data: s } = await supabase.auth.getSession()
    session.value = s.session ?? null
  }
}

async function signInWithPassword(email, password) {
  loading.value = true
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  loading.value = false
  if (error) throw error
  await loadIdentity()
}

async function signOut() {
  await supabase.auth.signOut()
  role.value = null
  seniorId.value = null
  orgId.value = null
  session.value = null
  user.value = null
  if (_unsubAuth) {
    try { _unsubAuth.unsubscribe?.() } catch {}
    _unsubAuth = null
  }
}

// exported API (superset of your original)
export function useAuth() {
  return {
    // state
    session, user, role, seniorId, orgId, loading,

    // derived
    isSignedIn: computed(() => !!session.value),
    isSenior:   computed(() => role.value === 'senior'),
    isBrgy:     computed(() => role.value === 'brgy_staff'),
    isOsca:     computed(() => role.value === 'osca_staff'),

    // actions
    init, loadUser, signInWithPassword, signOut
  }
}

export default useAuth