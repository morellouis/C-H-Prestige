import { getProduits } from '@/lib/produits'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://c-h-prestige.vercel.app'

export default async function sitemap() {
  // Pages statiques
  const pagesStatiques = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/produits`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Pages produit dynamiques
  let pagesProduits = []
  try {
    const produits = await getProduits()
    pagesProduits = produits.map(p => ({
      url: `${BASE_URL}/produits/${p.id}`,
      lastModified: p.created_at ? new Date(p.created_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch {
    // Supabase indisponible → on retourne juste les pages statiques
  }

  return [...pagesStatiques, ...pagesProduits]
}
