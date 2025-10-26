import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iiubfyjzsakpzstgasge.supabase.co' 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpdWJmeWp6c2FrcHpzdGdhc2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1ODIwMzgsImV4cCI6MjA2OTE1ODAzOH0.-yTBp7sFEThYLFDDeLXedS6mR_Q2jilqmfzuacEwSlQ'                     

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
export default supabase
