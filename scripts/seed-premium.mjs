#!/usr/bin/env node
/**
 * Seed la base avec ~25 produits hype/premium et les images déjà présentes
 * dans le bucket `produits-images` de Supabase Storage.
 *
 * Usage : npm run seed:premium
 *
 * Options en variables d'env :
 *   PURGE=1  → supprime tous les produits existants avant d'insérer
 */
import { createClient } from '@supabase/supabase-js'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '..', '.env.local') })
dotenv.config({ path: join(__dirname, '..', '.env') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Manque NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE dans .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE)

const PRODUITS = [
  // Sneakers
  { nom: 'Air Jordan 1 Retro High x Dior', description: 'Collaboration mythique 2020. Cuir grainé blanc Dior Oblique, finitions main, édition ultra-limitée. Pointure 41 EU.', prix: 8500, categorie: 'Sneakers', en_vedette: true },
  { nom: 'Travis Scott x Air Jordan 1 Low Mocha', description: 'La silhouette qui a redéfini la sneaker culture. Swoosh inversé, cuir suède brun et beige.', prix: 2200, categorie: 'Sneakers', en_vedette: true },
  { nom: 'Off-White x Nike Air Force 1 Volt', description: 'Designed by Virgil Abloh. The Ten Collection. Cuir blanc déconstruit, lacets contrastés, signature « SHOELACES ».', prix: 1850, categorie: 'Sneakers', en_vedette: false },
  { nom: 'Louis Vuitton x Nike Air Force 1 Virgil Abloh', description: 'Hommage à Virgil Abloh, Monogram embossé, semelle gomme et boîte trunk LV. Pièce de collection.', prix: 4200, categorie: 'Sneakers', en_vedette: true },
  { nom: 'Adidas Samba Wales Bonner Cream', description: 'Réinterprétation premium du grand classique. Cuir grainé crème, perforations, signature Wales Bonner.', prix: 320, categorie: 'Sneakers', en_vedette: false },
  { nom: 'New Balance 990v6 Aimé Leon Dore', description: 'Collaboration NYC : mesh ENCAP, panneaux suède, palette gris pierre. Made in USA.', prix: 480, categorie: 'Sneakers', en_vedette: false },
  { nom: 'Yeezy Boost 350 V2 Zebra', description: 'Le drop iconique de Kanye West. Tige Primeknit zébrée, semelle Boost translucide.', prix: 380, categorie: 'Sneakers', en_vedette: false },

  // Sacs
  { nom: 'Louis Vuitton Keepall Bandoulière 55', description: 'Sac de voyage iconique en toile Monogram. Cuir vachette naturel, double poignée et bandoulière amovible.', prix: 2350, categorie: 'Sacs', en_vedette: true },
  { nom: 'Goyard Saint Louis PM Black', description: 'Cabas en toile Goyardine enduite, doublure coton, finitions cuir Chevroches. Made in France.', prix: 1700, categorie: 'Sacs', en_vedette: false },
  { nom: 'Hermès Birkin 30 Togo Etoupe', description: 'Sac à main 30 cm en veau Togo, ferrures palladium. Cousu main par un seul artisan.', prix: 14500, categorie: 'Sacs', en_vedette: true },
  { nom: 'Dior Saddle Bag Oblique', description: 'Le sac de selle revisité. Toile Dior Oblique, finitions ton sur ton, sangle ajustable.', prix: 3700, categorie: 'Sacs', en_vedette: false },
  { nom: 'Bottega Veneta Cassette Intrecciato', description: 'Maxi tressage signature, cuir nappa souple, bandoulière chaîne. Coloris Fondant.', prix: 2950, categorie: 'Sacs', en_vedette: false },
  { nom: 'Chanel Classic Flap Medium Caviar', description: 'L\'intemporel par excellence. Cuir caviar noir, chaîne entrelacée cuir & métal doré, fermoir CC.', prix: 10400, categorie: 'Sacs', en_vedette: true },

  // Montres
  { nom: 'Rolex Submariner Date 126610LN', description: 'La référence absolue de la plongée. Acier Oystersteel, lunette Cerachrom noire, mouvement 3235.', prix: 12800, categorie: 'Montres', en_vedette: true },
  { nom: 'Patek Philippe Nautilus 5711/1A', description: 'Le Saint-Graal de l\'horlogerie sportive. Cadran bleu strié, calibre 26-330 S C. Pièce rare.', prix: 145000, categorie: 'Montres', en_vedette: true },
  { nom: 'Audemars Piguet Royal Oak 15500ST', description: 'Boîtier 41 mm acier, cadran Grande Tapisserie bleu, calibre 4302. Le luxe contemporain.', prix: 58000, categorie: 'Montres', en_vedette: false },
  { nom: 'Cartier Santos de Cartier Large', description: 'Acier brossé, cadran argenté guilloché, bracelet QuickSwitch. Élégance parisienne intemporelle.', prix: 8200, categorie: 'Montres', en_vedette: false },
  { nom: 'Omega Speedmaster Moonwatch', description: 'La montre qui a marché sur la Lune. Boîtier 42 mm, mouvement Master Chronometer 3861.', prix: 7400, categorie: 'Montres', en_vedette: false },

  // Vêtements
  { nom: 'Loewe Hoodie Anagram Embossé', description: 'Sweat à capuche en coton brossé épais, anagramme embossé poitrine, coupe oversize.', prix: 890, categorie: 'Vêtements', en_vedette: false },
  { nom: 'Balenciaga Tracksuit Demna Logo', description: 'Veste et pantalon en nylon technique, logo Balenciaga ton sur ton, coupe ample contemporaine.', prix: 1750, categorie: 'Vêtements', en_vedette: false },
  { nom: 'Stone Island Cargo Ghost Piece', description: 'Pantalon cargo en coton brossé, traitement Ghost Piece, badge boussole amovible.', prix: 520, categorie: 'Vêtements', en_vedette: false },
  { nom: 'Off-White Caravaggio Hoodie', description: 'Sweat à capuche imprimé Caravage, coton lourd, finitions signature Off-White™.', prix: 720, categorie: 'Vêtements', en_vedette: false },

  // Accessoires
  { nom: 'Cartier Love Bracelet Or Jaune', description: 'Le bracelet emblématique. Or jaune 18 carats, fermeture à vis avec tournevis Cartier.', prix: 7250, categorie: 'Accessoires', en_vedette: true },
  { nom: 'Hermès Constance Belt H Buckle', description: 'Ceinture en cuir Epsom noir/gold réversible, boucle H argentée palladium. Largeur 32 mm.', prix: 1100, categorie: 'Accessoires', en_vedette: false },
  { nom: 'LV Multi Pochette Accessoires', description: 'Mini-sac toile Monogram avec deux pochettes amovibles, bandoulière colorée. Pièce hype.', prix: 2250, categorie: 'Accessoires', en_vedette: false },
]

function melange(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

async function listerImages() {
  // Récupère toutes les images déjà uploadées
  const { data, error } = await supabase.storage.from('produits-images').list('', { limit: 1000 })
  if (error) throw error
  return data
    .filter(f => /\.(jpe?g|png|webp)$/i.test(f.name))
    .map(f => supabase.storage.from('produits-images').getPublicUrl(f.name).data.publicUrl)
}

async function main() {
  console.log('→ Récupération des images du bucket produits-images...')
  const urls = await listerImages()
  console.log(`  ${urls.length} images disponibles`)

  if (urls.length < 2) {
    console.error('Trop peu d\'images dans Supabase Storage. Lance d\'abord npm run upload:downloads')
    process.exit(1)
  }

  if (process.env.PURGE === '1') {
    console.log('\n→ Suppression des produits existants...')
    const { error } = await supabase.from('produits').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) console.warn('  Erreur de purge :', error.message)
    else console.log('  ✓ produits existants supprimés')
  }

  console.log(`\n→ Insertion de ${PRODUITS.length} produits premium...`)

  const urlsMelangees = melange(urls)
  let curseur = 0

  for (const produit of PRODUITS) {
    const nbImages = 2 + Math.floor(Math.random() * 2) // 2 ou 3 images
    const images = []
    for (let i = 0; i < nbImages; i++) {
      images.push(urlsMelangees[curseur % urlsMelangees.length])
      curseur++
    }
    const aInserer = {
      ...produit,
      images,
      image_url: images[0],
    }
    const { error } = await supabase.from('produits').insert([aInserer])
    if (error) {
      console.log(`  ✗ ${produit.nom}: ${error.message}`)
    } else {
      console.log(`  ✓ ${produit.nom} (${images.length} images) — ${produit.prix}€`)
    }
  }

  console.log('\nTerminé !')
  console.log('Astuce : pour repartir de zéro, lance avec PURGE=1 npm run seed:premium')
}

main().catch(err => {
  console.error('Erreur :', err)
  process.exit(1)
})
