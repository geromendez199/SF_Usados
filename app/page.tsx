import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import SFLogo from '@/components/SFLogo'
import CarCard from '@/components/CarCard'
import Filters from '@/components/Filters'
import type { Listing } from '@/types'

interface SP { brand?: string; province?: string; maxPrice?: string; yearFrom?: string; fuel?: string }

async function getListings(sp: SP): Promise<Listing[]> {
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

  return (
    <main style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '60px 20px 52px', borderBottom: '1px solid #161616' }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.025,
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 300,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20 }}>
            {/* Logo grande */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
              <SFLogo size={64} />
              <div>
                <h1 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic',
                  fontSize: 'clamp(42px, 8vw, 80px)', color: '#fff',
                  letterSpacing: '-0.04em', lineHeight: 0.9, textTransform: 'uppercase',
                  margin: 0,
                }}>
                  SF_<span style={{ color: '#8A8A8A' }}>Usados</span>
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#444', marginTop: 8 }}>
                  Autos usados · Santa Fe, Argentina
                </p>
              </div>
            </div>

            {/* White accent line */}
            <div style={{ height: 3, width: 100, background: '#fff', borderRadius: 2 }} />

            {/* Stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontSize: 13, color: '#555' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                {listings.length} autos publicados
              </span>
              <span style={{ color: '#222' }}>·</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#555' }}>WhatsApp directo</span>
              <span style={{ color: '#222' }}>·</span>
              <a href="https://www.instagram.com/sf_usados" target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#666', textDecoration: 'none' }}>
                @sf_usados
              </a>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 80px' }}>
        <Suspense fallback={null}>
          <div style={{ marginBottom: 28 }}>
            <Filters />
          </div>
        </Suspense>

        {listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🚗</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic', fontSize: 28, color: '#fff', marginBottom: 8 }}>Sin resultados</h3>
            <p style={{ fontFamily: 'var(--font-body)', color: '#555' }}>Intentá con otros filtros o volvé pronto.</p>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase' }}>★ Destacados</span>
                  <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
                  {featured.map((l, i) => <CarCard key={l.id} listing={l} index={i} />)}
                </div>
              </div>
            )}
            {regular.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, color: '#333', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Todos los autos</span>
                    <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
                  {regular.map((l, i) => <CarCard key={l.id} listing={l} index={i} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #141414', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <SFLogo size={28} />
        </div>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic', fontSize: 16, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>
          SF_Usados
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#383838' }}>
          © {new Date().getFullYear()} · Santa Fe, Argentina ·{' '}
          <a href="https://www.instagram.com/sf_usados" target="_blank" rel="noopener noreferrer" style={{ color: '#444', textDecoration: 'none' }}>
            @sf_usados
          </a>
        </p>
      </footer>
    </main>
  )
}
