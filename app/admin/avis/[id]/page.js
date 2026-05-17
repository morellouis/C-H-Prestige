import { notFound } from 'next/navigation'
import AdminNavbar from '@/components/admin/AdminNavbar'
import FormulaireAvis from '@/components/admin/FormulaireAvis'
import { getAvis } from '@/lib/avis-admin'

export default async function ModifierAvisPage({ params }) {
  const { id } = await params
  let avis
  try {
    avis = await getAvis(id)
  } catch {
    notFound()
  }

  return (
    <div>
      <AdminNavbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">Modifier l&apos;avis</h1>
        <FormulaireAvis avis={avis} />
      </main>
    </div>
  )
}
