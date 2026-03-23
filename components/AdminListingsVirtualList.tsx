'use client'

import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Listing } from '@/types'
import { formatPrice, formatKm } from '@/lib/utils'

const ROW_HEIGHT = 88

const GRID_COLS =
  'minmax(200px, 1.5fr) minmax(72px, 0.65fr) minmax(92px, 0.85fr) minmax(64px, 0.5fr) minmax(48px, 0.45fr) minmax(104px, 0.95fr) minmax(176px, 1.15fr)'

type Props = {
  rows: Listing[]
  onToggleActive: (l: Listing) => void
  onToggleFeatured: (l: Listing) => void
  onDelete: (id: string) => void
  onOpen: (id: string) => void
}

export default function AdminListingsVirtualList({
  rows,
  onToggleActive,
  onToggleFeatured,
  onDelete,
  onOpen,
}: Props) {
  const parentRef = useRef<HTMLDivElement>(null)
  // TanStack Virtual is intentionally not React Compiler–memoizable; safe here.
  // eslint-disable-next-line react-hooks/incompatible-library -- virtualizer API
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  })

  if (rows.length === 0) return null

  return (
    <div
      ref={parentRef}
      style={{
        maxHeight: 'min(72vh, 680px)',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div style={{ minWidth: 720 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: GRID_COLS,
            gap: 8,
            alignItems: 'center',
            padding: '12px 14px',
            borderBottom: '1px solid #1a1a1a',
            position: 'sticky',
            top: 0,
            background: '#111',
            zIndex: 2,
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#333',
          }}
        >
          {['Auto', 'Versión', 'Precio', 'Km', 'Año', 'Estado', 'Acciones'].map(h => (
            <div key={h}>{h}</div>
          ))}
        </div>

        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map(vi => {
            const l = rows[vi.index]
            return (
              <div
                key={l.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: vi.size,
                  transform: `translateY(${vi.start}px)`,
                  borderBottom: '1px solid #161616',
                  opacity: l.is_active ? 1 : 0.35,
                  display: 'grid',
                  gridTemplateColumns: GRID_COLS,
                  gap: 8,
                  alignItems: 'center',
                  padding: '10px 14px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  background: '#111',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#161616'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#111'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  {l.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={l.images[0]}
                      alt=""
                      width={56}
                      height={40}
                      style={{ borderRadius: 6, objectFit: 'cover', border: '1px solid #222', flexShrink: 0 }}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      style={{
                        width: 56,
                        height: 40,
                        borderRadius: 6,
                        background: '#1a1a1a',
                        border: '1px solid #222',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      🚗
                    </div>
                  )}
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontStyle: 'italic',
                      fontSize: 14,
                      color: '#ddd',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      margin: 0,
                    }}
                  >
                    {l.brand} {l.model}
                  </p>
                </div>
                <div style={{ color: '#555', fontSize: 12 }}>{l.version || '—'}</div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontStyle: 'italic',
                    fontSize: 14,
                    color: '#ccc',
                  }}
                >
                  {formatPrice(l.price, l.currency)}
                </div>
                <div style={{ color: '#555', fontSize: 12 }}>{formatKm(l.km)}</div>
                <div style={{ color: '#555', fontSize: 12 }}>{l.year}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      fontSize: 10,
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 4,
                      width: 'fit-content',
                      background: l.is_active ? 'rgba(34,197,94,0.08)' : '#181818',
                      color: l.is_active ? '#22c55e' : '#444',
                      border: `1px solid ${l.is_active ? 'rgba(34,197,94,0.15)' : '#222'}`,
                    }}
                  >
                    {l.is_active ? '✓ Activo' : '⏸ Pausado'}
                  </span>
                  {l.is_featured && (
                    <span
                      style={{
                        display: 'inline-flex',
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: 4,
                        width: 'fit-content',
                        background: 'rgba(255,255,255,0.04)',
                        color: '#666',
                        border: '1px solid #222',
                      }}
                    >
                      ★ Destacado
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Ver', color: '#555', action: () => onOpen(l.id) },
                    { label: l.is_active ? 'Pausar' : 'Activar', color: '#555', action: () => onToggleActive(l) },
                    { label: l.is_featured ? 'Quitar ★' : 'Destacar', color: '#666', action: () => onToggleFeatured(l) },
                    { label: 'Eliminar', color: '#3a3a3a', hoverColor: '#ff4444', action: () => onDelete(l.id) },
                  ].map(btn => (
                    <button
                      key={`${l.id}-${btn.label}`}
                      type="button"
                      onClick={btn.action}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: btn.color,
                        fontSize: 12,
                        fontWeight: 600,
                        padding: 0,
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = btn.hoverColor || '#fff'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = btn.color
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
