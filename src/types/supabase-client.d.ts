// src/types/supabase-client.d.ts
declare module '@/supabase/client' {
  import type { SupabaseClient } from '@supabase/supabase-js'
  export const supabase: SupabaseClient
  export default supabase
}

declare module '../supabase/client' {
  import type { SupabaseClient } from '@supabase/supabase-js'
  export const supabase: SupabaseClient
  export default supabase
}
