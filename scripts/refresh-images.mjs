#!/usr/bin/env node
/**
 * Remplace les images des produits par des placeholders modernes
 * générés avec placehold.co (gratuit, sans clé API).
 *
 * Chaque produit reçoit 3 placeholders stylisés (variations de couleur
 * et de mise en page) qui affichent son nom et sa catégorie.
 *
 * Usage : npm run refresh:images
 *
 * Requiert dans .env.local :
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE
 */
import { createClient } from '@supabase/supabase-js'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '..', '.env.local') })
dotenv.config({ path: join(__dirname, '..', '.env') })

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE } = process.env

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('Manque NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE')
  process.exit(1)
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE)

/**
 * Palette par catégorie : 3 variations pour donner du rythme à la galerie.
 * Couleurs au format hex sans le #.
 * Format : [{ bg, fg, label? }]
 */
const PALETTES = {
  sneakers: [
    { bg: '0a0a0a', fg: 'ffffff' },
    { bg: '5b21b6', fg: 'ffffff' },
    { bg: 'f3f1ec', fg: '0a0a0a' },
  ],
  sacs: [
    { bg: '1c1410', fg: 'f3f1ec' },
    { bg: 'f3f1ec', fg: '0a0a0a' },
    { bg: '7c3aed', fg: 'ffffff' },
  ],
  montres: [
    { bg: '0a0a0a', fg: 'a78bfa' },
    { bg: '1a1a2e', fg: 'ffffff' },
    { bg: 'f3f1ec', fg: '0a0a0a' },
  ],
  vêtements: [
    { bg: 'f3f1ec', fg: '0a0a0a' },
    { bg: '0a0a0a', fg: 'ffffff' },
    { bg: '5b21b6', fg: 'ffffff' },
  ],
  accessoires: [
    { bg: '5b21b6', fg: 'ffffff' },
    { bg: '0a0a0a', fg: 'a78bfa' },
    { bg: 'f3f1ec', fg: '0a0a0a' },
  ],
}

function paletteFor(categorie) {
  const key = (categorie || '').toLowerCase()
  if (key.includes('sneaker')) return PALETTES.sneakers
  if (key.includes('sac')) return PALETTES.sacs
  if (key.includes('montre')) return PALETTES.montres
  if (key.includes('vêtement') || key.includes('vetement')) return PALETTES.vêtements
  if (key.includes('accessoir')) return PALETTES.accessoires
  return PALETTES.sneakers
}

/**
 * Construit l'URL placehold.co pour un produit.
 * On varie aussi le texte affiché entre les vues : nom complet, marque, catégorie.
 */
function buildPlaceholderUrl(produit, variantIndex, palette) {
  const { bg, fg } = palette
  // Trois variations de texte
  const texts = [
    produit.nom,
    produit.categorie?.toUpperCase() || 'PRESTIGE',
    `${produit.prix}€`,
  ]
  const text = texts[variantIndex] || produit.nom
  const fonts = ['raleway', 'montserrat', 'playfair']
  const font = fonts[variantIndex] || 'raleway'

  // placehold.co accepte du texte URL-encodé (\n pour les sauts de ligne)
  const encoded = encodeURIComponent(text)
  return `https://placehold.co/800x1000/${bg}/${fg}/jpeg?text=${encoded}&font=${font}`
}

async function telechargerEtUploader(imageUrl, nomFichier) {
  const res = await fetch(imageUrl)
  if (!res.ok) throw new Error(`Téléchargement échoué : ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const { error } = await supabase.storage
    .from('produits-images')
    .upload(nomFichier, buffer, { contentType: 'image/jpeg', upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('produits-images').getPublicUrl(nomFichier)
  return data.publicUrl
}

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  console.log('→ Récupération des produits...')
  const { data: produits, error } = await supabase.from('produits').select('id, nom, categorie, prix')
  if (error) throw error
  console.log(`  ${produits.length} produits à traiter\n`)

  for (const [i, produit] of produits.entries()) {
    const palettes = paletteFor(produit.categorie)
    const slug = slugify(produit.nom)
    process.stdout.write(`[${i + 1}/${produits.length}] ${produit.nom}\n   `)

    try {
      const urls = []
      for (let j = 0; j < 3; j++) {
        const url = buildPlaceholderUrl(produit, j, palettes[j])
        const nomFichier = `placeholder-${slug}-${j}.jpg`
        const publicUrl = await telechargerEtUploader(url, nomFichier)
        urls.push(publicUrl)
        process.stdout.write(`✓ ${j + 1} `)
      }

      const { error: errUpd } = await supabase
        .from('produits')
        .update({ images: urls, image_url: urls[0] })
        .eq('id', produit.id)
      if (errUpd) console.log(`\n   ✗ MAJ produit: ${errUpd.message}\n`)
      else console.log(`\n   ${urls.length} images associées\n`)
    } catch (err) {
      console.log(`✗ ${err.message}\n`)
    }
  }

  console.log('\nTerminé !')
  console.log('Astuce : pour mettre une vraie photo, va dans /admin/produits/[id]')
}

main().catch(err => {
  console.error('Erreur fatale :', err)
  process.exit(1)
})
