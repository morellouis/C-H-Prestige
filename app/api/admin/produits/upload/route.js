import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const TYPES_AUTORISES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const TAILLE_MAX = 8 * 1024 * 1024 // 8 Mo
// Signatures binaires (magic numbers) pour vérifier le vrai type du fichier
const SIGNATURES = {
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // "RIFF"
  'image/avif': [[0x00, 0x00, 0x00]], // ftyp box (vérif souple)
}

function signatureValide(type, bytes) {
  const sigs = SIGNATURES[type]
  if (!sigs) return false
  return sigs.some(sig => sig.every((b, i) => bytes[i] === b))
}

// POST /api/admin/produits/upload (multipart/form-data, champ "file")
export async function POST(request) {
  const denied = await requireAdmin()
  if (denied) return denied

  let formData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })
  }

  // 1. Type MIME déclaré
  if (!TYPES_AUTORISES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Format non autorisé (JPEG, PNG, WebP ou AVIF uniquement)' },
      { status: 415 }
    )
  }

  // 2. Taille
  if (file.size > TAILLE_MAX) {
    return NextResponse.json(
      { error: 'Fichier trop volumineux (8 Mo max)' },
      { status: 413 }
    )
  }

  // 3. Vérification du contenu réel (magic number)
  const buffer = Buffer.from(await file.arrayBuffer())
  if (!signatureValide(file.type, buffer.subarray(0, 8))) {
    return NextResponse.json(
      { error: 'Le contenu du fichier ne correspond pas à une image valide' },
      { status: 422 }
    )
  }

  // 4. Nom de fichier safe + extension dérivée du type réel
  const extByType = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
  }
  const ext = extByType[file.type]
  const fileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`

  const supabase = getSupabaseAdmin()
  const { error } = await supabase.storage
    .from('produits-images')
    .upload(fileName, buffer, { contentType: file.type, upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = supabase.storage.from('produits-images').getPublicUrl(fileName)
  return NextResponse.json({ url: data.publicUrl })
}
