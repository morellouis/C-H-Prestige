import './globals.css'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-playfair',
})

export const metadata = {
  metadataBase: new URL('https://c-h-prestige.vercel.app'),
  title: {
    default: 'C&H Prestige · Sneakers & Sacs de Luxe Authentifiés',
    template: '%s · C&H Prestige',
  },
  description:
    "C&H Prestige · Boutique de luxe en ligne. Sneakers, sacs Louis Vuitton, Gucci, Céline, Chanel, Hermès. Pièces authentifiées, livraison gratuite dès 200€, expédition le jour même.",
  keywords: [
    'C&H Prestige',
    'sneakers de luxe',
    'sac Louis Vuitton',
    'sac Gucci',
    'sac Céline',
    'Air Jordan',
    'sac de luxe',
    'achat revente luxe',
    'pièces authentifiées',
    'maroquinerie de luxe',
    'seconde main luxe',
  ],
  authors: [{ name: 'C&H Prestige' }],
  creator: 'C&H Prestige',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://c-h-prestige.vercel.app',
    siteName: 'C&H Prestige',
    title: 'C&H Prestige · Sneakers & Sacs de Luxe Authentifiés',
    description:
      "Boutique en ligne de pièces de luxe authentifiées : sneakers, sacs Louis Vuitton, Gucci, Céline, Chanel, Hermès. Livraison gratuite dès 200€.",
    images: [
      {
        url: '/icon.png',
        width: 640,
        height: 415,
        alt: 'C&H Prestige',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'C&H Prestige · Luxe Authentifié',
    description:
      "Sneakers, sacs Louis Vuitton, Gucci, Céline, Chanel. Authentifiés. Livraison gratuite dès 200€.",
    images: ['/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  category: 'shopping',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`h-full relative ${playfair.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col relative">{children}</body>
    </html>
  )
}
