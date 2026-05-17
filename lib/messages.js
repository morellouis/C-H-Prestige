/* Côté client uniquement : tout passe par les API routes serveur.
   La table `messages` n'autorise plus aucun accès via la clé anon. */

export async function envoyerMessage({ nom, email, sujet, message, website }) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom, email, sujet, message, website }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error || 'Envoi impossible')
  return json
}

export async function marquerCommeLu(id, lu = true) {
  const res = await fetch(`/api/admin/messages/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lu }),
  })
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(json.error || 'Erreur')
  }
}

export async function supprimerMessage(id) {
  const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(json.error || 'Erreur')
  }
}
