// src/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl: string = 'https://rensbwwnthgpmtzbzbqo.supabase.co'
const supabaseKey: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbnNid3dudGhncG10emJ6YnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MjUwODMsImV4cCI6MjA3OTMwMTA4M30.E8D4wi6J2sBXGwZIFRU0m4dEeCM8ZapsQMRgEAg27uI'

export const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase
