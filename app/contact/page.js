import Navbar from '@/components/vitrine/Navbar'
import Footer from '@/components/vitrine/Footer'
import FormulaireContact from '@/components/vitrine/FormulaireContact'

export const metadata = {
  title: 'Contact — C&H Prestige',
}

export default function ContactPage() {
  return (
    <main className="bg-[var(--background)] min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-gold-gradient text-sm uppercase tracking-[0.4em] mb-6">
            Restons en contact
          </p>
          <h1 className="font-display text-6xl md:text-8xl text-balance leading-none">
            Une pièce à <em className="text-gold-gradient not-italic font-light">trouver ?</em>
          </h1>
          <p className="mt-8 text-lg text-[var(--gris-moyen)] max-w-2xl">
            Vous cherchez une pièce particulière, vous voulez vérifier l&apos;authenticité d&apos;un article ou demander un conseil ? Écrivez-nous.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-12 pb-32">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coordonnées */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--gris-moyen)] mb-3">
                Email
              </p>
              <a href="mailto:chprestige@chprestige.com" className="text-lg link-underline break-all">
                chprestige@chprestige.com
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--gris-moyen)] mb-3">
                Service client
              </p>
              <p className="text-lg leading-relaxed">
                Lundi — Dimanche<br />
                10h — 22h
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--gris-moyen)] mb-3">
                Suivez-nous
              </p>
              <div className="flex flex-col gap-1">
                <a href="https://instagram.com/CHPrestigeLuxury" target="_blank" rel="noopener noreferrer" className="text-lg link-underline">
                  Instagram
                </a>
                <a href="https://facebook.com/CHPrestigeLuxury" target="_blank" rel="noopener noreferrer" className="text-lg link-underline">
                  Facebook
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--gris-moyen)] mb-3">
                Livraison
              </p>
              <p className="text-sm text-[var(--gris-moyen)] leading-relaxed">
                Gratuite dès 200€.<br />
                Expédition le jour même avant 17h.
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <FormulaireContact />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
