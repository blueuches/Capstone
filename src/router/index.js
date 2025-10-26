import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// Eager imports you already had
import Welcome from '../views/Welcome.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'

const routes = [
  // Public
  { path: '/', component: Welcome },
  { path: '/login', component: Login, meta: { guestOnly: true } },
  { path: '/signup', component: Signup, meta: { guestOnly: true } },

  // Admin (map to osca_staff if that's your policy, or keep 'admin' if you truly have it)
  { path: '/admin/dashboard', component: () => import('../views/Admin/Dashboard.vue'), meta: { requiresAuth: true, roles: ['osca_staff'] } },
  { path: '/admin/formbuilder', component: () => import('../views/Admin/FormBuilder.vue'), meta: { requiresAuth: true, roles: ['osca_staff'] } },
  { path: '/admin/programconfig', component: () => import('../views/Admin/Programs.vue'), meta: { requiresAuth: true, roles: ['osca_staff'] } },
  { path: '/admin/usermanagement', component: () => import('../views/Admin/UserManagement.vue'), meta: { requiresAuth: true, roles: ['osca_staff'] } },

  // Staff self-signup (public unless you want to restrict)
  { path: '/staff/signup', component: () => import('../views/SignupMembers.vue') },

  // Senior
  { path: '/senior/dashboard', component: () => import('../views/Senior/Dashboard.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/form2', component: () => import('../views/Senior/FormPage.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/form/:programId', name: 'SeniorForm', component: () => import('@/views/Senior/FormPage.vue'), props: true, meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/notifications', component: () => import('../views/Senior/Notifications.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/profile', component: () => import('../views/Senior/Profile.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/application', component: () => import('../views/Senior/Features/Application.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/programs', component: () => import('../views/Senior/Features/Programs.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/requirements', component: () => import('../views/Senior/Features/Requirements.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/location', component: () => import('../views/Senior/Features/Location.vue'), meta: { requiresAuth: true, roles: ['senior'] } },
  { path: '/senior/help', component: () => import('../views/Senior/Features/Help.vue'), meta: { requiresAuth: true, roles: ['senior'] } },

  // OSCA
  { path: '/osca/dashboard', component: () => import('../views/OSCA/Dashboard.vue'), meta: { requiresAuth: true, roles: ['osca_staff'] } },
  { path: '/osca/barangays', component: () => import('../views/OSCA/BarangayList.vue'), meta: { requiresAuth: true, roles: ['osca_staff'] } },
  { path: '/osca/messaging', component: () => import('../views/OSCA/Messaging.vue'), meta: { requiresAuth: true, roles: ['osca_staff'] } },
  { path: '/osca/applications', component: () => import('../views/OSCA/ApplicationReview.vue'), meta: { requiresAuth: true, roles: ['osca_staff'] } },
  { path: '/osca/review', component: () => import('../views/OSCA/Review.vue'), meta: { requiresAuth: true, roles: ['osca_staff'] } },
  // keep one route; optional requestId covers both cases
  { path: '/osca/review/:programId/:requestId?', name: 'OscaReview', component: () => import('@/views/OSCA/ReviewPage.vue'), props: true, meta: { requiresAuth: true, roles: ['osca_staff'] } },

  // Barangay
  { path: '/barangay/dashboard', component: () => import('../views/Barangay/Dashboard.vue'), meta: { requiresAuth: true, roles: ['brgy_staff'] } },
  { path: '/barangay/senior-queue', component: () => import('../views/Barangay/SeniorQueue.vue'), meta: { requiresAuth: true, roles: ['brgy_staff'] } },
  { path: '/barangay/messaging', component: () => import('../views/Barangay/Messaging.vue'), meta: { requiresAuth: true, roles: ['brgy_staff'] } },
  { path: '/barangay/notifications', component: () => import('../views/Barangay/Notifications.vue'), meta: { requiresAuth: true, roles: ['brgy_staff'] } },

  // router/index.js — add this route
{ path: '/logout', component: { render: () => null }, meta: { logout: true } },

]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

const DASH = {
  senior: '/senior/dashboard',
  brgy_staff: '/barangay/dashboard',
  osca_staff: '/osca/dashboard',
}

router.beforeEach(async (to) => {
  const auth = useAuth()
  await auth.init()

  // --- GUEST-ONLY PAGES (login/signup) ---
  if (to.meta?.guestOnly && auth.isSignedIn.value) {
    // only block if a valid role is present
    if (auth.isSenior.value)   return DASH.senior
    if (auth.isBrgy.value)     return DASH.brgy_staff
    if (auth.isOsca.value)     return DASH.osca_staff
    // No recognized role → allow access to login/signup
    return true
  }

  // --- AUTH REQUIRED ---
  if (to.meta?.requiresAuth && !auth.isSignedIn.value) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  // --- ROLE GUARD ---
  if (to.meta?.roles?.length) {
    const current =
      (auth.isSenior.value && 'senior') ||
      (auth.isBrgy.value && 'brgy_staff') ||
      (auth.isOsca.value && 'osca_staff') ||
      null

    if (!current || !to.meta.roles.includes(current)) {
      // if signed in, try send to the right dashboard
      if (auth.isSenior.value)   return DASH.senior
      if (auth.isBrgy.value)     return DASH.brgy_staff
      if (auth.isOsca.value)     return DASH.osca_staff
      // otherwise go to login
      return { path: '/login', query: { redirect: to.fullPath } }
    }
  }

    if (to.meta?.logout) {
    await auth.signOut()
    return '/'
  }

  return true
})
