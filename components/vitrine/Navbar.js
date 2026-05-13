'use client'
import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar({ transparent = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()
  const pathname = usePathname()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 40)
  })

  // Le shader est désormais clair, donc on garde le texte noir partout
  const isDark = false

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !transparent
            ? 'bg-white/80 backdrop-blur-xl border-b border-black/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link
            href="/"
            className={`text-base font-semibold tracking-[0.2em] transition-colors ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            C&H <span className="text-gold-gradient">PRESTIGE</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {[
              { href: '/', label: 'Accueil' },
              { href: '/produits', label: 'Collection' },
              { href: '/contact', label: 'Contact' },
            ].map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`link-underline text-sm font-medium transition-colors ${
                    isDark ? 'text-white/90 hover:text-white' : 'text-black/70 hover:text-black'
                  } ${active ? '!text-' + (isDark ? 'white' : 'black') : ''}`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden md:block">
            <Link
              href="/produits"
              className={`text-sm px-5 py-2 rounded-full transition-all ${
                isDark
                  ? 'bg-white text-black hover:bg-white/90'
                  : 'bg-black text-white hover:bg-black/80'
              }`}
            >
              Acheter
            </Link>
          </div>

          {/* Menu mobile */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden flex flex-col gap-1.5 ${isDark ? 'text-white' : 'text-black'}`}
            aria-label="Menu"
          >
            <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }} className={`block w-6 h-px ${isDark ? 'bg-white' : 'bg-black'}`} />
            <motion.span animate={{ opacity: open ? 0 : 1 }} className={`block w-6 h-px ${isDark ? 'bg-white' : 'bg-black'}`} />
            <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }} className={`block w-6 h-px ${isDark ? 'bg-white' : 'bg-black'}`} />
          </button>
        </div>
      </motion.nav>

      {/* Menu mobile overlay */}
      <motion.div
        initial={false}
        animate={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl md:hidden"
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {[
            { href: '/', label: 'Accueil' },
            { href: '/produits', label: 'Collection' },
            { href: '/contact', label: 'Contact' },
          ].map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: open ? 1 : 0, y: open ? 0 : 20 }}
              transition={{ delay: open ? i * 0.1 : 0 }}
            >
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-3xl font-display text-black"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  )
}
