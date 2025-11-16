// src/composables/useBarangayContext.ts
import { ref } from 'vue'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/composables/useAuth'

// ---------- Raw types (exactly what Supabase returns) ----------

type BrgyRefRaw = { id: number; name: string }

type OrgRefRaw = {
  id: number
  kind: string
  barangay_id: number | null
  barangay: BrgyRefRaw[] | null
}

type BrgyMembershipRaw = {
  id: number
  status: string
  role: { code?: string }[] | null
  organization: OrgRefRaw[] | null
}

// ---------- Clean / normalized types used in the app ----------

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

      const { data, error: mErr } = await supabase
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

      // Make TS happy by typing the raw result first
      const memsRaw = (data ?? []) as BrgyMembershipRaw[]

      // Normalize from arrays → single items + simpler shape
      const mems: BrgyMembership[] = memsRaw.map((m) => {
        const firstOrg = m.organization?.[0] ?? null
        const firstBrgy = firstOrg?.barangay?.[0] ?? null

        return {
          role: m.role?.[0] ?? null,
          organization: firstOrg
            ? {
                id: firstOrg.id,
                kind: firstOrg.kind,
                barangay_id: firstOrg.barangay_id,
                barangay: firstBrgy
                  ? { id: firstBrgy.id, name: firstBrgy.name }
                  : null,
              }
            : null,
        }
      })

      const brgyMem = mems.find((m) => {
        const roleCode = m.role?.code
        const org = m.organization
        return roleCode === 'brgy_staff' && org?.kind === 'barangay'
      })

      const org = brgyMem?.organization

      if (!org) {
        throw new Error('No active barangay staff membership.')
      }

      orgId.value = org.id
      barangayId.value = org.barangay_id ?? null
      barangayName.value = org.barangay?.name ?? 'Barangay'

      return {
        orgId: orgId.value,
        barangayId: barangayId.value,
        barangayName: barangayName.value,
      }
    } finally {
      loading.value = false
    }
  }

  return { loading, orgId, barangayId, barangayName, fetchContext }
}
