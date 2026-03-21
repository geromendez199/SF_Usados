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
    <div className="car-card" style={{ animationDelay: `${index * 50}ms` }}>
      <Link href={`/listing/${listing.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        {/* Image */}
        <div style={{ position: 'relative', paddingBottom: '62%', background: '#111', overflow: 'hidden' }}>
          {img ? (
            <Image src={img} alt={listing.title} fill className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="1.5">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
                <rect x="9" y="11" width="14" height="10" rx="2"/>
                <circle cx="12" cy="16" r="1"/><circle cx="20" cy="16" r="1"/>
              </svg>
            </div>
          )}

          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />

          {/* Featured badge */}
          {listing.is_featured && (
            <div style={{ position: 'absolute', top: 10, left: 10 }}>
              <span className="badge-featured">★ Destacado</span>
            </div>
          )}

          {/* Year */}
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6,
            padding: '3px 9px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: '#fff',
          }}>{listing.year}</div>

          {/* Price */}
          <div style={{
            position: 'absolute', bottom: 10, left: 12,
            fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic',
            fontSize: 24, color: '#fff', letterSpacing: '-0.02em',
            textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          }}>{formatPrice(listing.price, listing.currency)}</div>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px 10px' }}>
          {/* Brand + Model + Version */}
          <p style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontStyle: 'italic',
            fontSize: 17, color: '#f0f0f0', letterSpacing: '-0.01em',
            marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {listing.brand} {listing.model}
          </p>
          {listing.version && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#555', marginBottom: 10 }}>
              {listing.version}
            </p>
          )}

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10, marginTop: listing.version ? 0 : 10 }}>
            <span className="stat-tag">{formatKm(listing.km)}</span>
            {listing.fuel && <span className="stat-tag">{listing.fuel}</span>}
            {listing.engine && <span className="stat-tag">⚙ {listing.engine}</span>}
            {listing.transmission && <span className="stat-tag">{listing.transmission}</span>}
            {listing.color && <span className="stat-tag">◉ {listing.color}</span>}
          </div>

          {/* Location + time */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#555', display: 'flex', alignItems: 'center', gap: 3 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {listing.city || listing.province}
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#3a3a3a' }}>{timeAgo(listing.created_at)}</span>
          </div>
        </div>
      </Link>

      {/* WhatsApp */}
      <div style={{ padding: '0 16px 16px' }}>
        <a href={waLink} target="_blank" rel="noopener noreferrer"
          className="btn-whatsapp" style={{ width: '100%', fontSize: 13, padding: '11px 16px' }}
          onClick={e => e.stopPropagation()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
          Consultar
        </a>
      </div>
    </div>
  )
}
