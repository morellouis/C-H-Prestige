import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/vitrine/Navbar'
import GalerieProduit from '@/components/vitrine/GalerieProduit'
import Footer from '@/components/vitrine/Footer'
import { getProduit } from '@/lib/produits'

export default async function ProduitPage({ params }) {
  const { id } = await params
  let produit
  try {
    produit = await getProduit(id)
  } catch {
    notFound()
  }

  const images = produit.images?.length
    ? produit.images
    : produit.image_url
    ? [produit.image_url]
    : []

  return (
    <main className="bg-[var(--background)] min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Fil d'Ariane */}
          <nav className="flex items-center gap-2 text-sm text-[var(--gris-moyen)] mb-12">
            <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/produits" className="hover:text-black transition-colors">Collection</Link>
            <span>/</span>
            <span className="text-black">{produit.nom}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <GalerieProduit images={images} nom={produit.nom} />

            <div className="lg:sticky lg:top-32 flex flex-col gap-6">
              {produit.categorie && (
                <p className="text-gold-gradient text-xs uppercase tracking-[0.4em]">
                  {produit.categorie}
                </p>
              )}

              <h1 className="font-display text-5xl md:text-6xl leading-[0.95]">
                {produit.nom}
              </h1>

              <p className="text-3xl font-light">
                {Number(produit.prix).toFixed(2)} €
              </p>

              {produit.description && (
                <div className="pt-6 border-t border-black/10">
                  <p className="text-[var(--gris-moyen)] leading-relaxed text-base">
                    {produit.description}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-6">
                <Link
                  href="/contact"
                  className="btn-prestige btn-prestige-gold justify-center"
                >
                  Réserver cette pièce
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/produits"
                  className="btn-prestige btn-prestige-light justify-center"
                >
                  Retour à la collection
                </Link>
              </div>

              {/* Garanties reseller */}
              <div className="grid grid-cols-2 gap-4 pt-8 mt-4 border-t border-black/10">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[var(--gris-moyen)] mb-1">
                    Authenticité
                  </p>
                  <p className="text-sm">Vérifiée avant envoi</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[var(--gris-moyen)] mb-1">
                    Livraison
                  </p>
                  <p className="text-sm">Sécurisée et assurée</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
