'use client'
import { motion } from 'framer-motion'

/**
 * Wrapper qui révèle ses enfants au scroll.
 * Pattern : fade + translate Y, déclenché à 20% du viewport.
 */
export default function SectionReveal({ children, delay = 0, className = '', as: As = 'div' }) {
  const MotionComponent = motion[As] || motion.div
  return (
    <MotionComponent
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </MotionComponent>
  )
}
