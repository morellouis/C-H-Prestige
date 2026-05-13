'use client'
import { useRouter } from 'next/navigation'
import { deleteProduit } from '@/lib/produits'

export default function BoutonSupprimerProduit({ id, nom }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Supprimer « ${nom} » ? Cette action est irréversible.`)) return
    await deleteProduit(id)
    router.refresh()
  }

  return (
    <button onClick={handleDelete} className="text-red-500 hover:underline">
      Supprimer
    </button>
  )
}
