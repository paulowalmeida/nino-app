import type { Metadata } from 'next'
import { Nunito, Plus_Jakarta_Sans } from 'next/font/google'

import './landing.css'
import './components.css'
import './sections.css'

const display = Nunito({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-display',
})

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
})

const siteUrl = 'https://nino.delivery'
const description =
  'Plataforma white-label de delivery: transforme seu restaurante em um ' +
  'app de pedidos próprio, sem comissão abusiva e com a sua marca.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nino — Seu delivery, sua marca',
    template: '%s · Nino',
  },
  description,
  keywords: [
    'delivery',
    'white label',
    'app de delivery',
    'pedidos online',
    'restaurante',
    'cardápio digital',
    'gestão de pedidos',
  ],
  authors: [{ name: 'Nino' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    siteName: 'Nino',
    title: 'Nino — Seu delivery, sua marca',
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nino — Seu delivery, sua marca',
    description,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
