// src/composables/useBarangayContext.ts
import { ref } from 'vue'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/composables/useAuth'

// Lightweight result types for the select() below
type BrgyRef = { id: number; name: string }
type OrgRef = {
  id: number
  kind: string
  barangay_id: number | null
  barangay: BrgyRef | null
}
type BrgyMembership = {
  role?: { code?: string } | null
  organization?: OrgRef | null
}

export function useBarangayContext() {
  const loading = ref(false)
  const orgId = ref<number | null>(null)
  const barangayId = ref<number | null>(null)
  const barangayName = ref<string>('')

  const { user } = useAuth()

  const fetchContext = async () => {
    loading.value = true
    try {
      const userId = user.value?.id
      if (!userId) throw new Error('Not authenticated.')

      const { data: memsRaw, error: mErr } = await supabase
        .from('Memberships')
        .select(`
          id, status,
          role:Roles!inner(code),
          organization:Organizations!inner(
            id, kind, barangay_id,
            barangay:Barangays(id, name)
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')

      if (mErr) throw mErr

      const mems = (memsRaw ?? []) as BrgyMembership[]

      const brgyMem = mems.find(
        m => m.role?.code === 'brgy_staff' && m.organization?.kind === 'barangay'
      )

      if (!brgyMem?.organization) {
        throw new Error('No active barangay staff membership.')
      }

      orgId.value = brgyMem.organization.id
      barangayId.value = brgyMem.organization.barangay_id
      barangayName.value = brgyMem.organization.barangay?.name ?? 'Barangay'

      return {
        orgId: orgId.value,
        barangayId: barangayId.value,
        barangayName: barangayName.value
      }
    } finally {
      loading.value = false
    }
  }

  return { loading, orgId, barangayId, barangayName, fetchContext }
}