import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SiteChrome } from '@/components/site-chrome'

export const metadata: Metadata = {
  metadataBase: new URL('https://hcp-digital-lab.org'),
  title: 'HCP Digital Labo | Agence Premium de Transformation Digitale',
  description:
    'HCP Digital Labo - Votre partenaire structurant pour la strategie, le digital, l\'evenementiel, la production et la formation. Performance. Impact. Innovation.',
}

export const viewport: Viewport = {
  themeColor: '#f7faf8',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
