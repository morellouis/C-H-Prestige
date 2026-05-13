/**
 * Affiche une note (0.5 à 5) sous forme d'étoiles avec support demi-étoile.
 * Couleur via la prop `color` (par défaut : var(--accent)).
 */
export default function Etoiles({ note, color = 'var(--accent)', size = 'text-base' }) {
  return (
    <div className={`flex gap-0.5 ${size}`} style={{ color }}>
      {[1, 2, 3, 4, 5].map(i => {
        let remplissage = 0
        if (i <= Math.floor(note)) remplissage = 1
        else if (i - 0.5 <= note) remplissage = 0.5

        return (
          <span key={i} className="relative inline-block leading-none">
            <span className="opacity-20">★</span>
            {remplissage > 0 && (
              <span
                className="absolute left-0 top-0 overflow-hidden"
                style={{ width: `${remplissage * 100}%` }}
                aria-hidden="true"
              >
                ★
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}
