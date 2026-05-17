import Link from 'next/link'
import AdminNavbar from '@/components/admin/AdminNavbar'
import BoutonSupprimerAvis from '@/components/admin/BoutonSupprimerAvis'
import Etoiles from '@/components/vitrine/Etoiles'
import { getAllAvis } from '@/lib/avis-admin'

export const dynamic = 'force-dynamic'

export default async function AdminAvisPage() {
  let avis = []
  try {
    avis = await getAllAvis()
  } catch {
    // table pas encore créée
  }

  return (
    <div>
      <AdminNavbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Avis clients</h1>
          <Link
            href="/admin/avis/nouveau"
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            + Ajouter un avis
          </Link>
        </div>

        {avis.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            Aucun avis. Commencez par en ajouter un.
            <div className="mt-4 text-xs">
              <span className="text-amber-600">⚠ Si la table n&apos;est pas créée, exécutez d&apos;abord</span>{' '}
              <code className="bg-amber-50 px-2 py-1 rounded">supabase-schema-avis.sql</code>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Auteur</th>
                  <th className="px-6 py-3 text-left">Extrait</th>
                  <th className="px-6 py-3 text-left">Note</th>
                  <th className="px-6 py-3 text-left">Publié</th>
                  <th className="px-6 py-3 text-left">Ordre</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {avis.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      {a.auteur}
                      {a.achat && <p className="text-xs text-gray-400 mt-1">Achat : {a.achat}</p>}
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{a.texte}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Etoiles note={Number(a.note)} color="#eab308" size="text-lg" />
                        <span className="text-xs text-gray-500 tabular-nums">
                          {Number(a.note).toString().replace('.', ',')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {a.publie ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Publié</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">Brouillon</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{a.ordre || 0}</td>
                    <td className="px-6 py-4 text-right flex gap-3 justify-end">
                      <Link href={`/admin/avis/${a.id}`} className="text-blue-600 hover:underline">
                        Modifier
                      </Link>
                      <BoutonSupprimerAvis id={a.id} auteur={a.auteur} />
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
