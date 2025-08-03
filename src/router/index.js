import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../views/Welcome.vue'
import RoleSelector from '../views/RoleSelector.vue'

const routes = [
  { path: '/', component: Welcome },
  { path: '/roles', component: RoleSelector },
  { path: '/senior/login', component: () => import('../views/Senior/Login.vue') },
  { path: '/senior/signup', component: () => import('../views/Senior/Signup.vue') },
  { path: '/senior/dashboard', component: () => import('../views/Senior/Dashboard.vue') },
  { path: '/senior/form', component: () => import('../views/Senior/Form.vue') },
  { path: '/senior/notifications', component: () => import('../views/Senior/Notifications.vue') },

  { path: '/osca/login', component: () => import('../views/OSCA/Login.vue') },
  { path: '/osca/signup', component: () => import('../views/OSCA/Signup.vue') },
  { path: '/osca/dashboard', component: () => import('../views/OSCA/Dashboard.vue') },
  { path: '/osca/barangays', component: () => import('../views/OSCA/BarangayList.vue') },
  { path: '/osca/messaging', component: () => import('../views/OSCA/Messaging.vue') },
  { path: '/osca/applications', component: () => import('../views/OSCA/ApplicationReview.vue') },
  { path: '/osca/release-id', component: () => import('../views/OSCA/ReleasingID.vue') },

  { path: '/barangay/login', component: () => import('../views/Barangay/Login.vue') },
  { path: '/barangay/signup', component: () => import('../views/Barangay/Signup.vue') },
  { path: '/barangay/dashboard', component: () => import('../views/Barangay/Dashboard.vue') },
  { path: '/barangay/senior-queue', component: () => import('../views/Barangay/SeniorQueue.vue') },
  { path: '/barangay/messaging', component: () => import('../views/Barangay/Messaging.vue') },
  { path: '/barangay/notifications', component: () => import('../views/Barangay/Notifications.vue') }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router