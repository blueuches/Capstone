import { supabase } from '@/supabase/client'

export async function resolveRoleAndRoute(): Promise<string | null> {
  const { data: u } = await supabase.auth.getUser();
  const user = u.user;
  if (!user) return null;

  // 1) JWT metadata wins if present
  const metaRole = (user.user_metadata?.active_role as string) || undefined;
  if (metaRole) return metaRole;

  // 2) Try staff membership -> role
  const { data: mem, error: memErr } = await supabase
    .from('Memberships')
    .select('role:Roles!inner(code)')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (!memErr) {
    const roleCode = (mem as any)?.role?.code as string | undefined;
    if (roleCode) {
      await supabase.auth.updateUser({ data: { active_role: roleCode } });
      return roleCode;
    }
  }

  // 3) Fallback: senior if they have a SeniorCitizens row
  const { data: sc } = await supabase
    .from('SeniorCitizens')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (sc) {
    await supabase.auth.updateUser({ data: { active_role: 'senior' } });
    return 'senior';
  }

  return null;
}
