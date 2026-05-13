'use client'
import { useRouter } from 'next/navigation'
import { deleteAvis } from '@/lib/avis'

export default function BoutonSupprimerAvis({ id, auteur }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Supprimer l'avis de « ${auteur} » ? Cette action est irréversible.`)) return
    await deleteAvis(id)
    router.refresh()
  }

  return (
    <button onClick={handleDelete} className="text-red-500 hover:underline">
      Supprimer
    </button>
  )
}
