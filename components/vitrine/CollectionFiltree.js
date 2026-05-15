'use client'
import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CarteProduct from './CarteProduct'

const TRIS = [
  { id: 'recent', label: 'Plus récent' },
  { id: 'prix-asc', label: 'Prix croissant' },
  { id: 'prix-desc', label: 'Prix décroissant' },
  { id: 'nom-asc', label: 'A → Z' },
]

export default function CollectionFiltree({ produits }) {
  // Catégories uniques extraites des produits
  const categories = useMemo(() => {
    const set = new Set(produits.map(p => p.categorie).filter(Boolean))
    return ['Tout', ...Array.from(set).sort()]
  }, [produits])

  const [categorieActive, setCategorieActive] = useState('Tout')
  const [tri, setTri] = useState('recent')
  const [recherche, setRecherche] = useState('')

  const produitsAffiches = useMemo(() => {
    let list = [...produits]

    // Filtre par catégorie
    if (categorieActive !== 'Tout') {
      list = list.filter(p => p.categorie === categorieActive)
    }

    // Filtre par recherche texte (nom ou description)
    if (recherche.trim()) {
      const q = recherche.toLowerCase().trim()
      list = list.filter(p =>
        p.nom.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      )
    }

    // Tri
    if (tri === 'prix-asc') list.sort((a, b) => a.prix - b.prix)
    else if (tri === 'prix-desc') list.sort((a, b) => b.prix - a.prix)
    else if (tri === 'nom-asc') list.sort((a, b) => a.nom.localeCompare(b.nom))
    // 'recent' = ordre original (déjà trié par created_at desc côté DB)

    return list
  }, [produits, categorieActive, tri, recherche])

  function reset() {
    setCategorieActive('Tout')
    setTri('recent')
    setRecherche('')
  }

  const filtresActifs = categorieActive !== 'Tout' || tri !== 'recent' || recherche.trim()

  return (
    <>
      {/* Barre de filtres sticky */}
      <div className="sticky top-24 z-30 bg-[var(--background)]/85 backdrop-blur-xl border-y border-black/5 -mx-6 lg:-mx-12 px-6 lg:px-12 py-4 mb-12">
        <div className="flex flex-col gap-4">
          {/* Ligne 1 : recherche + tri */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="search"
                placeholder="Rechercher une pièce..."
                value={recherche}
                onChange={e => setRecherche(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-full px-5 py-2.5 pr-10 text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--gris-moyen)] pointer-events-none">⌕</span>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs uppercase tracking-widest text-[var(--gris-moyen)] whitespace-nowrap">
                Trier par
              </label>
              <select
                value={tri}
                onChange={e => setTri(e.target.value)}
                className="bg-white border border-black/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)] cursor-pointer"
              >
                {TRIS.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ligne 2 : pilules de catégories */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-2 px-2">
            {categories.map(cat => {
              const actif = cat === categorieActive
              const nb = cat === 'Tout' ? produits.length : produits.filter(p => p.categorie === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setCategorieActive(cat)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    actif
                      ? 'bg-[var(--noir)] text-white'
                      : 'bg-white border border-black/10 text-[var(--foreground)] hover:border-[var(--accent)]'
                  }`}
                >
                  {cat} <span className={actif ? 'text-white/60' : 'text-[var(--gris-moyen)]'}>({nb})</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Compteur + reset */}
      <div className="flex items-center justify-between mb-8 text-sm text-[var(--gris-moyen)]">
        <p>
          <span className="text-[var(--foreground)] font-medium">{produitsAffiches.length}</span>{' '}
          pièce{produitsAffiches.length > 1 ? 's' : ''}
          {filtresActifs && ` sur ${produits.length}`}
        </p>
        {filtresActifs && (
          <button onClick={reset} className="link-underline text-sm">
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Grille de produits */}
      {produitsAffiches.length === 0 ? (
        <div className="text-center py-40 text-[var(--gris-moyen)]">
          <p className="text-lg mb-3">Aucune pièce ne correspond à votre recherche.</p>
          <button onClick={reset} className="link-underline text-sm">
            Voir toutes les pièces
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
          <AnimatePresence mode="popLayout">
            {produitsAffiches.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-28px)]"
              >
                <CarteProduct produit={p} priority={i < 3} index={i % 3} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}
