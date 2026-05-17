import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { checkRateLimit } from '@/lib/rate-limit'
import { validateContact } from '@/lib/validation'

// POST /api/contact → enregistre un message (public, protégé)
export async function POST(request) {
  // 1. Rate limit par IP : 3 messages / 5 min
  const h = await headers()
  const ip =
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    'unknown'
  const rl = checkRateLimit(`contact:${ip}`, { max: 3, windowMs: 5 * 60_000 })
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Trop de messages envoyés. Réessayez dans ${rl.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  // 2. Honeypot : un champ caché que seuls les bots remplissent.
  //    On répond 200 (ok) pour ne pas leur signaler la détection.
  if (body?.website) {
    return NextResponse.json({ ok: true })
  }

  // 3. Validation stricte côté serveur
  const v = validateContact(body)
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 422 })

  // 4. Insertion via service-role (la table n'autorise plus l'insert public)
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from('messages').insert([v.value])
  if (error) {
    return NextResponse.json({ error: 'Envoi impossible, réessayez plus tard.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
