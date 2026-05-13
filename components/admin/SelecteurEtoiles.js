'use client'
import { useState } from 'react'

/**
 * Sélecteur de note 0.5 à 5 avec demi-étoiles.
 * Cliquer sur la moitié gauche d'une étoile = X.5
 * Cliquer sur la moitié droite d'une étoile = X.0
 */
export default function SelecteurEtoiles({ note, onChange }) {
  const [hover, setHover] = useState(null)
  const valeurAffichee = hover ?? note

  function remplissagePour(i) {
    if (i <= Math.floor(valeurAffichee)) return 1
    if (i - 0.5 <= valeurAffichee) return 0.5
    return 0
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex gap-1 text-4xl"
        onMouseLeave={() => setHover(null)}
        style={{ color: 'var(--accent)' }}
      >
        {[1, 2, 3, 4, 5].map(i => {
          const remplissage = remplissagePour(i)
          return (
            <span key={i} className="relative inline-block leading-none">
              {/* Étoile vide en fond */}
              <span className="opacity-20">★</span>
              {/* Étoile pleine ou demi-pleine en avant */}
              {remplissage > 0 && (
                <span
                  className="absolute left-0 top-0 overflow-hidden pointer-events-none"
                  style={{ width: `${remplissage * 100}%` }}
                  aria-hidden="true"
                >
                  ★
                </span>
              )}
              {/* Zones de clic invisibles */}
              <button
                type="button"
                className="absolute left-0 top-0 w-1/2 h-full cursor-pointer"
                onMouseEnter={() => setHover(i - 0.5)}
                onClick={() => onChange(i - 0.5)}
                aria-label={`${i - 0.5} étoiles`}
              />
              <button
                type="button"
                className="absolute right-0 top-0 w-1/2 h-full cursor-pointer"
                onMouseEnter={() => setHover(i)}
                onClick={() => onChange(i)}
                aria-label={`${i} étoiles`}
              />
            </span>
          )
        })}
      </div>
      <span className="text-sm text-gray-500 tabular-nums">
        {valeurAffichee.toString().replace('.', ',')} / 5
      </span>
    </div>
  )
}
