import { NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { createSessionToken, timingSafeEqual, COOKIE_NAME, SESSION_DURATION } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request) {
  // 1. Rate limit basé sur IP (5 tentatives par minute)
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown'
  const rl = checkRateLimit(`login:${ip}`, { max: 5, windowMs: 60_000 })
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Trop de tentatives. Réessayez dans ${rl.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    )
  }

  // 2. Lecture du mot de passe
  let password
  try {
    const body = await request.json()
    password = body.password
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    return NextResponse.json({ error: 'Serveur mal configuré' }, { status: 500 })
  }

  // 3. Comparaison en temps constant
  if (!timingSafeEqual(password || '', expected)) {
    // Petit délai aléatoire pour ralentir les attaques
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300))
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }

  // 4. Génération d'un JWT signé
  let token
  try {
    token = await createSessionToken({ role: 'admin' })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  // 5. Pose du cookie sécurisé
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  })

  return NextResponse.json({ ok: true })
}
