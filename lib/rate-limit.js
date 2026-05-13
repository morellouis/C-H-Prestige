/**
 * Rate limiter in-memory (suffit pour un projet petit-moyen sur une seule instance).
 * Pour un setup multi-instances, passer à Upstash Redis ou Supabase + RLS.
 */
const buckets = new Map()

function cleanup(now) {
  for (const [key, b] of buckets) {
    if (now > b.resetAt) buckets.delete(key)
  }
}

/**
 * @returns {{ ok: true } | { ok: false, retryAfter: number }}
 */
export function checkRateLimit(key, { max = 5, windowMs = 60_000 } = {}) {
  const now = Date.now()
  if (buckets.size > 1000) cleanup(now)

  const bucket = buckets.get(key)
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }
  if (bucket.count >= max) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  bucket.count++
  return { ok: true }
}
