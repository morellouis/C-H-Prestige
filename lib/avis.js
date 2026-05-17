import { getSupabase } from './supabase'

/* ───────────── Lecture publique (clé anon, RLS : publie = true) ───────────── */

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

/* ───────────── Écritures via API serveur (vérif JWT admin) ───────────── */

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

export async function createAvis(avis) {
  const { avis: created } = await apiJson('/api/admin/avis', 'POST', avis)
  return created
}

export async function updateAvis(id, updates) {
  const { avis } = await apiJson(`/api/admin/avis/${id}`, 'PATCH', updates)
  return avis
}

export async function deleteAvis(id) {
  await apiJson(`/api/admin/avis/${id}`, 'DELETE')
}
