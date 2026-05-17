import 'server-only'
import { getSupabaseAdmin } from './supabase-admin'

/**
 * Lecture des messages de contact — service-role, serveur uniquement.
 * Appelée depuis la page admin (déjà protégée par le middleware).
 */
export async function getMessages() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
