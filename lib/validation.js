/**
 * Helpers de validation/sanitisation serveur.
 * Toujours valider côté serveur — le client peut mentir.
 */

export function cleanString(v, { max = 500, min = 0 } = {}) {
  if (typeof v !== 'string') return null
  const s = v.trim()
  if (s.length < min || s.length > max) return null
  return s
}

export function isEmail(v) {
  if (typeof v !== 'string') return false
  if (v.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
}

export function toPositiveNumber(v, { max = 10_000_000 } = {}) {
  const n = typeof v === 'number' ? v : parseFloat(v)
  if (!Number.isFinite(n) || n < 0 || n > max) return null
  return n
}

export function isStringArray(v, { maxItems = 20, maxLen = 600 } = {}) {
  if (!Array.isArray(v)) return false
  if (v.length > maxItems) return false
  return v.every(x => typeof x === 'string' && x.length <= maxLen)
}

/**
 * Valide le payload d'un produit (création ou mise à jour).
 * @returns {{ ok: true, value: object } | { ok: false, error: string }}
 */
export function validateProduit(body) {
  const nom = cleanString(body?.nom, { min: 1, max: 200 })
  if (!nom) return { ok: false, error: 'Nom invalide (1 à 200 caractères)' }

  const prix = toPositiveNumber(body?.prix)
  if (prix === null) return { ok: false, error: 'Prix invalide' }

  const description = body?.description ? cleanString(body.description, { max: 5000 }) : ''
  if (description === null) return { ok: false, error: 'Description trop longue (max 5000)' }

  const categorie = body?.categorie ? cleanString(body.categorie, { max: 80 }) : ''
  if (categorie === null) return { ok: false, error: 'Catégorie invalide' }

  const images = body?.images ?? []
  if (!isStringArray(images)) return { ok: false, error: 'Images invalides' }

  // Les images doivent provenir du bucket Supabase
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const imagesOk = images.every(u => u.startsWith(base + '/storage/v1/object/public/'))
  if (!imagesOk) return { ok: false, error: 'URL d\'image non autorisée' }

  return {
    ok: true,
    value: {
      nom,
      description,
      prix,
      categorie,
      en_vedette: Boolean(body?.en_vedette),
      images,
      image_url: images[0] || null,
    },
  }
}

/**
 * Valide le payload d'un avis.
 */
export function validateAvis(body) {
  const auteur = cleanString(body?.auteur, { min: 1, max: 100 })
  if (!auteur) return { ok: false, error: 'Auteur invalide (1 à 100 caractères)' }

  const texte = cleanString(body?.texte, { min: 1, max: 2000 })
  if (!texte) return { ok: false, error: 'Texte invalide (1 à 2000 caractères)' }

  const achat = body?.achat ? cleanString(body.achat, { max: 150 }) : ''
  if (achat === null) return { ok: false, error: 'Champ "achat" trop long' }

  const note = Number(body?.note)
  const notesValides = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
  if (!notesValides.includes(note)) return { ok: false, error: 'Note invalide' }

  const ordre = Number.isFinite(Number(body?.ordre)) ? parseInt(body.ordre, 10) : 0

  return {
    ok: true,
    value: {
      auteur,
      texte,
      achat,
      note,
      ordre,
      publie: Boolean(body?.publie),
    },
  }
}

/**
 * Valide le payload du formulaire de contact.
 */
export function validateContact(body) {
  const nom = cleanString(body?.nom, { min: 1, max: 100 })
  if (!nom) return { ok: false, error: 'Nom requis (max 100 caractères)' }

  if (!isEmail(body?.email)) return { ok: false, error: 'Email invalide' }

  const sujet = body?.sujet ? cleanString(body.sujet, { max: 200 }) : ''
  if (sujet === null) return { ok: false, error: 'Sujet trop long (max 200)' }

  const message = cleanString(body?.message, { min: 1, max: 5000 })
  if (!message) return { ok: false, error: 'Message requis (max 5000 caractères)' }

  return {
    ok: true,
    value: { nom, email: body.email.trim(), sujet, message },
  }
}
