import Link from 'next/link'
import Navbar from '@/components/Navbar'
import BrandMark from '@/components/BrandMark'

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh' }}>
      <Navbar />
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'min(120px, 16vw) max(20px, env(safe-area-inset-left)) 120px max(20px, env(safe-area-inset-right))' }}>
        <div className="apple-hero-glow" aria-hidden />
        <div className="apple-grid-fine" aria-hidden />

        <div className="section-shell" style={{ maxWidth: 840, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <BrandMark size="lg" />
          </div>
          <p className="apple-eyebrow" style={{ marginBottom: 10 }}>404 · Publicación no disponible</p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 'clamp(34px, 5vw, 56px)',
              color: 'var(--text)',
              marginBottom: 16,
              letterSpacing: '-0.05em',
              lineHeight: 1.02,
            }}
          >
            Esta unidad ya no está donde esperabas.
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-tertiary)', marginBottom: 28, fontSize: 18, lineHeight: 1.65, maxWidth: 560, marginInline: 'auto' }}>
            Puede haber sido vendida, pausada o el enlace ya no ser válido. Volvé al inventario para seguir mirando opciones activas.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/" className="btn-primary">
              Volver al inicio
            </Link>
            <a href="/#inventario" className="btn-ghost">
              Ver inventario
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
