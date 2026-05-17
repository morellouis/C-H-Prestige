import Navbar from '@/components/vitrine/Navbar'
import Footer from '@/components/vitrine/Footer'

export const metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site C&H Prestige.',
  robots: { index: false, follow: true },
}

function Bloc({ titre, children }) {
  return (
    <div className="mb-12">
      <h2 className="font-display text-2xl md:text-3xl mb-4">{titre}</h2>
      <div className="text-[var(--gris-moyen)] leading-relaxed space-y-3">{children}</div>
    </div>
  )
}

// ⚠️ Les champs [À COMPLÉTER] doivent être remplis avec les vraies
// informations légales de l'entreprise avant la mise en ligne publique.
export default function MentionsLegalesPage() {
  return (
    <main className="bg-[var(--background)] min-h-screen">
      <Navbar />

      <section className="pt-40 pb-24 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-gold-gradient text-sm uppercase tracking-[0.4em] mb-6">
            Informations légales
          </p>
          <h1 className="font-display text-5xl md:text-7xl mb-16">Mentions légales</h1>

          <Bloc titre="Éditeur du site">
            <p>
              Le site <strong>C&amp;H Prestige</strong> est édité par :
            </p>
            <p>
              Raison sociale : [À COMPLÉTER — nom de l&apos;entreprise ou de l&apos;auto-entrepreneur]<br />
              Forme juridique : [À COMPLÉTER — ex : Auto-entreprise / SAS / SARL]<br />
              Adresse : [À COMPLÉTER — adresse du siège]<br />
              SIRET : [À COMPLÉTER]<br />
              Numéro de TVA intracommunautaire : [À COMPLÉTER si applicable]<br />
              Email : chprestige@chprestige.com<br />
              Directeur de la publication : [À COMPLÉTER — nom du responsable]
            </p>
          </Bloc>

          <Bloc titre="Hébergement">
            <p>
              Le site est hébergé par :<br />
              <strong>Vercel Inc.</strong><br />
              340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br />
              Site : vercel.com
            </p>
            <p>
              La base de données et le stockage des médias sont fournis par :<br />
              <strong>Supabase</strong> (Supabase Inc.) — supabase.com
            </p>
          </Bloc>

          <Bloc titre="Propriété intellectuelle">
            <p>
              L&apos;ensemble des éléments du site (structure, textes, identité visuelle,
              logo C&amp;H Prestige) est protégé par le droit de la propriété intellectuelle.
              Toute reproduction sans autorisation est interdite.
            </p>
            <p>
              Les marques et noms de produits cités (le cas échéant) restent la propriété
              de leurs détenteurs respectifs. C&amp;H Prestige opère une activité de
              revente de pièces authentifiées et n&apos;est affilié à aucune de ces marques.
            </p>
          </Bloc>

          <Bloc titre="Responsabilité">
            <p>
              C&amp;H Prestige s&apos;efforce d&apos;assurer l&apos;exactitude des informations
              diffusées mais ne saurait être tenu responsable des omissions, inexactitudes
              ou carences de mise à jour. Les prix et disponibilités sont indicatifs et
              peuvent évoluer.
            </p>
          </Bloc>

          <Bloc titre="Contact">
            <p>
              Pour toute question relative au site :{' '}
              <a href="mailto:chprestige@chprestige.com" className="link-underline text-black">
                chprestige@chprestige.com
              </a>
            </p>
          </Bloc>

          <p className="text-xs text-[var(--gris-moyen)] mt-16">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
