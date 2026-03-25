'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { Listing } from '@/types'
import { formatKm, formatPrice } from '@/lib/utils'

const FAVORITES_KEY = 'sf_usados_favorites'
const COMPARE_KEY = 'sf_usados_compare'

function readIds(key: string) {
  if (typeof window === 'undefined') return [] as string[]
  try {
    const raw = window.localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : []
  } catch {
    return []
  }
}

function writeIds(key: string, ids: string[]) {
  window.localStorage.setItem(key, JSON.stringify(ids))
  window.dispatchEvent(new CustomEvent('sf-usados-storage'))
}

export default function CompareTray({ listings }: { listings: Listing[] }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const sync = () => {
      setFavoriteIds(readIds(FAVORITES_KEY))
      setCompareIds(readIds(COMPARE_KEY))
    }

    sync()
    window.addEventListener('sf-usados-storage', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('sf-usados-storage', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const favorites = useMemo(
    () => favoriteIds.map(id => listings.find(listing => listing.id === id)).filter(Boolean) as Listing[],
    [favoriteIds, listings]
  )
  const compare = useMemo(
    () => compareIds.map(id => listings.find(listing => listing.id === id)).filter(Boolean) as Listing[],
    [compareIds, listings]
  )

  const clearCompare = () => writeIds(COMPARE_KEY, [])
  const removeCompare = (id: string) => writeIds(COMPARE_KEY, compareIds.filter(item => item !== id))
  const removeFavorite = (id: string) => writeIds(FAVORITES_KEY, favoriteIds.filter(item => item !== id))

  if (favorites.length === 0 && compare.length === 0) return null

  return (
    <>
      <div className="compare-tray">
        <div className="compare-tray-meta">
          <span className="compare-pill">{favorites.length} favoritos</span>
          <span className="compare-pill">{compare.length} en comparación</span>
        </div>
        <div className="compare-tray-actions">
          {compare.length > 0 && (
            <button type="button" className="btn-ghost" style={{ padding: '10px 16px' }} onClick={() => setOpen(true)}>
              Comparar ahora
            </button>
          )}
          {compare.length > 0 && (
            <button type="button" className="btn-ghost" style={{ padding: '10px 16px' }} onClick={clearCompare}>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="compare-modal-backdrop" role="dialog" aria-modal="true">
          <div className="compare-modal">
            <div className="compare-modal-header">
              <div>
                <p className="apple-section-label" style={{ marginBottom: 8 }}>Comparador</p>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', lineHeight: 1.08, letterSpacing: '-0.04em' }}>
                  Elegí mejor comparando lado a lado
                </h2>
              </div>
              <button type="button" className="compare-close-btn" onClick={() => setOpen(false)} aria-label="Cerrar comparador">
                ×
              </button>
            </div>

            {compare.length > 0 ? (
              <div className="compare-grid">
                {compare.map(listing => (
                  <div key={listing.id} className="compare-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 18 }}>
                      <div>
                        <strong>{listing.brand} {listing.model}</strong>
                        {listing.version && <span>{listing.version}</span>}
                      </div>
                      <button type="button" className="compare-close-btn" onClick={() => removeCompare(listing.id)} aria-label="Quitar">
                        ×
                      </button>
                    </div>
                    <div className="compare-stats">
                      <div><span>Precio</span><strong>{formatPrice(listing.price, listing.currency)}</strong></div>
                      <div><span>Año</span><strong>{listing.year}</strong></div>
                      <div><span>Kilometraje</span><strong>{formatKm(listing.km)}</strong></div>
                      <div><span>Combustible</span><strong>{listing.fuel || '—'}</strong></div>
                      <div><span>Caja</span><strong>{listing.transmission || '—'}</strong></div>
                      <div><span>Ubicación</span><strong>{listing.city || listing.province}</strong></div>
                    </div>
                    <Link href={`/listing/${listing.id}`} className="btn-primary" style={{ width: '100%', marginTop: 18 }}>
                      Ver detalle
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="premium-card">
                <p>No hay unidades seleccionadas para comparar.</p>
              </div>
            )}

            {favorites.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
                  <span className="apple-section-label">Favoritos guardados</span>
                  <div className="apple-divider-fade" />
                </div>
                <div className="favorites-grid">
                  {favorites.slice(0, 6).map(listing => (
                    <div key={listing.id} className="favorite-card">
                      <div>
                        <strong>{listing.brand} {listing.model}</strong>
                        <span>{formatPrice(listing.price, listing.currency)} · {listing.year}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/listing/${listing.id}`} className="btn-ghost" style={{ padding: '10px 14px' }}>
                          Ver
                        </Link>
                        <button type="button" className="compare-close-btn" onClick={() => removeFavorite(listing.id)} aria-label="Quitar favorito">
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
