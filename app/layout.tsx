import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SF_Usados — Autos usados en Santa Fe',
  description: 'Los mejores autos usados de Santa Fe. Contacto directo, sin intermediarios.',
  keywords: 'autos usados santa fe, venta autos rafaela, comprar auto santa fe',
  openGraph: {
    title: 'SF_Usados — Autos usados en Santa Fe',
    description: 'Los mejores autos usados de Santa Fe.',
    type: 'website',
    locale: 'es_AR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body className="apple-app">{children}</body>
    </html>
  )
}
