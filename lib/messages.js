import { getSupabase } from './supabase'

export async function envoyerMessage({ nom, email, sujet, message }) {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('messages')
    .insert([{ nom, email, sujet, message }])
  if (error) throw error
}

export async function getMessages() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function marquerCommeLu(id) {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('messages')
    .update({ lu: true })
    .eq('id', id)
  if (error) throw error
}

export async function supprimerMessage(id) {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id)
  if (error) throw error
}
