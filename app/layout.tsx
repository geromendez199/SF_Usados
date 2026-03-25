import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SF_Usados — Autos usados en Santa Fe',
  description: 'Los mejores autos usados de Santa Fe. Contacto directo, sin intermediarios.',
  keywords: 'autos usados santa fe, venta autos rafaela, comprar auto santa fe',
  metadataBase: new URL('https://sf-usados.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SF_Usados — Autos usados en Santa Fe',
    description: 'Los mejores autos usados de Santa Fe. Contacto directo, sin intermediarios.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'SF_Usados',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SF_Usados — Autos usados en Santa Fe',
    description: 'Autos usados con contacto directo por WhatsApp y una experiencia premium para consultar.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body className="apple-app">{children}</body>
    </html>
  )
}
