import { SignJWT, jwtVerify } from 'jose'

const COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 jours

function getSecret() {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET manquant ou trop court (32 caractères minimum requis dans .env.local)')
  }
  return new TextEncoder().encode(secret)
}

/**
 * Comparaison string en temps constant (évite les attaques par timing)
 */
export function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

/**
 * Génère un JWT signé HS256 valide 7 jours.
 */
export async function createSessionToken(payload = { role: 'admin' }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .setJti(crypto.randomUUID())
    .sign(getSecret())
}

/**
 * Vérifie un JWT. Retourne le payload ou null si invalide/expiré.
 */
export async function verifySessionToken(token) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] })
    return payload
  } catch {
    return null
  }
}

export { COOKIE_NAME, SESSION_DURATION }
