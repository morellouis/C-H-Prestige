import 'server-only'
import { getSupabaseAdmin } from './supabase-admin'

/**
 * Lectures admin (TOUS les avis, publiés ou non).
 * Utilise la clé service-role → uniquement côté serveur,
 * dans des pages déjà protégées par le middleware admin.
 */

export async function getAllAvis() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('avis')
    .select('*')
    .order('ordre', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getAvis(id) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('avis')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}
