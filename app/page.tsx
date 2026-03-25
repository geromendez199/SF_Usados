import { Suspense } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import BrandMark from '@/components/BrandMark'
import CarCard from '@/components/CarCard'
import Filters from '@/components/Filters'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import type { Listing } from '@/types'

interface SP { brand?: string; province?: string; maxPrice?: string; yearFrom?: string; fuel?: string; q?: string; sort?: string }

const WA_NUMBER = '5493492273442'

const TRUST_POINTS = [
  {
    title: 'Contacto real, sin vueltas',
    body: 'Consultás directo por WhatsApp y coordinás con atención humana, rápida y clara.',
  },
  {
    title: 'Información visible desde el inicio',
    body: 'Precio, kilometraje, año, combustible y ubicación para decidir con menos fricción.',
  },
  {
    title: 'Selección enfocada en mover unidades',
    body: 'Mostramos oportunidades concretas, no un catálogo inflado que te hace perder tiempo.',
  },
]

const BENEFITS = [
  {
    title: 'Visitas más simples',
    body: 'La web está pensada para que pases de mirar a coordinar una visita en minutos.',
  },
  {
    title: 'Venta más confiable',
    body: 'Sumamos señales de confianza, consejos de compra y una presentación mucho más profesional.',
  },
  {
    title: 'Más intención de compra',
    body: 'Los CTA, el orden del contenido y la jerarquía visual empujan mejor la conversión.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Luciano, Rafaela',
    quote: 'La diferencia fue la claridad. Vi el auto, pregunté por WhatsApp y ese mismo día coordinamos para verlo.',
  },
  {
    name: 'Camila, Santa Fe',
    quote: 'La presentación transmite seriedad. Sentís que no estás escribiendo a un perfil improvisado.',
  },
  {
    name: 'Martín, Esperanza',
    quote: 'Entré por Instagram, pero la web me terminó de convencer porque ordena todo mucho mejor.',
  },
]

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
  const latest = listings[0]
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
                Showroom digital · Santa Fe
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
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(17px, 2.2vw, 21px)',
                    fontWeight: 400,
                    color: 'var(--text-tertiary)',
                    maxWidth: 620,
                    lineHeight: 1.6,
                    letterSpacing: '-0.015em',
                    marginTop: 18,
                  }}
                >
                  Rediseñamos la experiencia para que cada publicación se sienta premium: mejor información, mejor confianza y una salida directa a WhatsApp cuando aparece el auto correcto.
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

            <aside className="hero-stage">
              <div className="hero-stage-panel">
                <span className="hero-stage-kicker">
                  <span className="apple-chip-dot" aria-hidden />
                  Experiencia pensada para convertir
                </span>

                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 40px)', letterSpacing: '-0.04em', lineHeight: 1.04 }}>
                    Menos catálogo frío. Más decisión, confianza y contacto.
                  </p>
                  <p style={{ marginTop: 12, maxWidth: 420, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
                    La nueva portada mezcla valor visual con intención comercial: explica rápido por qué mirar, por qué confiar y por qué escribir.
                  </p>
                </div>

                <div className="hero-stage-grid">
                  <div className="hero-stage-card">
                    <strong>{featured.length}</strong>
                    <span>unidades destacadas listas para empujar la consulta</span>
                  </div>
                  <div className="hero-stage-card">
                    <strong>{latest ? latest.brand : 'SF'}</strong>
                    <span>último ingreso visible desde el hero</span>
                  </div>
                  <div className="hero-stage-card">
                    <strong>CTA directos</strong>
                    <span>consulta, visita, financiación y permuta más claras</span>
                  </div>
                  <div className="hero-stage-card">
                    <strong>Mejor confianza</strong>
                    <span>señales comerciales para bajar la fricción de compra</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div id="inventario" style={{ maxWidth: 1120, margin: '0 auto', padding: 'clamp(32px, 5vw, 48px) max(20px, env(safe-area-inset-left)) 120px max(20px, env(safe-area-inset-right))' }}>
        <section className="section-shell" style={{ marginTop: 0 }}>
          <div className="cta-grid">
            <div className="premium-card">
              <p className="apple-section-label" style={{ marginBottom: 12 }}>Nueva propuesta</p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: 14 }}>
                Una web que no solo muestra autos. Los vende mejor.
              </h2>
              <p>
                Ordenamos el contenido para que la gente entienda rápido qué hay, por qué vale la pena y cómo avanzar al siguiente paso. Esto hace que el sitio se vea más serio y también convierta más.
              </p>
            </div>

            <div className="premium-card">
              <p className="apple-section-label" style={{ marginBottom: 12 }}>Acciones rápidas</p>
              <div className="cta-list">
                <a href="#filtros" className="btn-ghost" style={{ justifyContent: 'space-between' }}>
                  Filtrar inventario ahora
                  <span>→</span>
                </a>
                {latest && (
                  <Link href={`/listing/${latest.id}`} className="btn-ghost" style={{ justifyContent: 'space-between' }}>
                    Ver último ingreso
                    <span>→</span>
                  </Link>
                )}
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%' }}>
                  Hablar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
            <span className="apple-section-label">Confianza</span>
            <div className="apple-divider-fade" />
          </div>
          <div className="trust-grid">
            {TRUST_POINTS.map(item => (
              <div key={item.title} className="trust-item">
                <div className="trust-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 3 4 7v6c0 5 3.5 7.74 8 9 4.5-1.26 8-4 8-9V7l-8-4Z" />
                    <path d="m9.5 12 1.7 1.7L15 10" />
                  </svg>
                </div>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </div>
            ))}
          </div>
        </section>

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

        <section className="section-shell">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
            <span className="apple-section-label">Qué mejora</span>
            <div className="apple-divider-fade" />
          </div>
          <div className="benefit-grid">
            {BENEFITS.map(item => (
              <div key={item.title} className="benefit-item">
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section-shell">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
            <span className="apple-section-label">Prueba social</span>
            <div className="apple-divider-fade" />
          </div>
          <div className="testimonial-grid">
            {TESTIMONIALS.map(item => (
              <div key={item.name} className="testimonial-item">
                <div className="testimonial-rating" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                </div>
                <strong>{item.name}</strong>
                <span>{item.quote}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section-shell">
          <div className="cta-grid">
            <div className="premium-card">
              <p className="apple-section-label" style={{ marginBottom: 12 }}>Conversión directa</p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: 14 }}>
                Si alguien ya vio algo que le interesa, no debería tener que pensar qué hacer después.
              </h2>
              <div className="feature-list">
                {[
                  'WhatsApp visible desde cualquier parte de la web.',
                  'Detalle más comercial para empujar consulta, visita y financiación.',
                  'Secciones de confianza para reducir ansiedad de compra.',
                ].map(text => (
                  <div key={text} className="feature-list-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="premium-card">
              <p className="apple-section-label" style={{ marginBottom: 12 }}>Siguiente paso</p>
              <h3>Listo para recibir consultas mejores</h3>
              <p style={{ marginBottom: 20 }}>
                La web ahora acompaña mejor la decisión. El próximo salto podría ser agregar comparador, financiación dinámica o testimonios reales desde el admin.
              </p>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%' }}>
                Consultar ahora
              </a>
            </div>
          </div>
        </section>
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

      <FloatingWhatsApp href={waHref} />
    </main>
  )
}
