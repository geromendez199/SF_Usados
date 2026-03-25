'use client'

import { useEffect, useState } from 'react'

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

export default function ListingActionButtons({
  listingId,
  compact = false,
}: {
  listingId: string
  compact?: boolean
}) {
  const [favorite, setFavorite] = useState(false)
  const [compare, setCompare] = useState(false)

  useEffect(() => {
    const sync = () => {
      setFavorite(readIds(FAVORITES_KEY).includes(listingId))
      setCompare(readIds(COMPARE_KEY).includes(listingId))
    }

    sync()
    window.addEventListener('sf-usados-storage', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('sf-usados-storage', sync)
      window.removeEventListener('storage', sync)
    }
  }, [listingId])

  const toggleFavorite = () => {
    const current = readIds(FAVORITES_KEY)
    const next = current.includes(listingId)
      ? current.filter(id => id !== listingId)
      : [listingId, ...current].slice(0, 24)
    writeIds(FAVORITES_KEY, next)
  }

  const toggleCompare = () => {
    const current = readIds(COMPARE_KEY)
    const next = current.includes(listingId)
      ? current.filter(id => id !== listingId)
      : [...current, listingId].slice(0, 3)
    writeIds(COMPARE_KEY, next)
  }

  return (
    <div className={`listing-actions ${compact ? 'listing-actions-compact' : ''}`}>
      <button
        type="button"
        className={`listing-action-btn ${favorite ? 'is-active' : ''}`}
        onClick={toggleFavorite}
        aria-pressed={favorite}
        title={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
          <path d="m12 21-1.45-1.32C5.4 15.03 2 11.93 2 8.12 2 5.02 4.42 2.6 7.52 2.6c1.74 0 3.41.81 4.48 2.09A6 6 0 0 1 16.48 2.6C19.58 2.6 22 5.02 22 8.12c0 3.81-3.4 6.91-8.55 11.56Z" />
        </svg>
      </button>
      <button
        type="button"
        className={`listing-action-btn ${compare ? 'is-active' : ''}`}
        onClick={toggleCompare}
        aria-pressed={compare}
        title={compare ? 'Quitar de comparar' : 'Agregar a comparar'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M10 3H5a2 2 0 0 0-2 2v5" />
          <path d="m3 3 7 7" />
          <path d="M14 21h5a2 2 0 0 0 2-2v-5" />
          <path d="m21 21-7-7" />
          <path d="M14 3h5a2 2 0 0 1 2 2v5" />
          <path d="m21 3-7 7" />
          <path d="M10 21H5a2 2 0 0 1-2-2v-5" />
          <path d="m3 21 7-7" />
        </svg>
      </button>
    </div>
  )
}
