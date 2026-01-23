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
import ApplyPageSubmit from '@/views/Senior/ApplyPageSubmit.vue'
import Help from '@/views/Senior/Help.vue'
import IssuancePage from '@/views/Senior/IssuancePage.vue'
import IssuancePageInfo from '@/views/Senior/IssuancePageInfo.vue'
import Location from '@/views/Senior/Location.vue'
import ProfilePage from '@/views/Senior/ProfilePage.vue'
import RequirementsPage from '@/views/Senior/RequirementsPage.vue'
import RequirementsPageList from '@/views/Senior/RequirementsPageList.vue'
//import RequirementsPageView from '@/views/Senior/RequirementsPageView.vue'
import Settings from '@/views/Senior/Settings.vue'
import StatusPage from '@/views/Senior/StatusPage.vue'
import StatusPageUpdate from '@/views/Senior/StatusPageUpdate.vue'
import Notification from '@/views/Senior/Notification.vue'

//OSCA
import ApplicantReview from '@/views/OSCA/ApplicantReview.vue'
import BarangaysPage from '@/views/OSCA/BarangaysPage.Vue'
import BarangaysPageInfo from '@/views/OSCA/BarangaysPageInfo.Vue'
import OSCAIssuancePage from '@/views/OSCA/IssuancePage.vue'
import OSCAIssuancePageInfo from '@/views/OSCA/IssuancePageInfo.vue'
import OSCAAnnouncement from '@/views/OSCA/Announcement.vue' //share?
import OSCAMessagePage from '@/views/OSCA/MessagePage.vue'
import OSCANotification from '@/views/OSCA/Notifications.vue'
import OSCAProfilePage from '@/views/OSCA/ProfilePage.vue'
import OSCAProfilePageEdit from '@/views/OSCA/ProfilePageEdit.vue'
import OSCASearch from '@/views/OSCA/Search.vue'
import OSCAActivityPage from '@/views/OSCA/ActivityPage.vue'
import OSCASettings from '@/views/OSCA/Settings.vue'
import OSCAAbout from '@/views/OSCA/About.vue'
import BRGYMessage from '@/views/OSCA/BRGYMessage.vue'
import BRGYProfile from '@/views/OSCA/StaffProfile.vue'

//BRGY
import SeniorManagement from '@/views/Barangay/SeniorManagement.vue'
import SeniorView from '@/views/Barangay/SeniorView.vue'
import SeniorList from '@/views/Barangay/SeniorList.vue'
import BRGYAnnouncement from '@/views/Barangay/Announcement.vue'
import BRGYMessagePage from '@/views/Barangay/MessagePage.vue'
import BRGYNotifications from '@/views/Barangay/Notifications.vue'
import BRGYProfilePage from '@/views/Barangay/ProfilePage.vue'
import BRGYProfilePageEdit from '@/views/Barangay/ProfilePageEdit.vue'
import BRGYSettings from '@/views/Barangay/Settings.vue'
import BRGYAbout from '@/views/Barangay/About.vue'

//ADMIN
import Logs from '@/views/Admin/Logs.vue'
import Backup from '@/views/Admin/Backup.vue'
import FormBuilder from '@/views/Admin/FormBuilder.vue'
import FormBuilderWorkaround from '@/views/Admin/FormBuilderWorkaround.vue'
import UserManagement from '@/views/Admin/UserManagement.vue'
import Edit from '@/views/Admin/Edit.vue'
import EditIssuanceOption from '@/views/Admin/EditIssuanceOption.vue'
import EditIssuanceOptionEdit from '@/views/Admin/EditIssuanceOptionEdit.vue'
import EditIssuanceRequirements from '@/views/Admin/EditIssuanceRequirements.vue'
import EditRequirementsOption from '@/views/Admin/EditRequirementsOption.vue'
import EditRequirementsOptionEdit from '@/views/Admin/EditRequirementsOptionsEdit.vue'

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

  //Senior dashboard
  { path: '/senior/dashboard/mystatus', component: StatusPage, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/dashboard/myrequirements', component: RequirementsPage, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/dashboard/apply', component: ApplyPage, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/dashboard/applications', component: IssuancePage, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/dashboard/location', component: Location, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/dashboard/help', component: Help, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/notifications', component: Notification, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/profile', component: ProfilePage, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/about', component: About, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/settings', component: Settings, meta: { requiresAuth: true, role: 'senior' }},

  //senior functions
  { path: '/senior/dashboard/mystatus/updates', component: StatusPageUpdate, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/dashboard/myrequirements/list', component: RequirementsPageList, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/dashboard/apply/submitlist', component: ApplyPageSubmit, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/dashboard/apply/form', component: ApplyPageForm, meta: { requiresAuth: true, role: 'senior' }},
  { path: '/senior/dashboard/applications/info', component: IssuancePageInfo, meta: { requiresAuth: true, role: 'senior' }},

  //OSCA dashboard
  { path: '/osca/applicant/:seniorId', name:'ApplicantReview',props:true ,component: ApplicantReview, meta: { requiresAuth: true, role: 'osca_staff' }},
  { path: '/osca/message', component: OSCAMessagePage, meta: { requiresAuth: true, role: 'osca_staff' }},
  { path: '/osca/barangays', component: BarangaysPage, meta: { requiresAuth: true, role: 'osca_staff' }},
  { path: '/osca/barangay/message/:barangayId',name: 'BRGYMessage',props:true, component: BRGYMessage, meta: { requiresAuth: true, role: 'osca_staff' }},
  { path: '/osca/barangay/staff/profile/:staffId',name: 'BRGYProfile',props:true, component: BRGYProfile, meta: { requiresAuth: true, role: 'osca_staff' }},
  { path: '/osca/barangayView/:barangayId', name: 'barangay-info', props:true, component: BarangaysPageInfo, meta: { requiresAuth: true, role: 'osca_staff' }},
  { path: '/osca/programs', component: OSCAIssuancePage, meta: { requiresAuth: true, role: 'osca_staff' }},
  { path: '/osca/programView/:issuanceTypeId',name: 'issuance-info', component: OSCAIssuancePageInfo,props:true, meta: { requiresAuth: true, role: 'osca_staff' }},
  { path: '/osca/announcement', component: OSCAAnnouncement, meta: { requiresAuth: true, role: 'osca_staff' }},
  { path: '/osca/notification', component: OSCANotification, meta: { requiresAuth: true, role: 'osca_staff' }},
  { path: '/osca/profile', component: OSCAProfilePage, meta: { requiresAuth: true, role: 'osca_staff' }},
  { path: '/osca/profile/edit', component: OSCAProfilePageEdit, meta: { requiresAuth: true, role: 'osca_staff' }},
  { path: '/osca/search', component: OSCASearch, meta: { requiresAuth: true, role: 'osca_staff' }},
  { path: '/osca/activity', component: OSCAActivityPage, meta: { requiresAuth: true, role: 'osca_staff' }},
  { path: '/osca/settings', component: OSCASettings, meta: { requiresAuth: true, role: 'osca_staff' }},
  { path: '/osca/about', component: OSCAAbout, meta: { requiresAuth: true, role: 'osca_staff' }},

  
  //BRGY dashboard
  { path: '/barangay/users', component: SeniorList, meta: { requiresAuth: true, role: 'barangay_staff' }},
  { path: '/barangay/userview', component: SeniorView, meta: { requiresAuth: true, role: 'barangay_staff' }},
  { path: '/barangay/management', component: SeniorManagement, meta: { requiresAuth: true, role: 'barangay_staff' }},
  { path: '/barangay/announcement', component: BRGYAnnouncement, meta: { requiresAuth: true, role: 'barangay_staff' }},
  { path: '/barangay/message', component: BRGYMessagePage, meta: { requiresAuth: true, role: 'barangay_staff' }},
  { path: '/barangay/notification', component: BRGYNotifications, meta: { requiresAuth: true, role: 'barangay_staff' }},
  { path: '/barangay/profile', component: BRGYProfilePage, meta: { requiresAuth: true, role: 'barangay_staff' }},
  { path: '/barangay/profile/edit', component: BRGYProfilePageEdit, meta: { requiresAuth: true, role: 'barangay_staff' }},
  { path: '/barangay/settings', component: BRGYSettings, meta: { requiresAuth: true, role: 'barangay_staff' }},
  { path: '/barangay/about', component: BRGYAbout, meta: { requiresAuth: true, role: 'barangay_staff' }},


  //ADMIN
  { path: '/admin/logs', component: Logs, meta: { requiresAuth: true, role: 'admin'}},
  { path: '/admin/backup', component: Backup, meta: { requiresAuth: true, role: 'admin'}},
  { path: '/admin/formbuilder', component: FormBuilder, meta: { requiresAuth: true, role: 'admin'}},
  { path: '/admin/formbuilder/workaround/:id',name: 'FormBuilderWorkaround', component: FormBuilderWorkaround,props:true, meta: { requiresAuth: true, role: 'admin'}},
  { path: '/admin/users', component: UserManagement, meta: { requiresAuth: true, role: 'admin'}},
  { path: '/admin/edit', component: Edit, meta: { requiresAuth: true, role: 'admin'}},
  { path: '/admin/edit/issuance', component: EditIssuanceOption, meta: { requiresAuth: true, role: 'admin'}},
  { path: '/admin/edit/issuance/edit/:id',name: 'EditIssuance', component: EditIssuanceOptionEdit,props:true,  meta: { requiresAuth: true, role: 'admin'}},
  { path: '/admin/edit/issuance/requirements/:id',name: 'EditIssuanceRequirements', component: EditIssuanceRequirements,props:true, meta: { requiresAuth: true, role: 'admin'}},
  { path: '/admin/edit/requirements', component: EditRequirementsOption, meta: { requiresAuth: true, role: 'admin'}},
  { path: '/admin/edit/requirements/edit/:id',name: 'EditRequirements', component: EditRequirementsOptionEdit,props:true, meta: { requiresAuth: true, role: 'admin'}},
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
