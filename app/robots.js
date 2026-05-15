const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://c-h-prestige.vercel.app'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Empêcher l'indexation de la zone admin et des API
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
