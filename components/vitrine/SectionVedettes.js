'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import CarteProduct from './CarteProduct'

export default function SectionVedettes({ produits }) {
  if (!produits.length) return null

  return (
    <section className="bg-[var(--background)] py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-gold-gradient text-sm uppercase tracking-[0.4em] mb-4">
              Sélection du moment
            </p>
            <h2 className="font-display text-5xl md:text-7xl text-balance leading-tight">
              Nos pièces <em className="text-gold-gradient not-italic font-light">d&apos;exception.</em>
            </h2>
          </div>
          <Link href="/produits" className="link-underline text-sm font-medium self-start md:self-end">
            Voir toute la collection →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {produits.map((p, i) => (
            <CarteProduct key={p.id} produit={p} priority={i < 4} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
