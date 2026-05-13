'use client'
import { motion } from 'framer-motion'
import Etoiles from './Etoiles'

export default function SectionAvisClient({ avis, total }) {
  if (!avis?.length) return null

  // Moyenne des notes
  const moyenne = avis.reduce((acc, a) => acc + a.note, 0) / avis.length
  const moyenneArrondie = (Math.round(moyenne * 10) / 10).toFixed(1).replace('.', ',')
  const totalAffiche = total || avis.length

  return (
    <section className="bg-[var(--background)] py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 max-w-3xl"
        >
          <p className="text-gold-gradient text-sm uppercase tracking-[0.4em] mb-6">
            Ils nous ont fait confiance
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-balance leading-tight">
            Plus de 500 clients <em className="text-gold-gradient not-italic font-light">satisfaits.</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {avis.map((a, i) => (
            <motion.div
              key={a.id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-black/5 rounded-3xl p-6 flex flex-col gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.03)]"
            >
              <Etoiles note={a.note} />
              <p className="text-[var(--foreground)] leading-relaxed flex-1">« {a.texte} »</p>
              <div className="border-t border-black/5 pt-4">
                <p className="font-medium text-sm">{a.auteur}</p>
                {a.achat && <p className="text-xs text-[var(--gris-moyen)] mt-1">Achat : {a.achat}</p>}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-4 text-sm text-[var(--gris-moyen)]">
          <Etoiles note={Math.round(moyenne * 2) / 2} />
          <span>{moyenneArrondie} / 5 sur la base de {totalAffiche}+ avis vérifiés</span>
        </div>
      </div>
    </section>
  )
}
