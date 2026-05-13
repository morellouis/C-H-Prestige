'use client'
import { motion } from 'framer-motion'

const messages = [
  { icon: '✓', texte: 'Authentification garantie' },
  { icon: '◇', texte: 'Livraison gratuite dès 200€' },
  { icon: '⚡', texte: 'Expédition le jour même avant 17h' },
  { icon: '☎', texte: 'Service client 10h — 22h, 7j/7' },
]

export default function BandeauCommercial() {
  return (
    <div className="bg-[var(--noir)] text-white text-xs overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-2.5">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[...messages, ...messages, ...messages].map((m, i) => (
            <span key={i} className="flex items-center gap-2 text-white/70">
              <span className="text-[var(--accent-light)]">{m.icon}</span>
              <span className="tracking-wider uppercase">{m.texte}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
