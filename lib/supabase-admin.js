import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Client Supabase avec la clé SERVICE_ROLE.
 * ⚠️ Contourne toutes les RLS — NE JAMAIS importer côté client.
 * Le package 'server-only' fait planter le build si ce fichier
 * est importé dans un composant client.
 */
let _admin = null

export function getSupabaseAdmin() {
  if (!_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE
    if (!url || !key) {
      throw new Error('Supabase admin non configuré (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE)')
    }
    _admin = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return _admin
}
