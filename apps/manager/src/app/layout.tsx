import type { Metadata } from 'next'

import '@nino/ds/globals.css'

export const metadata: Metadata = {
  title: 'Nino — Gestor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
