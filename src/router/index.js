import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase/client'

import Welcome from '../views/Welcome.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'

const routes = [
  { path: '/', component: Welcome },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },

  { path: '/admin/dashboard', component: () => import('../views/Admin/Dashboard.vue') },
  { path: '/admin/formbuilder', component: () => import('../views/Admin/FormBuilder.vue') },
  { path: '/admin/programconfig', component: () => import('../views/Admin/Programs.vue') },
  { path: '/admin/usermanagement', component: () => import('../views/Admin/UserManagement.vue') },

  { path: '/staff/signup', component: () => import('../views//SignupMembers.vue') },

  { path: '/senior/dashboard', component: () => import('../views/Senior/Dashboard.vue') },
  { path: '/senior/form2', component: () => import('../views/Senior/FormPage.vue') },

  {path: '/senior/form/:programId', name: 'SeniorForm', component: () => import('@/views/Senior/FormPage.vue'), props: true,},


  { path: '/senior/notifications', component: () => import('../views/Senior/Notifications.vue') },
  { path: '/senior/profile', component: () => import('../views/Senior/Profile.vue') },

  { path: '/senior/application', component: () => import('../views/Senior/Features/Application.vue') },
  { path: '/senior/programs', component: () => import('../views/Senior/Features/Programs.vue') },
  { path: '/senior/requirements', component: () => import('../views/Senior/Features/Requirements.vue') },
  { path: '/senior/location', component: () => import('../views/Senior/Features/Location.vue') },
  { path: '/senior/help', component: () => import('../views/Senior/Features/Help.vue') },

  { path: '/osca/dashboard', component: () => import('../views/OSCA/Dashboard.vue') },
  { path: '/osca/barangays', component: () => import('../views/OSCA/BarangayList.vue') },
  { path: '/osca/messaging', component: () => import('../views/OSCA/Messaging.vue') },
  { path: '/osca/applications', component: () => import('../views/OSCA/ApplicationReview.vue') },
  { path: '/osca/review', component: () => import('../views/OSCA/Review.vue') },
  // router
{ path: '/osca/review/:programId/:requestId', name: 'OscaReview', component: () => import('@/views/OSCA/ReviewPage.vue'), props: true },
{ path: '/osca/review/:programId/:requestId?', name: 'OscaReviewTest', component: () => import('@/views/OSCA/ReviewPage.vue'), props: true },
//sample without request

  //senior profiles view

  { path: '/barangay/dashboard', component: () => import('../views/Barangay/Dashboard.vue') },
  { path: '/barangay/senior-queue', component: () => import('../views/Barangay/SeniorQueue.vue') },
  { path: '/barangay/messaging', component: () => import('../views/Barangay/Messaging.vue') },
  {
    path: '/barangay/notifications',
    component: () => import('../views/Barangay/Notifications.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

// ----------------- helpers (plain JS) -----------------
const DASH = {
  senior: '/senior/dashboard',
  barangay_staff: '/barangay/dashboard',
  osca_staff: '/osca/dashboard',
  admin: '/admin/dashboard',
}

async function getUserRoles(userId) {
  // read roles via join: user_roles -> roles(code)
  const { data, error } = await supabase
    .from('user_roles')
    .select('roles:role_id ( code )')
    .eq('user_id', userId)

  if (error || !data) return []
  return data.map((row) => row && row.roles && row.roles.code).filter(Boolean)
}

function chooseRoleByPriority(roles) {
  const order = ['admin', 'osca_staff', 'barangay_staff', 'senior']
  return order.find((r) => roles.includes(r)) || null
}

// ----------------- global guard -----------------
router.beforeEach(async (to, _from, next) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Block logged-in users from guest-only pages
  if (to.meta && to.meta.guestOnly && session) {
    return next('/app')
  }

  // Require auth
  if (to.meta && to.meta.requiresAuth && !session) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (session) {
    let active =
      (session.user && session.user.user_metadata && session.user.user_metadata.active_role) || null

    // /app → decide landing
    if (to.name === 'app') {
      if (!active) {
        const roles = await getUserRoles(session.user.id)
        active = chooseRoleByPriority(roles)
        if (active) {
          await supabase.auth.updateUser({ data: { active_role: active } })
        }
      }
      if (active && DASH[active]) return next(DASH[active])
      return next('/login') // no roles assigned
    }

    // Role-gated routes
    const allowed = to.meta && to.meta.roles
    if (Array.isArray(allowed) && allowed.length > 0) {
      if (!active) {
        const roles = await getUserRoles(session.user.id)
        active = chooseRoleByPriority(roles)
        if (active) {
          await supabase.auth.updateUser({ data: { active_role: active } })
        }
      }
      if (!active || allowed.indexOf(active) === -1) {
        const go = active && DASH[active] ? DASH[active] : '/app'
        return next(go)
      }
    }
  }

  next()
})
