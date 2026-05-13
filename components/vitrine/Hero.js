'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRef } from 'react'

// Three.js uniquement côté client
const HeroShader = dynamic(() => import('./HeroShader'), { ssr: false })

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Parallax + fade au scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-[var(--background)]">
      {/* Canvas shader */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <HeroShader />
      </motion.div>

      {/* Overlay très subtil pour ajouter de la profondeur sur les bords */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30 pointer-events-none" />

      {/* Contenu */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[var(--noir)]/70 text-xs uppercase tracking-[0.5em] mb-6"
        >
          Pièces rares · Authentifiées
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-7xl md:text-[10rem] text-balance text-[var(--noir)] drop-shadow-[0_2px_30px_rgba(255,255,255,0.4)]"
        >
          Le hype, <span className="text-gold-gradient italic font-light">sourcé.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-8 text-lg md:text-xl text-[var(--noir)]/75 max-w-2xl text-balance leading-relaxed"
        >
          Louis Vuitton, Gucci, Céline, Chanel, Hermès, Nike. Nous sourçons les pièces les plus convoitées et vous les livrons authentifiées sous 24h.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <Link href="/produits" className="btn-prestige btn-prestige-dark">
            Découvrir la collection
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="#savoir-faire"
            className="btn-prestige bg-white/40 text-[var(--noir)] border border-white/60 backdrop-blur-md hover:bg-white/70 transition-colors"
          >
            Notre approche
          </Link>
        </motion.div>

        {/* Indicateur de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-[var(--noir)]/60 text-xs uppercase tracking-widest flex flex-col items-center gap-2"
          >
            <span>Défiler</span>
            <span className="block w-px h-8 bg-[var(--noir)]/40" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
