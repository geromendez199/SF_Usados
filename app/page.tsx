import { Suspense } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import BrandMark from '@/components/BrandMark'
import CarCard from '@/components/CarCard'
import Filters from '@/components/Filters'
import type { Listing } from '@/types'

interface SP { brand?: string; province?: string; maxPrice?: string; yearFrom?: string; fuel?: string }

async function getListings(sp: SP): Promise<Listing[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  let q = supabase.from('listings').select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
  if (sp.brand) q = q.eq('brand', sp.brand)
  if (sp.province) q = q.eq('province', sp.province)
  if (sp.maxPrice) q = q.lte('price', parseInt(sp.maxPrice))
  if (sp.yearFrom) q = q.gte('year', parseInt(sp.yearFrom))
  if (sp.fuel) q = q.eq('fuel', sp.fuel)
  const { data } = await q.limit(48)
  return (data as Listing[]) || []
}

export const revalidate = 30

export default async function Home({ searchParams }: { searchParams: SP }) {
  const listings = await getListings(searchParams)
  const featured = listings.filter(l => l.is_featured)
  const regular = listings.filter(l => !l.is_featured)
  const latest = listings[0]
  const brands = new Set(listings.map(listing => listing.brand)).size
  const locations = new Set(listings.map(listing => listing.city || listing.province)).size
  const activeFilters = [
    searchParams.brand ? `Marca: ${searchParams.brand}` : null,
    searchParams.yearFrom ? `Desde ${searchParams.yearFrom}` : null,
    searchParams.fuel ? `Combustible: ${searchParams.fuel}` : null,
    searchParams.maxPrice ? `Hasta US$ ${Number(searchParams.maxPrice).toLocaleString('es-AR')}` : null,
    searchParams.province ? `Provincia: ${searchParams.province}` : null,
  ].filter(Boolean) as string[]

  return (
    <main style={{ minHeight: '100vh' }}>
      <Navbar />

      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: 'clamp(48px, 10vw, 96px) max(20px, env(safe-area-inset-left)) clamp(40px, 8vw, 72px) max(20px, env(safe-area-inset-right))',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="apple-hero-glow" aria-hidden />
        <div className="apple-grid-fine" aria-hidden />

        <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative' }}>
          <div className="hero-shell apple-fade-in">
            <div className="hero-copy">
              <p className="apple-eyebrow" style={{ marginBottom: -8 }}>
                Marketplace · Argentina
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 'clamp(12px, 3vw, 28px)' }}>
                <BrandMark size="xl" />
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 'clamp(40px, 7.5vw, 76px)',
                    color: 'var(--text-secondary)',
                    letterSpacing: '-0.035em',
                    lineHeight: 1.02,
                    margin: 0,
                  }}
                >
                  _Usados
                </h1>
              </div>

              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(34px, 6vw, 60px)',
                    fontWeight: 600,
                    color: 'var(--text)',
                    maxWidth: 760,
                    lineHeight: 1.02,
                    letterSpacing: '-0.05em',
                  }}
                >
                  Autos seleccionados para comprar con menos vueltas.
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(17px, 2.2vw, 21px)',
                    fontWeight: 400,
                    color: 'var(--text-tertiary)',
                    maxWidth: 560,
                    lineHeight: 1.5,
                    letterSpacing: '-0.015em',
                    marginTop: 18,
                  }}
                >
                  Elegí tu próximo auto con información clara, stock actualizado y contacto directo por WhatsApp desde Santa Fe.
                </p>
              </div>

              <div className="hero-actions">
                <a href="#inventario" className="btn-primary">Ver inventario</a>
                <a
                  href="https://www.instagram.com/sf_usados"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  Seguinos en Instagram
                </a>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <div className="apple-chip">
                  <span className="apple-chip-dot" aria-hidden />
                  {listings.length} publicados
                </div>
                <div className="apple-chip">{brands} marcas</div>
                <div className="apple-chip">Atención directa</div>
              </div>
            </div>

            <aside className="hero-panel">
              <div className="hero-stats" style={{ marginBottom: 24 }}>
                <div className="hero-stat">
                  <span className="hero-stat-value">{listings.length}</span>
                  <span className="hero-stat-label">vehículos activos</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-value">{brands}</span>
                  <span className="hero-stat-label">marcas en catálogo</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-value">{locations}</span>
                  <span className="hero-stat-label">zonas cubiertas</span>
                </div>
              </div>

              <p className="apple-section-label" style={{ marginBottom: 14 }}>
                Empezá por acá
              </p>

              <div>
                <a href="#filtros" className="hero-link-card">
                  <div className="hero-link-copy">
                    <strong>Filtrar por lo que te importa</strong>
                    <span>Marca, año, combustible, precio y provincia.</span>
                  </div>
                  <span className="hero-link-arrow" aria-hidden>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M5 12h14"/>
                      <path d="m12 5 7 7-7 7"/>
                    </svg>
                  </span>
                </a>

                {latest && (
                  <Link href={`/listing/${latest.id}`} className="hero-link-card">
                    <div className="hero-link-copy">
                      <strong>Ver ingreso reciente</strong>
                      <span>{latest.brand} {latest.model}{latest.version ? ` · ${latest.version}` : ''}</span>
                    </div>
                    <span className="hero-link-arrow" aria-hidden>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M5 12h14"/>
                        <path d="m12 5 7 7-7 7"/>
                      </svg>
                    </span>
                  </Link>
                )}

                <a
                  href="https://wa.me/5493492273442"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-link-card"
                >
                  <div className="hero-link-copy">
                    <strong>Consultar por WhatsApp</strong>
                    <span>Respondemos rápido para coordinar visita o reserva.</span>
                  </div>
                  <span className="hero-link-arrow" aria-hidden>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M5 12h14"/>
                      <path d="m12 5 7 7-7 7"/>
                    </svg>
                  </span>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div id="inventario" style={{ maxWidth: 1120, margin: '0 auto', padding: 'clamp(32px, 5vw, 48px) max(20px, env(safe-area-inset-left)) 100px max(20px, env(safe-area-inset-right))' }}>
        <Suspense fallback={null}>
          <div id="filtros" style={{ marginBottom: 36 }}>
            <Filters />
          </div>
        </Suspense>

        <div className="inventory-toolbar">
          <div>
            <div className="inventory-meta">
              <span className="apple-section-label" style={{ marginBottom: 0 }}>Inventario</span>
              <div className="apple-divider-fade" style={{ width: 80, flex: 'none' }} />
            </div>
            <p className="inventory-count">{listings.length} oportunidades disponibles</p>
            <p className="inventory-subtitle">
              {activeFilters.length > 0 ? 'Resultados según tu búsqueda actual.' : 'Explorá el catálogo completo y entrá al detalle para consultar.'}
            </p>
          </div>

          {activeFilters.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' }}>
              {activeFilters.map(filter => (
                <span key={filter} className="apple-chip">{filter}</span>
              ))}
            </div>
          )}
        </div>

        {listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'min(120px, 18vw) 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 20, opacity: 0.35 }} aria-hidden>🚗</div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 'clamp(24px, 4vw, 32px)',
                color: 'var(--text)',
                marginBottom: 12,
                letterSpacing: '-0.02em',
              }}
            >
              Sin resultados
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-tertiary)', fontSize: 17, maxWidth: 360, margin: '0 auto', lineHeight: 1.5 }}>
              Probá otros filtros o volvé en otro momento.
            </p>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
                  <span className="apple-section-label">Destacados</span>
                  <div className="apple-divider-fade" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
                  {featured.map((l, i) => <CarCard key={l.id} listing={l} index={i} />)}
                </div>
              </div>
            )}
            {regular.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
                    <span className="apple-section-label">Catálogo</span>
                    <div className="apple-divider-fade" />
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
                  {regular.map((l, i) => <CarCard key={l.id} listing={l} index={i} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '48px max(20px, env(safe-area-inset-left)) 56px max(20px, env(safe-area-inset-right))',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <BrandMark size="sm" />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: 17,
              color: 'var(--text-secondary)',
              letterSpacing: '-0.02em',
            }}
          >
            _Usados
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 8, fontWeight: 500 }}>
          Santa Fe, Argentina
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-tertiary)', opacity: 0.85 }}>
          © {new Date().getFullYear()} ·{' '}
          <a
            href="https://www.instagram.com/sf_usados"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
          >
            Instagram
          </a>
        </p>
      </footer>
    </main>
  )
}
