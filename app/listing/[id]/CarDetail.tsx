'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { formatPrice, formatKm, buildWhatsApp, timeAgo } from '@/lib/utils'
import type { Listing } from '@/types'

const WA_NUMBER = '5493492273442'

export default function CarDetail({ listing }: { listing: Listing }) {
  const [activeImg, setActiveImg] = useState(0)
  const [isBackHovered, setIsBackHovered] = useState(false)
  const waLink = buildWhatsApp(WA_NUMBER, listing)
  const imageCount = listing.images?.length ?? 0
  const safeActiveImg = imageCount > 0 ? Math.min(activeImg, imageCount - 1) : 0

  const specs = [
    { label: 'Marca', value: listing.brand },
    { label: 'Modelo', value: listing.model },
    { label: 'Versión', value: listing.version },
    { label: 'Año', value: listing.year },
    { label: 'Kilometraje', value: formatKm(listing.km) },
    { label: 'Motor', value: listing.engine },
    { label: 'Combustible', value: listing.fuel },
    { label: 'Caja', value: listing.transmission },
    { label: 'Color', value: listing.color },
    { label: 'Ubicación', value: listing.city ? `${listing.city}, ${listing.province}` : listing.province },
  ].filter(s => s.value)

  return (
    <main style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px 80px' }}>

        {/* Back */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: isBackHovered ? '#fff' : '#555',
            textDecoration: 'none',
            marginBottom: 24,
            transition: 'color 0.2s',
          }}
          onMouseEnter={() => setIsBackHovered(true)}
          onMouseLeave={() => setIsBackHovered(false)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Volver al listado
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>

          {/* ── IMAGES ── */}
          <div>
            <div style={{ position: 'relative', paddingBottom: '54%', background: '#111', borderRadius: 14, overflow: 'hidden', border: '1px solid #1e1e1e', marginBottom: 8 }}>
              {listing.images?.length > 0 ? (
                <Image
                  src={listing.images[safeActiveImg]}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 1100px"
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1">
                    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
                    <rect x="9" y="11" width="14" height="10" rx="2"/>
                    <circle cx="12" cy="16" r="1"/><circle cx="20" cy="16" r="1"/>
                  </svg>
                </div>
              )}
              {listing.is_featured && (
                <div style={{ position: 'absolute', top: 14, left: 14 }}>
                  <span className="badge-featured">★ Destacado</span>
                </div>
              )}
            </div>
            {listing.images?.length > 1 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                {listing.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    aria-label={`Ver imagen ${i + 1} de ${listing.images.length}`}
                    aria-current={safeActiveImg === i}
                    style={{
                      flexShrink: 0, width: 76, height: 54, position: 'relative',
                      borderRadius: 8, overflow: 'hidden', padding: 0, background: 'none',
                      border: `2px solid ${safeActiveImg === i ? '#fff' : '#222'}`,
                      cursor: 'pointer', transition: 'border-color 0.15s',
                    }}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="76px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── INFO CARD ── */}
          <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: 14, overflow: 'hidden' }}>

            {/* Header strip */}
            <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #1a1a1a' }}>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic',
                fontSize: 'clamp(24px, 5vw, 34px)', color: '#fff',
                letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 4,
              }}>
                {listing.brand} {listing.model}
                {listing.version && (
                  <span style={{ fontWeight: 600, fontStyle: 'normal', fontSize: '0.6em', color: '#555', display: 'block', marginTop: 4 }}>
                    {listing.version}
                  </span>
                )}
              </h1>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic', fontSize: 'clamp(28px, 6vw, 42px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {formatPrice(listing.price, listing.currency)}
              </p>
              <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#444' }}>Publicado {timeAgo(listing.created_at)}</span>
                {listing.views > 0 && <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#444' }}>{listing.views} visitas</span>}
              </div>
            </div>

            {/* Specs grid */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1a1a1a' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
                Ficha técnica
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                {specs.map(spec => (
                  <div key={spec.label} style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: 8, padding: '10px 12px' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: '#4a4a4a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                      {spec.label}
                    </p>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: '#d0d0d0' }}>
                      {String(spec.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #1a1a1a' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Descripción
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#888', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {listing.description}
                </p>
              </div>
            )}

            {/* CTAs */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="btn-whatsapp" style={{ width: '100%', padding: '16px', fontSize: 15 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Consultar por WhatsApp
              </a>
              <a href="https://www.instagram.com/sf_usados" target="_blank" rel="noopener noreferrer"
                className="btn-ghost" style={{ width: '100%', padding: '14px', fontSize: 13 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                @sf_usados
              </a>
            </div>

            {/* Safety */}
            <div style={{ margin: '0 24px 24px', padding: '12px 14px', background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 8 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#444', lineHeight: 1.6 }}>
                💡 Pedí el número de patente para verificar en Infojus, revisá papeles y acordá el encuentro en lugar público.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
