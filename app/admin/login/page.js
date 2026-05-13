'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/admin/produits'

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push(next)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Mot de passe incorrect')
      }
    } catch {
      setError('Erreur réseau. Réessayez.')
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--gris-clair)]">
      <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-10 w-full max-w-md mx-6">
        <div className="mb-8 text-center">
          <p className="text-gold-gradient text-xs uppercase tracking-[0.4em] mb-3">
            Accès restreint
          </p>
          <h1 className="font-display text-3xl">Administration</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoFocus
            className="border border-black/10 rounded-xl px-5 py-3 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
          />
          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-prestige btn-prestige-dark justify-center disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
