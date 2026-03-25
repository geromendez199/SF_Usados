import { Suspense } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import BrandMark from '@/components/BrandMark'
import CarCard from '@/components/CarCard'
import Filters from '@/components/Filters'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import CompareTray from '@/components/CompareTray'
import type { Listing } from '@/types'

interface SP { brand?: string; province?: string; maxPrice?: string; yearFrom?: string; fuel?: string; q?: string; sort?: string }

const WA_NUMBER = '5493492273442'

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
  if (sp.q) {
    const search = sp.q.replace(/[,%]/g, ' ').trim()
    if (search) q = q.or(`brand.ilike.%${search}%,model.ilike.%${search}%,version.ilike.%${search}%,title.ilike.%${search}%`)
  }
  if (sp.sort === 'priceAsc') q = q.order('price', { ascending: true })
  if (sp.sort === 'priceDesc') q = q.order('price', { ascending: false })
  if (sp.sort === 'yearDesc') q = q.order('year', { ascending: false })
  if (sp.sort === 'kmAsc') q = q.order('km', { ascending: true })
  const { data } = await q.limit(48)
  return (data as Listing[]) || []
}

export const revalidate = 30

export default async function Home({ searchParams }: { searchParams: SP }) {
  const listings = await getListings(searchParams)
  const featured = listings.filter(l => l.is_featured)
  const regular = listings.filter(l => !l.is_featured)
  const brands = new Set(listings.map(listing => listing.brand)).size
  const locations = new Set(listings.map(listing => listing.city || listing.province)).size
  const sortedBy = searchParams.sort || 'newest'
  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola SF_Usados! Quiero asesoramiento para encontrar una unidad disponible.')}`
  const activeFilters = [
    searchParams.q ? `Buscar: ${searchParams.q}` : null,
    searchParams.brand ? `Marca: ${searchParams.brand}` : null,
    searchParams.yearFrom ? `Desde ${searchParams.yearFrom}` : null,
    searchParams.fuel ? `Combustible: ${searchParams.fuel}` : null,
    searchParams.maxPrice ? `Hasta US$ ${Number(searchParams.maxPrice).toLocaleString('es-AR')}` : null,
    searchParams.province ? `Provincia: ${searchParams.province}` : null,
    sortedBy !== 'newest' ? `Ordenar: ${sortedBy}` : null,
  ].filter(Boolean) as string[]
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'SF_Usados',
    itemListElement: listings.slice(0, 12).map((listing, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://sf-usados.vercel.app/listing/${listing.id}`,
      name: listing.title,
    })),
  }

  return (
    <main style={{ minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
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
                Showroom digital · Rafaela
              </p>
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(34px, 6vw, 62px)',
                    fontWeight: 600,
                    color: 'var(--text)',
                    maxWidth: 760,
                    lineHeight: 1.02,
                    letterSpacing: '-0.055em',
                  }}
                >
                  Un showroom que hace que consultar sea tan fácil como decidir.
                </p>
              </div>

              <div className="hero-actions">
                <a href="#inventario" className="btn-primary">Ver unidades disponibles</a>
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  Quiero asesoramiento
                </a>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <div className="apple-chip">
                  <span className="apple-chip-dot" aria-hidden />
                  {listings.length} publicados
                </div>
                <div className="apple-chip">{brands} marcas</div>
                <div className="apple-chip">{locations} zonas activas</div>
                <div className="apple-chip">Respuesta por WhatsApp</div>
              </div>
            </div>

            </div>
        </div>
      </section>

      <div id="inventario" style={{ maxWidth: 1120, margin: '0 auto', padding: 'clamp(32px, 5vw, 48px) max(20px, env(safe-area-inset-left)) 120px max(20px, env(safe-area-inset-right))' }}>
        <Suspense fallback={null}>
          <div id="filtros" style={{ marginTop: 32 }}>
            <Filters />
          </div>
        </Suspense>

        <div className="inventory-toolbar" style={{ marginTop: 28 }}>
          <div>
            <div className="inventory-meta">
              <span className="apple-section-label" style={{ marginBottom: 0 }}>Inventario</span>
              <div className="apple-divider-fade" style={{ width: 80, flex: 'none' }} />
            </div>
            <p className="inventory-count">{listings.length} oportunidades disponibles</p>
            <p className="inventory-subtitle">
              {activeFilters.length > 0 ? 'Resultados según tu búsqueda actual, con búsqueda y orden inteligente.' : 'Explorá el catálogo completo, buscá por modelo y ordená por precio, kilometraje o año.'}
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
              Probá otros filtros o escribinos para decirnos qué auto estás buscando.
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
          padding: '48px max(20px, env(safe-area-inset-left)) 120px max(20px, env(safe-area-inset-right))',
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
          Rafaela, Argentina
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

      <CompareTray listings={listings} />
      <FloatingWhatsApp href={waHref} />
    </main>
  )
}
