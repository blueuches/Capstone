// src/router/index.ts
import { createRouter, createWebHistory} from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// Eager imports (stable)
import Welcome from '@/views/Welcome.vue'
import Login from '@/views/Login.vue'
import SeniorSignup from '@/views/Signup.vue'
import StaffSignup from '@/views/SignupMembers.vue'
import NotAuthorized from '@/views/NotAuthorized.vue'

import AdminDashboard from '@/views/Admin/Dashboard.vue'
import OSCADashboard from '@/views/OSCA/Dashboard.vue'
import BarangayDashboard from '@/views/Barangay/Dashboard.vue'
import SeniorDashboard from '@/views/Senior/Dashboard.vue'



const routes = [
  // Public
  { path: '/', component: Welcome },
  { path: '/login', component: Login},
  { path: '/signup', component: SeniorSignup},
  { path: '/signup-staff', component: StaffSignup},
  { path: '/not-authorized', component: () => import('@/views/NotAuthorized.vue') },

  //
  { path: '/admin/dashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin'}},
 {
    path: '/osca/dashboard', component: OSCADashboard, meta: { requiresAuth: true, role: 'osca_staff' }
  },
  {
    path: '/barangay/dashboard', component: BarangayDashboard, meta: { requiresAuth: true, role: 'barangay_staff' }
  },
  {
    path: '/senior/dashboard', component: SeniorDashboard, meta: { requiresAuth: true, role: 'senior' }
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const { session, profile, loadSession } = useAuth()

  if (!session.value) {
    await loadSession()
  }

  if (to.meta.requiresAuth && !session.value) {
    return '/login'
  }

  if (to.meta.role && profile.value?.role !== to.meta.role) {
    return '/not-authorized'
  }
})


export default router
