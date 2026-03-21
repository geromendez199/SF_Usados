import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '100px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: 64, marginBottom: 20 }}>🚗</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic', fontSize: 36, color: '#fff', marginBottom: 12 }}>
          Auto no encontrado
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: '#555', marginBottom: 32 }}>
          Esta publicación no existe o fue eliminada.
        </p>
        <Link href="/" style={{
          display: 'inline-block', background: '#fff', color: '#0A0A0A',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
          letterSpacing: '0.04em', textTransform: 'uppercase',
          padding: '14px 28px', borderRadius: 10, textDecoration: 'none',
        }}>
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
