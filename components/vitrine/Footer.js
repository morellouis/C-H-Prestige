'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="bg-[var(--noir)] text-white pt-24 pb-10 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-white/10 pb-20 mb-16 text-center"
        >
          <h2 className="font-display text-5xl md:text-7xl text-balance mb-8">
            Une pièce vous <em className="text-gold-gradient not-italic font-light">intéresse ?</em>
          </h2>
          <Link href="/contact" className="btn-prestige btn-prestige-gold">
            Nous contacter
            <span aria-hidden>→</span>
          </Link>
        </motion.div>

        {/* Grille infos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div>
            <Link href="/" aria-label="C&H Prestige — Accueil" className="inline-block mb-4 transition-opacity hover:opacity-80">
              <Image
                src="/logo-blanc-transparent.png"
                alt="C&H Prestige"
                width={80}
                height={80}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              Pièces rares et authentifiées. Sourcing international.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">Boutique</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/produits" className="text-white/70 hover:text-white transition-colors">Collection</Link></li>
              <li><Link href="/produits" className="text-white/70 hover:text-white transition-colors">Nouveautés</Link></li>
              <li><Link href="/produits" className="text-white/70 hover:text-white transition-colors">Coups de cœur</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors">Authentification</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors">Recherche sur demande</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="mailto:chprestige@chprestige.com" className="hover:text-white transition-colors">chprestige@chprestige.com</a></li>
              <li>Service client : 10h — 22h, 7j/7</li>
              <li className="flex gap-4 pt-2">
                <a href="https://instagram.com/CHPrestigeLuxury" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                <a href="https://facebook.com/CHPrestigeLuxury" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} C&H Prestige — Tous droits réservés</p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
