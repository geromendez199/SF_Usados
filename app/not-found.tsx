import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 480, margin: '0 auto', padding: 'min(120px, 20vw) max(20px, env(safe-area-inset-left)) 80px max(20px, env(safe-area-inset-right))', textAlign: 'center' }}>
        <p style={{ fontSize: 52, marginBottom: 24, opacity: 0.3 }} aria-hidden>🚗</p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 'clamp(28px, 5vw, 34px)',
            color: 'var(--text)',
            marginBottom: 12,
            letterSpacing: '-0.03em',
          }}
        >
          No encontramos esta publicación
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-tertiary)', marginBottom: 36, fontSize: 17, lineHeight: 1.5 }}>
          Puede haber sido eliminada o el enlace es incorrecto.
        </p>
        <Link href="/" className="btn-primary">
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
