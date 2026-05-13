import { createClient } from '@supabase/supabase-js'

let _supabase = null

export function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key || url === 'your_supabase_project_url') {
      throw new Error('Supabase non configuré — remplissez .env.local')
    }
    _supabase = createClient(url, key)
  }
  return _supabase
}
