<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-white p-6">
    <div class="w-full max-w-xl bg-white rounded-3xl shadow-xl p-8 sm:p-10 relative">

      <!-- Back -->
      <router-link
        to="/"
        class="absolute top-4 left-4 inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 font-semibold"
        aria-label="Back to Home"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Home
      </router-link>

      <h1 class="text-3xl sm:text-4xl font-extrabold text-emerald-700 text-center mb-2">Sign Up (Staff)</h1>
      <p class="text-gray-600 text-center mb-6">Create your staff account for OSCA or Barangay access.</p>

      <form class="grid grid-cols-1 gap-5" @submit.prevent="handleSignup" novalidate>
        <!-- Invite Token (optional, paste if you received one) -->
        <div>
          <label for="token" class="block text-sm font-semibold text-gray-700 mb-1">Invite Token (optional)</label>
          <input
            id="token"
            type="text"
            placeholder="Paste token if you received an invite"
            v-model.trim="form.token"
            @blur="form.token && fetchInvite()"
            class="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
          />
          <p v-if="inviteStatus" class="mt-1 text-sm" :class="inviteStatus.ok ? 'text-emerald-700' : 'text-red-600'">
            {{ inviteStatus.msg }}
          </p>
        </div>

        <!-- Full Name -->
        <div>
          <label for="name" class="block text-sm font-semibold text-gray-700 mb-1">Full name</label>
          <input
            id="name"
            type="text"
            placeholder="Full name"
            v-model.trim="form.name"
            required
            class="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
            autocomplete="name"
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">Work email</label>
          <input
            id="email"
            type="email"
            placeholder="you@agency.gov.ph"
            v-model.trim="form.email"
            required
            class="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
            autocomplete="email"
          />
        </div>

        <!-- Passwords -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              id="password"
              :type="showPw ? 'text' : 'password'"
              placeholder="Min 8 characters"
              v-model="form.password"
              required
              minlength="8"
              class="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
              autocomplete="new-password"
            />
            <button type="button" class="text-xs mt-1 text-gray-600 hover:text-gray-800" @click="showPw = !showPw">
              {{ showPw ? 'Hide' : 'Show' }} password
            </button>
          </div>
          <div>
            <label for="confirm" class="block text-sm font-semibold text-gray-700 mb-1">Confirm password</label>
            <input
              id="confirm"
              :type="showPw ? 'text' : 'password'"
              placeholder="Re-enter password"
              v-model="form.confirm"
              required
              class="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
              autocomplete="new-password"
            />
            <p v-if="form.confirm && form.password !== form.confirm" class="text-xs text-red-600 mt-1">Passwords do not match.</p>
          </div>
        </div>

        <!-- Organization Type -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Organization type</label>
          <div class="grid grid-cols-2 gap-3">
            <button type="button"
              class="px-4 py-3 rounded-xl border text-center font-semibold"
              :class="form.orgKind === 'osca' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-gray-300 text-gray-700'"
              @click="setOrgKind('osca')"
              :disabled="lockedFromInvite"
            >OSCA</button>
            <button type="button"
              class="px-4 py-3 rounded-xl border text-center font-semibold"
              :class="form.orgKind === 'barangay' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-gray-300 text-gray-700'"
              @click="setOrgKind('barangay')"
              :disabled="lockedFromInvite"
            >Barangay</button>
          </div>
          <p class="text-xs text-gray-500 mt-1">Admins are pre-created and cannot sign up here.</p>
        </div>

        <!-- OSCA org select (only if multiple) -->
        <div v-if="form.orgKind === 'osca' && oscaOptions.length > 1">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Select OSCA</label>
          <select v-model.number="form.organizationId"
                  class="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
                  :disabled="lockedFromInvite">
            <option :value="0" disabled>Select OSCA</option>
            <option v-for="o in oscaOptions" :key="o.id" :value="o.id">{{ o.name }}</option>
          </select>
        </div>

        <!-- Barangay org select -->
        <div v-if="form.orgKind === 'barangay'">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Select Barangay</label>
          <select v-model.number="form.organizationId"
                  class="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-700"
                  :disabled="lockedFromInvite">
            <option :value="0" disabled>Select Barangay</option>
            <option v-for="b in barangayOptions" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 text-xl rounded-xl font-bold shadow-md transition-all disabled:opacity-60"
        >
          <span v-if="!loading">Register as Staff</span>
          <span v-else>Creating your staff account…</span>
        </button>

        <!-- Messages -->
        <p v-if="errorMsg" class="text-red-600 text-sm">{{ errorMsg }}</p>
        <p v-if="successMsg" class="text-emerald-700 text-sm">{{ successMsg }}</p>
      </form>

      <!-- Senior link -->
      <p class="mt-6 text-sm text-gray-600">
        Are you a senior citizen?
        <router-link to="/signup" class="text-emerald-700 font-semibold underline">Sign up here</router-link>
      </p>

      <!-- Back to login -->
      <p class="mt-2 text-sm text-gray-600">
        Already have an account?
        <router-link to="/login" class="text-emerald-700 font-semibold underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase/client'

const router = useRouter()

// UI state
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const showPw = ref(false)

// org data
const oscaOptions = ref([])
const barangayOptions = ref([])

const form = ref({
  token: '',          // optional invite token
  name: '',
  email: '',
  password: '',
  confirm: '',
  orgKind: null,      // 'osca' | 'barangay'
  organizationId: 0,  // selected Organizations.id
})

const inviteStatus = ref(null)  // { ok: boolean, msg: string }
const lockedFromInvite = computed(() => !!(inviteStatus.value && inviteStatus.value.ok))

const singleOscaId = computed(() =>
  oscaOptions.value.length === 1 ? oscaOptions.value[0].id : null
)


function setOrgKind(kind) {
  form.value.orgKind = kind
  form.value.organizationId = 0

  if (kind === 'osca' && singleOscaId.value) {
    form.value.organizationId = singleOscaId.value
  } else if (kind === 'barangay' && barangayOptions.value.length === 1) {
    form.value.organizationId = barangayOptions.value[0].id
  }
}

// Load org options
onMounted(async () => {
  await Promise.all([loadOsca(), loadBarangays()])
})

async function loadOsca() {
  const { data, error } = await supabase
    .from('Organizations')
    .select('id, name')
    .eq('kind', 'osca')
    .order('name', { ascending: true })

  if (!error && data) {
    oscaOptions.value = data
    if (form.value.orgKind === 'osca' && singleOscaId.value) {
      form.value.organizationId = singleOscaId.value
    }
  } else {
    oscaOptions.value = []
  }
}

async function loadBarangays() {
  const { data, error } = await supabase
    .from('Organizations')
    .select('id, name')
    .eq('kind', 'barangay')
    .order('name', { ascending: true })
  if (!error && data) barangayOptions.value = data
}

// Optional: invite flow (recommended to prevent self-escalation)
async function fetchInvite() {
  inviteStatus.value = null
  errorMsg.value = ''
  if (!form.value.token) return

  const { data, error } = await supabase
    .from('StaffInvites')
    .select(`
      token, expires_at, used_at,
      organization_id,
      role_id,
      organization:Organizations(id, name, kind),
      role:Roles(id, code, name)
    `)
    .eq('token', form.value.token)
    .maybeSingle()

  if (error || !data) {
    inviteStatus.value = { ok: false, msg: 'Invalid token.' }
    return
  }

  const now = new Date()
  if (data.used_at) {
    inviteStatus.value = { ok: false, msg: 'This token was already used.' }
    return
  }
  if (new Date(data.expires_at) < now) {
    inviteStatus.value = { ok: false, msg: 'This token has expired.' }
    return
  }

  // lock orgKind + organizationId based on invite
  form.value.orgKind = data.organization.kind
  form.value.organizationId = data.organization_id

  // We’ll also remember desired role from the invite during signup
  inviteStatus.value = {
    ok: true,
    msg: `Invite recognized: ${data.role.name} at ${data.organization.name}.`
  }
}

// helpers
async function getRoleId(code) {
  const { data, error } = await supabase.from('Roles').select('id').eq('code', code).maybeSingle()
  if (error || !data) return null
  return data.id
}

function roleCodeFromKind(kind) {
  return kind === 'osca' ? 'osca_staff' : 'brgy_staff'
}

// main
async function handleSignup() {
  errorMsg.value = ''
  successMsg.value = ''

  // basic validation
  if (!form.value.name || !form.value.email || !form.value.password) {
    errorMsg.value = 'Please fill out name, email, and password.'
    return
  }
  if (form.value.password.length < 8) {
    errorMsg.value = 'Password must be at least 8 characters.'
    return
  }
  if (form.value.password !== form.value.confirm) {
    errorMsg.value = 'Passwords do not match.'
    return
  }

  // org validation (unless locked by valid invite)
// org validation (unless locked by valid invite)
if (!lockedFromInvite.value) {
  if (!form.value.orgKind) {
    errorMsg.value = 'Select organization type (OSCA or Barangay).'
    return
  }

  // If OSCA and there’s only one, auto-pick it if still empty
  if (form.value.orgKind === 'osca' && !form.value.organizationId && singleOscaId.value) {
    form.value.organizationId = singleOscaId.value
  }

  // Only block when there are multiple choices
  if (form.value.orgKind === 'osca' && oscaOptions.value.length > 1 && !form.value.organizationId) {
    errorMsg.value = 'Select an OSCA.'
    return
  }
  if (form.value.orgKind === 'barangay' && barangayOptions.value.length > 0 && !form.value.organizationId) {
    errorMsg.value = 'Select a Barangay.'
    return
  }
}

  loading.value = true
  try {
    // 1) Auth signup
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: { data: { full_name: form.value.name, active_role: 'pending_staff' } }
    })
    if (signUpErr) throw signUpErr
    const user = signUpData?.user
    if (!user) throw new Error('No user returned from sign up.')

    // 2) Upsert into public.Users
    const { error: upErr } = await supabase
      .from('Users')
      .upsert({ user_id: user.id, full_name: form.value.name, login_pref: 'email',phone: null, })
    if (upErr) throw upErr

    // 3) Resolve organization & role
    let organization_id = form.value.organizationId
    let role_id = null

    if (lockedFromInvite.value) {
      // Load invite again to get role/org (guard against UI tampering)
      const { data: inv, error: invErr } = await supabase
        .from('StaffInvites')
        .select('organization_id, role_id')
        .eq('token', form.value.token)
        .maybeSingle()
      if (invErr || !inv) throw new Error('Invite not found on finalize.')
      organization_id = inv.organization_id
      role_id = inv.role_id
    } else {
      // Open self-signup: limit to osca_staff / brgy_staff only
      const code = roleCodeFromKind(form.value.orgKind)
      role_id = await getRoleId(code)
      if (!role_id) throw new Error(`Role not found: ${code}`)
    }

    // 4) Create Membership (RLS must allow user_id = auth.uid())
    const { error: memErr } = await supabase
      .from('Memberships')
      .insert({
        user_id: user.id,
        organization_id,
        role_id,
        status: 'active'
      })
    if (memErr) throw memErr

    // 5) (Optional) Mark invite used
    if (lockedFromInvite.value) {
      await supabase
        .from('StaffInvites')
        .update({ used_at: new Date().toISOString() })
        .eq('token', form.value.token)
        .then(() => {})
    }

    // 6) Set active_role in JWT to staff role so guards/RLS work immediately
    const finalRole = lockedFromInvite.value
      ? 'staff'
      : (form.value.orgKind === 'osca' ? 'osca_staff' : 'brgy_staff')

    await supabase.auth.updateUser({ data: { active_role: finalRole } })

    successMsg.value = 'Staff account created.'
    setTimeout(() => {
      if (form.value.orgKind === 'osca' || lockedFromInvite.value) {
        // if invite could be osca or brgy; fetch org.kind to decide:
        if (lockedFromInvite.value) {
          router.push('/osca/dashboard') // safe default; adjust by querying org.kind if you want exact
        } else {
          router.push('/osca/dashboard')
        }
      } else {
        router.push('/barangay/dashboard')
      }
    }, 400)
  } catch (err) {
    errorMsg.value = err?.message || 'Signup failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
