import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  title: 'C&H Prestige',
  description: 'Articles de prestige',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="h-full" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col relative">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
