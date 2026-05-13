import { getSupabase } from './supabase'

export async function getAvisPublies() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('avis')
    .select('*')
    .eq('publie', true)
    .order('ordre', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getAllAvis() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('avis')
    .select('*')
    .order('ordre', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getAvis(id) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('avis')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createAvis(avis) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('avis')
    .insert([avis])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateAvis(id, updates) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('avis')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteAvis(id) {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('avis')
    .delete()
    .eq('id', id)
  if (error) throw error
}
