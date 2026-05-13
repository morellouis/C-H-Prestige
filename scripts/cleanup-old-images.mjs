#!/usr/bin/env node
/**
 * Supprime les anciennes images du bucket produits-images
 * (celles qui ne sont plus référencées par aucun produit).
 *
 * Usage : npm run cleanup:images
 */
import { createClient } from '@supabase/supabase-js'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE } = process.env
if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('Manque NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE')
  process.exit(1)
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE)

async function main() {
  console.log('→ Listing des fichiers du bucket...')
  const { data: fichiers, error: err1 } = await supabase.storage
    .from('produits-images')
    .list('', { limit: 1000 })
  if (err1) throw err1
  console.log(`  ${fichiers.length} fichiers dans le bucket`)

  console.log('\n→ Listing des images encore utilisées...')
  const { data: produits, error: err2 } = await supabase.from('produits').select('images, image_url')
  if (err2) throw err2

  const utilisees = new Set()
  for (const p of produits) {
    if (p.image_url) utilisees.add(p.image_url.split('/').pop())
    for (const url of p.images || []) {
      utilisees.add(url.split('/').pop())
    }
  }
  console.log(`  ${utilisees.size} fichiers référencés par des produits`)

  const aSupprimer = fichiers.filter(f => !utilisees.has(f.name)).map(f => f.name)
  console.log(`\n→ ${aSupprimer.length} fichiers orphelins à supprimer`)

  if (aSupprimer.length === 0) {
    console.log('Rien à faire.')
    return
  }

  // Supprimer par lots de 100
  for (let i = 0; i < aSupprimer.length; i += 100) {
    const lot = aSupprimer.slice(i, i + 100)
    const { error } = await supabase.storage.from('produits-images').remove(lot)
    if (error) console.log(`  ✗ Lot ${i}: ${error.message}`)
    else console.log(`  ✓ Lot ${i}: ${lot.length} fichiers supprimés`)
  }

  console.log('\nTerminé !')
}

main().catch(err => {
  console.error('Erreur :', err)
  process.exit(1)
})
