import { getAvisPublies } from '@/lib/avis'
import SectionAvisClient from './SectionAvisClient'

const NB_AFFICHES = 4

// Fallback si la table avis n'existe pas encore
const AVIS_FALLBACK = [
  { id: 'f1', note: 5, texte: 'Service impeccable, pièce authentique et livrée en 24h. Je recommande sans hésiter.', auteur: 'Alexandre M.', achat: 'Louis Vuitton Keepall' },
  { id: 'f2', note: 5, texte: 'Une équipe à l\'écoute qui a réussi à trouver le modèle exact que je cherchais depuis des mois. Merci !', auteur: 'Sophie L.', achat: 'Chanel Classic Flap' },
  { id: 'f3', note: 5, texte: 'Excellente authentification, packaging soigné, et un suivi parfait du début à la fin.', auteur: 'Karim B.', achat: 'Air Jordan 1 Dior' },
  { id: 'f4', note: 5, texte: 'C&H Prestige est devenu mon référent pour toutes mes pièces de luxe. Sérieux et réactif.', auteur: 'Camille R.', achat: 'Hermès Birkin 30' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default async function SectionAvis() {
  let pool = []
  try {
    pool = await getAvisPublies()
  } catch {
    // Table non créée ou autre erreur
  }
  if (pool.length === 0) pool = AVIS_FALLBACK

  // Sélection aléatoire à chaque requête
  const aleatoires = shuffle(pool).slice(0, NB_AFFICHES)

  return <SectionAvisClient avis={aleatoires} total={pool.length} />
}
