import Navbar from '@/components/vitrine/Navbar'
import Footer from '@/components/vitrine/Footer'

export const metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité et protection des données — C&H Prestige.',
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

export default function ConfidentialitePage() {
  return (
    <main className="bg-[var(--background)] min-h-screen">
      <Navbar />

      <section className="pt-40 pb-24 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-gold-gradient text-sm uppercase tracking-[0.4em] mb-6">
            Vos données
          </p>
          <h1 className="font-display text-5xl md:text-7xl mb-16">
            Politique de confidentialité
          </h1>

          <Bloc titre="Responsable du traitement">
            <p>
              Les données collectées via ce site sont traitées par C&amp;H Prestige
              [À COMPLÉTER — raison sociale]. Pour toute question relative à vos
              données :{' '}
              <a href="mailto:chprestige@chprestige.com" className="link-underline text-black">
                chprestige@chprestige.com
              </a>
            </p>
          </Bloc>

          <Bloc titre="Données collectées">
            <p>Nous collectons uniquement les données que vous nous transmettez :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Formulaire de contact</strong> : nom, adresse email, sujet et
                contenu du message.
              </li>
              <li>
                <strong>Cookie de session administrateur</strong> : uniquement pour
                l&apos;espace d&apos;administration privé (pas pour les visiteurs).
              </li>
            </ul>
            <p>
              Aucun cookie publicitaire, aucun traceur tiers, aucune revente de
              données. Aucun profilage.
            </p>
          </Bloc>

          <Bloc titre="Finalité et base légale">
            <p>
              Les informations du formulaire de contact servent exclusivement à
              répondre à votre demande (base légale : votre consentement et notre
              intérêt légitime à vous répondre).
            </p>
          </Bloc>

          <Bloc titre="Durée de conservation">
            <p>
              Les messages de contact sont conservés au maximum 24 mois après le
              dernier échange, puis supprimés. Le cookie de session administrateur
              expire automatiquement après 7 jours.
            </p>
          </Bloc>

          <Bloc titre="Hébergement des données">
            <p>
              Les données sont stockées via Supabase (infrastructure cloud) et le
              site hébergé par Vercel. Des transferts hors UE peuvent intervenir,
              encadrés par les clauses contractuelles types de la Commission
              européenne.
            </p>
          </Bloc>

          <Bloc titre="Vos droits (RGPD)">
            <p>
              Conformément au Règlement Général sur la Protection des Données, vous
              disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement,
              de limitation et d&apos;opposition sur vos données. Pour exercer ces
              droits, contactez-nous à{' '}
              <a href="mailto:chprestige@chprestige.com" className="link-underline text-black">
                chprestige@chprestige.com
              </a>
              . Vous pouvez également introduire une réclamation auprès de la CNIL
              (www.cnil.fr).
            </p>
          </Bloc>

          <Bloc titre="Cookies">
            <p>
              Ce site n&apos;utilise qu&apos;un seul cookie, strictement nécessaire au
              fonctionnement de l&apos;espace d&apos;administration privé. Il n&apos;est
              jamais déposé lors de la navigation publique. Aucun consentement
              cookie n&apos;est donc requis pour les visiteurs.
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
