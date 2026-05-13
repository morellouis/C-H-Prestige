'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminNavbar() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <nav className="bg-black text-white px-6 py-4 flex items-center justify-between">
      <Link href="/admin/produits" className="font-bold tracking-widest" style={{ color: 'var(--gold)' }}>
        C&H PRESTIGE — Admin
      </Link>
      <div className="flex items-center gap-6 text-sm">
        <Link href="/admin/produits" className="hover:text-[var(--accent-light)] transition-colors">Produits</Link>
        <Link href="/admin/avis" className="hover:text-[var(--accent-light)] transition-colors">Avis</Link>
        <Link href="/admin/messages" className="hover:text-[var(--accent-light)] transition-colors">Messages</Link>
        <Link href="/" className="hover:text-[var(--accent-light)] transition-colors" target="_blank">Voir le site</Link>
        <button onClick={handleLogout} className="hover:text-red-400 transition-colors">
          Déconnexion
        </button>
      </div>
    </nav>
  )
}
