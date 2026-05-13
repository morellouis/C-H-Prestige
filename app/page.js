import Navbar from '@/components/vitrine/Navbar'
import Hero from '@/components/vitrine/Hero'
import BandeauCommercial from '@/components/vitrine/BandeauCommercial'
import SectionVedettes from '@/components/vitrine/SectionVedettes'
import SectionSavoirFaire from '@/components/vitrine/SectionSavoirFaire'
import SectionAvis from '@/components/vitrine/SectionAvis'
import Footer from '@/components/vitrine/Footer'
import { getProduits } from '@/lib/produits'

// Force le re-rendering à chaque requête → nouvelle sélection d'avis aléatoire
export const dynamic = 'force-dynamic'

export default async function Home() {
  let produitsVedette = []
  try {
    const tous = await getProduits()
    // On affiche TOUS les produits marqués "en vedette" (autant de lignes qu'il en faut)
    produitsVedette = tous.filter(p => p.en_vedette)
    // S'il n'y en a aucun, on affiche les 4 plus récents pour ne pas avoir une section vide
    if (produitsVedette.length === 0) {
      produitsVedette = tous.slice(0, 4)
    }
  } catch {
    // Supabase pas encore configuré
  }

  return (
    <main className="bg-[var(--background)] relative">
      <Navbar transparent />
      <Hero />
      <BandeauCommercial />
      <SectionVedettes produits={produitsVedette} />
      <SectionSavoirFaire />
      <SectionAvis />
      <Footer />
    </main>
  )
}
