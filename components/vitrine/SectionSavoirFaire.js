'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const piliers = [
  {
    num: '01',
    titre: 'Authenticité vérifiée',
    texte: 'Chaque pièce est inspectée, comparée aux références officielles et authentifiée avant la mise en vente.',
  },
  {
    num: '02',
    titre: 'Sourcing international',
    texte: 'Nous chassons les pièces les plus rares partout dans le monde : drops limités, éditions épuisées, marché secondaire.',
  },
  {
    num: '03',
    titre: 'Conseil & livraison',
    texte: 'Accompagnement personnalisé pour trouver la pièce qui vous correspond. Expédition sécurisée et assurée.',
  },
]

export default function SectionSavoirFaire() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section id="savoir-faire" ref={ref} className="relative bg-[var(--noir)] text-white py-32 overflow-hidden">
      {/* Texte d'arrière-plan parallaxe */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] select-none"
      >
        <span className="font-display text-[20rem] whitespace-nowrap">PRESTIGE</span>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-20"
        >
          <p className="text-gold-gradient text-sm uppercase tracking-[0.4em] mb-6">Notre approche</p>
          <h2 className="font-display text-5xl md:text-7xl text-balance leading-tight">
            Les bonnes pièces, <em className="text-gold-gradient not-italic font-light">authentifiées.</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {piliers.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-white/10 pt-8"
            >
              <span className="text-gold-gradient text-sm font-mono tracking-widest">{p.num}</span>
              <h3 className="font-display text-3xl mt-4 mb-4">{p.titre}</h3>
              <p className="text-white/60 leading-relaxed">{p.texte}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
