import Link from 'next/link'
import { getProduits } from '@/lib/produits'
import AdminNavbar from '@/components/admin/AdminNavbar'
import BoutonSupprimerProduit from '@/components/admin/BoutonSupprimerProduit'

export default async function AdminProduitsPage() {
  let produits = []
  try {
    produits = await getProduits()
  } catch {
    // Supabase pas encore configuré
  }

  return (
    <div>
      <AdminNavbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Produits</h1>
          <Link
            href="/admin/produits/nouveau"
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            + Ajouter un produit
          </Link>
        </div>

        {produits.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            Aucun produit. Commencez par en ajouter un.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Nom</th>
                  <th className="px-6 py-3 text-left">Catégorie</th>
                  <th className="px-6 py-3 text-left">Prix</th>
                  <th className="px-6 py-3 text-left">Vedette</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {produits.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{p.nom}</td>
                    <td className="px-6 py-4 text-gray-500">{p.categorie || '—'}</td>
                    <td className="px-6 py-4 font-semibold">{Number(p.prix).toFixed(2)} €</td>
                    <td className="px-6 py-4">{p.en_vedette ? '⭐' : '—'}</td>
                    <td className="px-6 py-4 text-right flex gap-3 justify-end">
                      <Link
                        href={`/admin/produits/${p.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Modifier
                      </Link>
                      <BoutonSupprimerProduit id={p.id} nom={p.nom} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
