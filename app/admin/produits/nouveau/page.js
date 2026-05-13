import AdminNavbar from '@/components/admin/AdminNavbar'
import FormulaireProduit from '@/components/admin/FormulaireProduit'

export default function NouveauProduitPage() {
  return (
    <div>
      <AdminNavbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">Ajouter un produit</h1>
        <FormulaireProduit />
      </main>
    </div>
  )
}
