import { getSupabase } from './supabase'

/* ───────────── Lectures publiques (clé anon, RLS SELECT public) ───────────── */

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

/* ───────────── Écritures : passent par les API routes serveur ─────────────
   Les fonctions ci-dessous sont appelées DEPUIS LE CLIENT.
   Elles ne touchent plus Supabase directement (RLS durcie) : tout passe
   par /api/admin/* qui vérifie le cookie JWT admin côté serveur. */

async function apiJson(url, method, body) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`)
  return json
}

export async function createProduit(produit) {
  const { produit: created } = await apiJson('/api/admin/produits', 'POST', produit)
  return created
}

export async function updateProduit(id, updates) {
  const { produit } = await apiJson(`/api/admin/produits/${id}`, 'PATCH', updates)
  return produit
}

export async function deleteProduit(id) {
  await apiJson(`/api/admin/produits/${id}`, 'DELETE')
}

/**
 * Upload une image via l'API serveur (validation type/taille/contenu).
 * @returns {Promise<string>} URL publique
 */
export async function uploadImage(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/admin/produits/upload', { method: 'POST', body: fd })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`)
  return json.url
}

export async function uploadImages(files) {
  const urls = []
  for (const file of files) {
    urls.push(await uploadImage(file))
  }
  return urls
}
