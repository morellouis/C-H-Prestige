import AdminNavbar from '@/components/admin/AdminNavbar'
import FormulaireAvis from '@/components/admin/FormulaireAvis'

export default function NouveauAvisPage() {
  return (
    <div>
      <AdminNavbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">Ajouter un avis client</h1>
        <FormulaireAvis />
      </main>
    </div>
  )
}
