import { ref } from 'vue'
import { supabase } from '@/supabase/client'

const user = ref(null)

async function loadUser() {
  const { data } = await supabase.auth.getUser()
  user.value = data.user
}

async function signOut() {
  await supabase.auth.signOut()
  user.value = null
}

supabase.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user || null
})

export function useAuth() {
  return { user, loadUser, signOut }
}
