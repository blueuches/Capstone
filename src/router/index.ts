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

import About from '@/views/Senior/About.vue'
import ApplyPage from '@/views/Senior/ApplyPage.vue'
import ApplyPageForm from '@/views/Senior/ApplyPageForm.vue'
//import ApplyPageFormFinish from '@/views/Senior/ApplyPageFinish.vue'
import ApplyPageSubmit from '@/views/Senior/ApplyPageSubmit.vue'
import Help from '@/views/Senior/Help.vue'
import IssuancePage from '@/views/Senior/IssuancePage.vue'
import IssuancePageInfo from '@/views/Senior/IssuancePageInfo.vue'
import Location from '@/views/Senior/Location.vue'
import ProfilePage from '@/views/Senior/ProfilePage.vue'
import RequirementsPage from '@/views/Senior/RequirementsPage.vue'
import RequirementsPageList from '@/views/Senior/RequirementsPageList.vue'
import RequirementsPageView from '@/views/Senior/RequirementsPageView.vue'
import Settings from '@/views/Senior/Settings.vue'
import StatusPage from '@/views/Senior/StatusPage.vue'
import StatusPageInfo from '@/views/Senior/StatusPageInfo.vue'
import StatusPageUpdate from '@/views/Senior/StatusPageUpdate.vue'
import Notification from '@/views/Senior/Notification.vue'

import ApplicantReview from '@/views/OSCA/ApplicantReview.vue'
import BarangaysPage from '@/views/OSCA/BarangaysPage.Vue'
import BarangaysPageInfo from '@/views/OSCA/BarangaysPageInfo.Vue'
import OSCAIssuancePage from '@/views/OSCA/IssuancePage.vue'
import OSCAIssuancePageInfo from '@/views/OSCA/IssuancePageInfo.vue'

import SeniorManagement from '@/views/Barangay/SeniorManagement.vue'

import Logs from '@/views/Admin/Logs.vue'
import Backup from '@/views/Admin/Backup.vue'
import FormBuilder from '@/views/Admin/FormBuilder.vue'
import IssuanceBuilder from '@/views/Admin/IssuanceBuilder.vue'
import RequirementBuilder from '@/views/Admin/RequirementBuilder.vue'
import UserManagement from '@/views/Admin/UserManagement.vue'

const routes = [
  // Public
  { path: '/', component: Welcome },
  { path: '/login', component: Login},
  { path: '/signup', component: SeniorSignup},
  { path: '/signup-staff', component: StaffSignup},
  { path: '/not-authorized', component: () => import('@/views/NotAuthorized.vue') },

  //Dashboards
  { path: '/admin/dashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin'}},
  { path: '/osca/dashboard', component: OSCADashboard, meta: { requiresAuth: true, role: 'osca_staff' }},
  { path: '/barangay/dashboard', component: BarangayDashboard, meta: { requiresAuth: true, role: 'barangay_staff' }},
  { path: '/senior/dashboard', component: SeniorDashboard, meta: { requiresAuth: true, role: 'senior' }},

  { path: '/senior/dashboard/mystatus', component: StatusPage, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/dashboard/myrequirements', component: RequirementsPage, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/dashboard/apply', component: ApplyPage, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/dashboard/applications', component: IssuancePage, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/dashboard/location', component: Location, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/dashboard/help', component: Help, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/notifications', component: Notification, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/profile', component: ProfilePage, meta: { requiresAuth: true, role: 'senior' }},


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
