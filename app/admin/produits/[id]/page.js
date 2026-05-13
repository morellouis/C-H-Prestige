import { notFound } from 'next/navigation'
import AdminNavbar from '@/components/admin/AdminNavbar'
import FormulaireProduit from '@/components/admin/FormulaireProduit'
import { getProduit } from '@/lib/produits'

export default async function ModifierProduitPage({ params }) {
  const { id } = await params
  let produit
  try {
    produit = await getProduit(id)
  } catch {
    notFound()
  }

  return (
    <div>
      <AdminNavbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">Modifier — {produit.nom}</h1>
        <FormulaireProduit produit={produit} />
      </main>
    </div>
  )
}
