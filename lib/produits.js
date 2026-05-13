import { getSupabase } from './supabase'

export async function getProduits() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('produits')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getProduit(id) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('produits')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createProduit(produit) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('produits')
    .insert([produit])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProduit(id, updates) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('produits')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProduit(id) {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('produits')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function uploadImage(file) {
  const supabase = getSupabase()
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage
    .from('produits-images')
    .upload(fileName, file)
  if (error) throw error
  const { data } = supabase.storage
    .from('produits-images')
    .getPublicUrl(fileName)
  return data.publicUrl
}

export async function uploadImages(files) {
  const urls = []
  for (const file of files) {
    urls.push(await uploadImage(file))
  }
  return urls
}
