#!/usr/bin/env node
/**
 * Script pour uploader les photos de ~/Downloads vers Supabase
 * et les associer aléatoirement aux produits existants (2 ou 3 par produit).
 *
 * Usage :
 *   1. Récupère ta SERVICE_ROLE key sur Supabase → Project Settings → API
 *      (étiquette ROUGE "secret" — ne JAMAIS la commiter)
 *   2. Lance :
 *      SUPABASE_SERVICE_ROLE=eyJ... node scripts/upload-downloads.mjs
 *
 * Note : ce script utilise la SERVICE_ROLE pour contourner les politiques RLS.
 * Il ne doit JAMAIS être exécuté dans un navigateur ou déployé côté client.
 */
import { createClient } from '@supabase/supabase-js'
import { readFile, readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
// Charger .env.local (en priorité) puis .env
dotenv.config({ path: join(__dirname, '..', '.env.local') })
dotenv.config({ path: join(__dirname, '..', '.env') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Manque NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE')
  console.error('Astuce : SUPABASE_SERVICE_ROLE=eyJ... node scripts/upload-downloads.mjs')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE)

const DOWNLOADS = join(homedir(), 'Downloads')
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

async function listerImages() {
  const fichiers = await readdir(DOWNLOADS)
  return fichiers
    .filter(f => EXTENSIONS.some(ext => f.toLowerCase().endsWith(ext)))
    .map(f => join(DOWNLOADS, f))
}

async function uploaderImage(chemin) {
  const buffer = await readFile(chemin)
  const ext = chemin.split('.').pop()
  const nom = `download-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage
    .from('produits-images')
    .upload(nom, buffer, { contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}` })
  if (error) throw error
  const { data } = supabase.storage.from('produits-images').getPublicUrl(nom)
  return data.publicUrl
}

function melange(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

async function main() {
  console.log(`Recherche d'images dans ${DOWNLOADS}...`)
  const fichiers = await listerImages()
  console.log(`→ ${fichiers.length} images trouvées`)

  if (fichiers.length === 0) {
    console.log('Aucune image à uploader.')
    return
  }

  console.log('\nUpload vers Supabase Storage...')
  const urls = []
  for (const [i, fichier] of fichiers.entries()) {
    process.stdout.write(`  [${i + 1}/${fichiers.length}] ${fichier.split('/').pop()}... `)
    try {
      const url = await uploaderImage(fichier)
      urls.push(url)
      console.log('✓')
    } catch (err) {
      console.log(`✗ (${err.message})`)
    }
  }

  console.log(`\n${urls.length} images uploadées.`)

  // Récupérer les produits
  const { data: produits, error } = await supabase.from('produits').select('id, nom')
  if (error) throw error
  console.log(`\n${produits.length} produits à mettre à jour.`)

  // Répartir les URLs : 2 à 3 images par produit
  const urlsMelangees = melange(urls)
  let curseur = 0

  for (const produit of produits) {
    const nbImages = Math.min(2 + Math.floor(Math.random() * 2), urlsMelangees.length - curseur)
    if (nbImages <= 0) {
      // On boucle si plus assez d'URLs
      curseur = 0
    }
    const images = urlsMelangees.slice(curseur, curseur + Math.max(2, nbImages))
    curseur = (curseur + 2) % urlsMelangees.length

    const { error: errUpd } = await supabase
      .from('produits')
      .update({ images, image_url: images[0] })
      .eq('id', produit.id)

    if (errUpd) {
      console.log(`  ✗ ${produit.nom}: ${errUpd.message}`)
    } else {
      console.log(`  ✓ ${produit.nom} (${images.length} images)`)
    }
  }

  console.log('\nTerminé !')
}

main().catch(err => {
  console.error('Erreur :', err)
  process.exit(1)
})
