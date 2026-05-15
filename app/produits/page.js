import Navbar from '@/components/vitrine/Navbar'
import CollectionFiltree from '@/components/vitrine/CollectionFiltree'
import Footer from '@/components/vitrine/Footer'
import { getProduits } from '@/lib/produits'

export default async function ProduitsPage() {
  let produits = []
  try {
    produits = await getProduits()
  } catch {
    // Supabase pas encore configuré
  }

  return (
    <main className="bg-[var(--background)] min-h-screen">
      <Navbar />

      {/* En-tête */}
      <section className="pt-32 pb-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold-gradient text-sm uppercase tracking-[0.4em] mb-6">
            En stock
          </p>
          <h1 className="font-display text-6xl md:text-8xl text-balance leading-none">
            Pièces <em className="text-gold-gradient not-italic font-light">disponibles.</em>
          </h1>
          <p className="mt-8 text-lg text-[var(--gris-moyen)] max-w-2xl">
            {produits.length} pièce{produits.length > 1 ? 's' : ''} en stock, chacune authentifiée et prête à être livrée. Filtrez par catégorie ou triez par prix pour trouver la vôtre.
          </p>
        </div>
      </section>

      {/* Grille avec filtres */}
      <section className="px-6 lg:px-12 pb-32">
        <div className="max-w-7xl mx-auto">
          {produits.length === 0 ? (
            <div className="text-center py-40 text-[var(--gris-moyen)]">
              <p className="text-lg">Aucune pièce dans la collection pour le moment.</p>
            </div>
          ) : (
            <CollectionFiltree produits={produits} />
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
