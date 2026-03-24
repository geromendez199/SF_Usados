'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import { formatPrice, formatKm, buildWhatsApp, timeAgo } from '@/lib/utils'
import type { Listing } from '@/types'

const WA_NUMBER = '5493492273442'

export default function CarDetail({ listing }: { listing: Listing }) {
  const [activeImg, setActiveImg] = useState(0)
  const [isBackHovered, setIsBackHovered] = useState(false)
  const waLink = buildWhatsApp(WA_NUMBER, listing)
  const financeLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hola SF_Usados! Quiero consultar financiación para el ${listing.title}.`)}`
  const tradeLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hola SF_Usados! Tengo una permuta para evaluar por el ${listing.title}.`)}`
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

  const sellingPoints = [
    'Contacto directo por WhatsApp con respuesta rápida.',
    'Ficha clara para evaluar la unidad antes de coordinar.',
    'Posibilidad de consultar financiación o permuta desde la misma página.',
  ]

  const trustPoints = [
    'Pedí más fotos, video o arranque en frío antes de visitar.',
    'Consultá documentación y estado general antes de cerrar.',
    'Coordiná en lugar seguro y con tiempo para revisar la unidad.',
  ]

  return (
    <main style={{ minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: 'clamp(24px, 4vw, 40px) max(20px, env(safe-area-inset-left)) 140px max(20px, env(safe-area-inset-right))' }}>
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
            <div className="detail-hero-card">
              <p className="apple-section-label" style={{ marginBottom: 12 }}>Unidad destacada</p>
              <h1 style={{ fontSize: 'clamp(34px, 5vw, 52px)', lineHeight: 1.02, letterSpacing: '-0.05em', marginBottom: 12 }}>
                {listing.brand} {listing.model}
              </h1>
              {listing.version && (
                <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 16 }}>
                  {listing.version}
                </p>
              )}
              <p style={{ color: 'var(--text-tertiary)', lineHeight: 1.65, maxWidth: 720 }}>
                Esta página está pensada para convertir interés en consulta real: muestra lo esencial, ordena mejor la información y deja listos los próximos pasos para reservar visita, pedir financiación o consultar permuta.
              </p>
              <div className="detail-mini-stats">
                <div className="detail-mini-stat">
                  <strong>{listing.year}</strong>
                  <span>año</span>
                </div>
                <div className="detail-mini-stat">
                  <strong>{formatKm(listing.km)}</strong>
                  <span>kilometraje</span>
                </div>
                <div className="detail-mini-stat">
                  <strong>{listing.city || listing.province}</strong>
                  <span>ubicación</span>
                </div>
              </div>
            </div>

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
                  marginBottom: 18,
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
                      width: 88,
                      height: 62,
                      position: 'relative',
                      borderRadius: 14,
                      overflow: 'hidden',
                      padding: 0,
                      background: 'rgba(255,255,255,0.04)',
                      border: safeActiveImg === i ? '2px solid rgba(255,255,255,0.85)' : '2px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease, transform 0.2s ease',
                      outline: 'none',
                    }}
                  >
                    <Image src={img} alt="" fill className="object-cover" loading="lazy" sizes="88px" />
                  </button>
                ))}
              </div>
            )}

            <div className="section-shell" style={{ marginTop: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
                <span className="apple-section-label">Por qué empuja consulta</span>
                <div className="apple-divider-fade" />
              </div>
              <div className="detail-selling-points">
                {sellingPoints.map(point => (
                  <div key={point} className="detail-bullet">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="detail-sidebar">
            <div className="apple-glass" style={{ overflow: 'hidden' }}>
              <div style={{ padding: 'clamp(24px, 4vw, 32px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="apple-section-label" style={{ marginBottom: 10 }}>Precio y acción</p>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 'clamp(34px, 6vw, 48px)',
                    color: 'var(--text)',
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    marginBottom: 18,
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
                <p className="apple-section-label" style={{ marginBottom: 14 }}>Tomá acción</p>
                <div className="detail-cta-stack">
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ width: '100%', padding: '16px 24px', fontSize: 15 }}>
                    Consultar por WhatsApp
                  </a>
                  <a href={financeLink} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ width: '100%', padding: '14px 24px', fontSize: 14 }}>
                    Quiero financiación
                  </a>
                  <a href={tradeLink} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ width: '100%', padding: '14px 24px', fontSize: 14 }}>
                    Tengo una permuta
                  </a>
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
                      lineHeight: 1.7,
                      letterSpacing: '-0.01em',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {listing.description}
                  </p>
                </div>
              )}

              <div style={{ padding: 'clamp(22px, 3vw, 28px)' }}>
                <p className="apple-section-label" style={{ marginBottom: 12 }}>Compra con criterio</p>
                <div className="detail-trust-list">
                  {trustPoints.map(point => (
                    <div key={point} className="detail-bullet">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 3 4 7v6c0 5 3.5 7.74 8 9 4.5-1.26 8-4 8-9V7l-8-4Z" />
                      </svg>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky-mobile-cta">
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ justifyContent: 'center' }}>
          Consultar esta unidad
        </a>
      </div>

      <FloatingWhatsApp href={waLink} label="Consultar esta unidad" sublabel="Disponible ahora" />
    </main>
  )
}
