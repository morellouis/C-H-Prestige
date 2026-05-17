import 'server-only'
import { cookies } from 'next/headers'
import { verifySessionToken, COOKIE_NAME } from './auth'

/**
 * Vérifie que la requête provient d'un admin authentifié (cookie JWT signé).
 * @returns {Promise<boolean>}
 */
export async function isAdminRequest() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  const payload = await verifySessionToken(token)
  return Boolean(payload && payload.role === 'admin')
}

/**
 * Renvoie une Response 401 si non-admin, sinon null.
 * Usage : const denied = await requireAdmin(); if (denied) return denied
 */
export async function requireAdmin() {
  const ok = await isAdminRequest()
  if (!ok) {
    return Response.json({ error: 'Non autorisé' }, { status: 401 })
  }
  return null
}
