// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { supabase } from '@/supabase/client'

// Eager imports (stable)
import Welcome from '@/views/Welcome.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import OscaReview from '@/views/OSCA/ReviewPage.vue' 

// ──────────────────────────────
// Utility: robust role fetch (RPC-first)
// ──────────────────────────────
const roleCache = new Map()
const CACHE_TTL_MS = 5 * 60 * 1000

const DASH = {
  admin: '/admin/dashboard',
  osca_staff: '/osca/dashboard',
  brgy_staff: '/barangay/dashboard',
  senior: '/senior/dashboard',
}
function pickHome(roles = []) {
  const priority = ['admin', 'osca_staff', 'brgy_staff', 'senior']
  const found = priority.find(r => roles.includes(r))
  return found ? (DASH[found] || '/') : '/'
}

// Fetch roles via RPC first (best for RLS), fallback to join
async function fetchRoleCodes(userId) {
  if (!userId) return []

  const hit = roleCache.get(userId)
  if (hit && (Date.now() - hit.ts) < CACHE_TTL_MS) return hit.roles

  // 1) RPC (security definer) — create it as shown below
  try {
    const { data: rpcRoles, error: rpcErr } = await supabase.rpc('get_my_roles')
    if (!rpcErr && Array.isArray(rpcRoles)) {
      roleCache.set(userId, { roles: rpcRoles, ts: Date.now() })
      return rpcRoles
    }
  } catch (e) {
    console.warn('get_my_roles RPC failed:', e)
  }

  // 2) Fallback join (ensure RLS policies allow it)
  try {
    const { data, error } = await supabase
      .from('Memberships')
      .select('status, Roles!inner(code)')
      .eq('user_id', userId)
      .eq('status', 'active')

    if (!error && Array.isArray(data)) {
      const codes = data.map(r => r.Roles?.code).filter(Boolean)
      roleCache.set(userId, { roles: codes, ts: Date.now() })
      return codes
    }
  } catch (e) {
    console.warn('Memberships join failed:', e)
  }

  roleCache.set(userId, { roles: [], ts: Date.now() })
  return []
}

function isAllowed(routeRoles = [], userRoles = []) {
  if (!routeRoles.length) return true
  if (userRoles.includes('admin')) return true // keep admin escape if desired
  return routeRoles.some(r => userRoles.includes(r))
}

// ──────────────────────────────
// Routes (add debug + NA routes)
// ──────────────────────────────
const routes = [
  // Public
  { path: '/', component: Welcome },
  { path: '/login', component: Login, meta: { guestOnly: true } },
  { path: '/signup', component: Signup, meta: { guestOnly: true} }, // ← bracket fix if you copy-paste

  // Debug / NA
  { path: '/not-authorized', component: () => import('@/views/NotAuthorized.vue') },
  { path: '/auth-debug', component: () => import('@/views/AuthDebug.vue') },

  // Admin
  { path: '/admin/dashboard', component: () => import('@/views/Admin/Dashboard.vue'), meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/admin/formbuilder', component: () => import('@/views/Admin/FormBuilder.vue'), meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/admin/programconfig', component: () => import('@/views/Admin/Programs.vue'), meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/admin/usermanagement', component: () => import('@/views/Admin/UserManagement.vue'), meta: { requiresAuth: true, roles: ['admin'] } },

  // Staff self-signup
  { path: '/staff/signup', component: () => import('@/views/SignupMembers.vue') },

  // Senior
  { path: '/senior/dashboard', component: () => import('@/views/Senior/Dashboard.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/form/:programId', name: 'form-page', component: () => import('@/views/Senior/FormPage.vue'), props: true, meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/notifications', component: () => import('@/views/Senior/Notifications.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/profile', component: () => import('@/views/Senior/Profile.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/profile/edit', component: () => import('@/views/Senior/Features/ProfileEdit.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/application', component: () => import('@/views/Senior/Features/Application.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/programs', component: () => import('@/views/Senior/Features/Programs.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/requirements', component: () => import('@/views/Senior/Features/Requirements.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/location', component: () => import('@/views/Senior/Features/Location.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/help', component: () => import('@/views/Senior/Features/Help.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/apply/:programId/:variantId?', name: 'apply-request', component: () => import('@/views/Senior/Features/ApplyRequest.vue') },
  { path: '/senior/apply/:programId', name: 'variant-picker', component: () => import('@/views/Senior/Features/VariantPicker.vue') },
  { path: '/senior/settings', component: () => import('@/views/Senior/Features/Settings.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/about', component: () => import('@/views/Senior/Features/About.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/testvoice', component: () => import('@/views/Test.vue') }, //sample test
  { path: '/senior/testvoiceweb', component: () => import('@/views/Test1.vue') }, //sample test

  // OSCA
  { path: '/osca/dashboard', component: () => import('@/views/OSCA/Dashboard.vue'), meta: { requiresAuth: true, roles: ['osca_staff'] } },
  { path: '/osca/barangays', component: () => import('@/views/OSCA/BarangayList.vue'), meta: { requiresAuth: true, roles: ['osca_staff'] } },
  { path: '/osca/messaging', component: () => import('@/views/OSCA/Messaging.vue'), meta: { requiresAuth: true, roles: ['osca_staff'] } },
  { path: '/osca/applications', component: () => import('@/views/OSCA/ApplicationReview.vue'), meta: { requiresAuth: true, roles: ['osca_staff'] } },
  { path: '/osca/review', component: () => import('@/views/OSCA/Review.vue'), meta: { requiresAuth: true, roles: ['osca_staff'] } },
  { path: '/osca/review/:programId/:requestId?', name: 'OscaReview', component: () => import('@/views/OSCA/ReviewPage.vue'), props: true, meta: { requiresAuth: true, roles: ['osca_staff'] } },
      {path: '/osca/review/:programId/:requestId?',
      name: 'OscaReview',
      component: OscaReview,                           
      props: true,
      meta: { requiresAuth: true, roles: ['osca_staff'] }},
  { path: '/osca/notifications', component: () => import('@/views/OSCA/Notifications.vue'), meta: { requiresAuth: true, roles: ['osca_staff'] } },

  // Barangay
  { path: '/barangay/dashboard', component: () => import('@/views/Barangay/Dashboard.vue'), meta: { requiresAuth: true, roles: ['brgy_staff'] } },
  { path: '/barangay/senior-queue', component: () => import('@/views/Barangay/SeniorQueue.vue'), meta: { requiresAuth: true, roles: ['brgy_staff'] } },
  { path: '/barangay/messaging', component: () => import('@/views/Barangay/Messaging.vue'), meta: { requiresAuth: true, roles: ['brgy_staff'] } },
  { path: '/barangay/notifications', component: () => import('@/views/Barangay/Notifications.vue'), meta: { requiresAuth: true, roles: ['brgy_staff'] } },

  // Misc
  { path: '/logout', component: { render: () => null }, meta: { logout: true } },
]

export const router = createRouter({
  history: createWebHistory(),
    routes,
})

// ──────────────────────────────
// SAFE-MODE GLOBAL GUARD
//  - No infinite loops
//  - Login/Signup always reachable
//  - Falls back to /auth-debug if something smells
// ──────────────────────────────
let lastRedirectAt = 0
let loopCount = 0

router.beforeEach(async (to) => {
  const auth = useAuth()
  try {
    await auth.init()
  } catch (e) {
    console.error('auth.init failed', e)
    return true // don't block routing if auth failed to init
  }

  // Kill switch: allow these always
  if (to.path === '/' || to.path === '/auth-debug' || to.path === '/not-authorized') return true

  // logout
  if (to.meta?.logout) {
    try { await auth.signOut() } catch {}
    roleCache.clear()
    return '/'
  }

  const signedIn = auth.isSignedIn.value
  const userId   = signedIn ? auth.user.value?.id : null

  // Avoid redirect storms: if we redirected very recently multiple times → go to /auth-debug
  const now = Date.now()
  if (now - lastRedirectAt < 500) {
    loopCount++
    if (loopCount >= 2) {
      console.warn('Preventing possible redirect loop → /auth-debug')
      return '/auth-debug'
    }
  } else {
    loopCount = 0
  }

  // guest-only pages must remain accessible if roles are unresolved
  if (to.meta?.guestOnly) {
    if (!signedIn) return true // ok
    // If signed in but roles not resolved or empty, allow Login/Signup to render
    try {
      const roles = await fetchRoleCodes(userId)
      if (roles.length === 0) return '/not-authorized'
      lastRedirectAt = Date.now()
      return pickHome(roles)
    } catch {
      return '/auth-debug'
    }
  }

  // requires auth
  if (to.meta?.requiresAuth) {
    if (!signedIn) return { path: '/login', query: { redirect: to.fullPath } }

    // Role-gate
    if (to.meta?.roles?.length) {
      try {
        const userRole = auth.role.value
        if (to.meta?.roles?.length && !to.meta.roles.includes(userRole)) {
          return '/not-authorized'
        }

      } catch {
        return '/auth-debug'
      }
    }
  }

  return true
})

export default router
