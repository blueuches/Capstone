<script setup>
import { useAuth } from '@/composables/useAuth'
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase/client'

const auth = useAuth()
const roles = ref([])
const rpcOk = ref(null)
const joinOk = ref(null)
const memberships = ref([])

onMounted(async () => {
  await auth.init()
  // Try RPC
  try {
    const { data, error } = await supabase.rpc('get_my_roles')
    rpcOk.value = error ? String(error.message || error) : 'ok'
    roles.value = Array.isArray(data) ? data : []
  } catch (e) {
    rpcOk.value = 'RPC threw: ' + e?.message
  }

  // Try join
  try {
    const { data, error } = await supabase
      .from('Memberships')
      .select('user_id, role_id, status, Roles!inner(code)')
      .eq('status', 'active')
    joinOk.value = error ? String(error.message || error) : 'ok'
    memberships.value = data || []
  } catch (e) {
    joinOk.value = 'Join threw: ' + e?.message
  }
})
</script>

<template>
  <div class="min-h-dvh bg-emerald-50 p-6">
    <div class="max-w-3xl mx-auto bg-white shadow rounded-2xl p-6">
      <h1 class="text-xl font-bold text-emerald-700 mb-4">Auth Debug</h1>

      <div class="grid gap-3">
        <div class="p-3 bg-emerald-50 rounded">
          <div class="font-semibold">Signed in?</div>
          <div>{{ auth.isSignedIn ? 'yes' : 'no' }}</div>
        </div>

        <div class="p-3 bg-emerald-50 rounded">
          <div class="font-semibold">User</div>
          <pre class="text-xs overflow-auto">{{ auth.user }}</pre>
        </div>

        <div class="p-3 bg-emerald-50 rounded">
          <div class="font-semibold">Composabe role/seniorId/orgId</div>
          <pre class="text-xs overflow-auto">{{ { role: auth.role, seniorId: auth.seniorId, orgId: auth.orgId } }}</pre>
        </div>

        <div class="p-3 bg-emerald-50 rounded">
          <div class="font-semibold">get_my_roles RPC</div>
          <div class="text-xs mb-1">status: {{ rpcOk }}</div>
          <pre class="text-xs overflow-auto">{{ roles }}</pre>
        </div>

        <div class="p-3 bg-emerald-50 rounded">
          <div class="font-semibold">Memberships join</div>
          <div class="text-xs mb-1">status: {{ joinOk }}</div>
          <pre class="text-xs overflow-auto">{{ memberships }}</pre>
        </div>

        <div class="pt-2">
          <router-link to="/" class="text-emerald-700 underline">Back to Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
