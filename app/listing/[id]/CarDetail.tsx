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
    <main style={{ minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: 'clamp(24px, 4vw, 40px) max(20px, env(safe-area-inset-left)) 100px max(20px, env(safe-area-inset-right))' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 500,
            color: isBackHovered ? 'var(--text)' : 'var(--text-secondary)',
            textDecoration: 'none',
            marginBottom: 28,
            transition: 'color 0.2s ease',
            padding: '6px 4px',
            marginLeft: -4,
            borderRadius: 8,
          }}
          onMouseEnter={() => setIsBackHovered(true)}
          onMouseLeave={() => setIsBackHovered(false)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Listado
        </Link>

        <div className="detail-grid">
          <div>
            <div
              style={{
                position: 'relative',
                paddingBottom: '56%',
                background: '#0a0a0a',
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: 12,
                boxShadow: '0 24px 48px rgba(0,0,0,0.45)',
              }}
            >
              {listing.images?.length > 0 ? (
                <Image
                  src={listing.images[safeActiveImg]}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 1120px"
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1">
                    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
                    <rect x="9" y="11" width="14" height="10" rx="2"/>
                    <circle cx="12" cy="16" r="1"/><circle cx="20" cy="16" r="1"/>
                  </svg>
                </div>
              )}
              {listing.is_featured && (
                <div style={{ position: 'absolute', top: 18, left: 18 }}>
                  <span className="badge-featured">Destacado</span>
                </div>
              )}
            </div>

            {listing.images?.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  overflowX: 'auto',
                  paddingBottom: 6,
                  scrollbarWidth: 'thin',
                }}
              >
                {listing.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    aria-label={`Imagen ${i + 1} de ${listing.images.length}`}
                    aria-current={safeActiveImg === i}
                    style={{
                      flexShrink: 0,
                      width: 80,
                      height: 56,
                      position: 'relative',
                      borderRadius: 12,
                      overflow: 'hidden',
                      padding: 0,
                      background: 'rgba(255,255,255,0.04)',
                      border: safeActiveImg === i ? '2px solid rgba(255,255,255,0.85)' : '2px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease, transform 0.2s ease',
                      outline: 'none',
                    }}
                  >
                    <Image src={img} alt="" fill className="object-cover" loading="lazy" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="detail-sidebar">
            <div className="apple-glass" style={{ overflow: 'hidden' }}>
              <div style={{ padding: 'clamp(24px, 4vw, 32px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 'clamp(28px, 5vw, 40px)',
                    color: 'var(--text)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.08,
                    marginBottom: 8,
                  }}
                >
                  {listing.brand} {listing.model}
                  {listing.version && (
                    <span
                      style={{
                        display: 'block',
                        marginTop: 8,
                        fontWeight: 500,
                        fontSize: '0.45em',
                        color: 'var(--text-tertiary)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {listing.version}
                    </span>
                  )}
                </h1>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 'clamp(32px, 6vw, 44px)',
                    color: 'var(--text)',
                    letterSpacing: '-0.035em',
                    lineHeight: 1,
                    marginBottom: 16,
                  }}
                >
                  {formatPrice(listing.price, listing.currency)}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  <span className="apple-chip">{listing.year}</span>
                  {listing.transmission && <span className="apple-chip">{listing.transmission}</span>}
                  {listing.fuel && <span className="apple-chip">{listing.fuel}</span>}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: 16 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--text-tertiary)' }}>
                    Publicado {timeAgo(listing.created_at)}
                  </span>
                  {listing.views > 0 && (
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--text-tertiary)' }}>
                      {listing.views} visitas
                    </span>
                  )}
                </div>
              </div>

              <div style={{ padding: 'clamp(22px, 3vw, 28px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="apple-section-label" style={{ marginBottom: 16 }}>
                  Ficha técnica
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 10 }}>
                  {specs.map(spec => (
                    <div
                      key={spec.label}
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 14,
                        padding: '14px 16px',
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 10,
                          fontWeight: 600,
                          color: 'var(--text-tertiary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          marginBottom: 6,
                        }}
                      >
                        {spec.label}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 600,
                          fontSize: 15,
                          color: 'var(--text-secondary)',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {String(spec.value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {listing.description && (
                <div style={{ padding: 'clamp(22px, 3vw, 28px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="apple-section-label" style={{ marginBottom: 12 }}>
                    Descripción
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 16,
                      fontWeight: 400,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.65,
                      letterSpacing: '-0.01em',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {listing.description}
                  </p>
                </div>
              )}

              <div style={{ padding: 'clamp(22px, 3vw, 28px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ width: '100%', padding: '16px 24px', fontSize: 15 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                  Consultar por WhatsApp
                </a>
                <a href="https://www.instagram.com/sf_usados" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ width: '100%', padding: '14px 24px', fontSize: 14 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                  @sf_usados
                </a>
              </div>

              <div style={{ margin: '0 24px 24px', padding: '16px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--text-tertiary)', lineHeight: 1.55 }}>
                  Consejo: pedí patente para verificar en Infojus, revisá documentación y coordiná un encuentro en un lugar público.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
