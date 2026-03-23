'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Listing } from '@/types'
import { formatPrice, formatKm, buildWhatsApp, timeAgo } from '@/lib/utils'

const WA_NUMBER = '5493492273442'

export default function CarCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  const waLink = buildWhatsApp(WA_NUMBER, listing)
  const img = listing.images?.[0]

  return (
    <div className="car-card" style={{ animationDelay: `${index * 40}ms` }}>
      <Link href={`/listing/${listing.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ position: 'relative', paddingBottom: '62%', background: '#0a0a0a', overflow: 'hidden' }}>
          {img ? (
            <Image
              src={img}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading={index < 3 ? 'eager' : 'lazy'}
              priority={index < 1}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
                <rect x="9" y="11" width="14" height="10" rx="2"/>
                <circle cx="12" cy="16" r="1"/><circle cx="20" cy="16" r="1"/>
              </svg>
            </div>
          )}

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 45%, transparent 100%)',
            }}
          />

          {listing.is_featured && (
            <div style={{ position: 'absolute', top: 14, left: 14 }}>
              <span className="badge-featured">Destacado</span>
            </div>
          )}

          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 'var(--radius-pill)',
              padding: '5px 12px',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 13,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            {listing.year}
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 14,
              left: 16,
              right: 16,
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 'clamp(22px, 4vw, 26px)',
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}
          >
            {formatPrice(listing.price, listing.currency)}
          </div>
        </div>

        <div style={{ padding: '18px 20px 12px' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 18,
              color: 'var(--text)',
              letterSpacing: '-0.025em',
              marginBottom: 4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {listing.brand} {listing.model}
          </p>
          {listing.version && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--text-tertiary)', marginBottom: 12 }}>
              {listing.version}
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12, marginTop: listing.version ? 0 : 8 }}>
            <span className="stat-tag">{formatKm(listing.km)}</span>
            {listing.fuel && <span className="stat-tag">{listing.fuel}</span>}
            {listing.engine && <span className="stat-tag">{listing.engine}</span>}
            {listing.transmission && <span className="stat-tag">{listing.transmission}</span>}
            {listing.color && <span className="stat-tag">{listing.color}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {listing.city || listing.province}
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', opacity: 0.8 }}>
              {timeAgo(listing.created_at)}
            </span>
          </div>
        </div>
      </Link>

      <div style={{ padding: '0 20px 20px' }}>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
          style={{ width: '100%', fontSize: 14, padding: '12px 18px' }}
          onClick={e => e.stopPropagation()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
          Consultar
        </a>
      </div>
    </div>
  )
}
