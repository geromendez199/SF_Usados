'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { CAR_BRANDS, FUEL_TYPES, ARGENTINA_PROVINCES, YEAR_OPTIONS } from '@/types'

export default function Filters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    value ? params.set(key, value) : params.delete(key)
    params.delete('page')
    router.push(`/?${params.toString()}`)
  }, [router, searchParams])

  const brand = searchParams.get('brand') || ''
  const province = searchParams.get('province') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const yearFrom = searchParams.get('yearFrom') || ''
  const fuel = searchParams.get('fuel') || ''
  const hasFilters = brand || province || maxPrice || yearFrom || fuel
  const activeFilters = [
    brand ? { label: 'Marca', value: brand } : null,
    yearFrom ? { label: 'Desde', value: yearFrom } : null,
    fuel ? { label: 'Combustible', value: fuel } : null,
    maxPrice ? { label: 'Hasta', value: `US$ ${Number(maxPrice).toLocaleString('es-AR')}` } : null,
    province ? { label: 'Provincia', value: province } : null,
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div className="apple-glass" style={{ padding: '22px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <span className="apple-section-label" style={{ marginBottom: 0 }}>
          Refinar búsqueda
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={() => router.push('/')}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: 'var(--radius-pill)',
              transition: 'background 0.2s ease',
            }}
            className="filters-clear-btn"
          >
            Restablecer
          </button>
        )}
      </div>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-tertiary)', lineHeight: 1.5, marginBottom: 18 }}>
        Encontrá usados listos para ver con filtros rápidos por marca, año, combustible, precio y ubicación.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-tertiary)',
              marginBottom: 8,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Marca
          </label>
          <select value={brand} onChange={e => update('brand', e.target.value)} className="input-field" style={{ fontSize: 14 }}>
            <option value="">Todas</option>
            {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-tertiary)',
              marginBottom: 8,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Año desde
          </label>
          <select value={yearFrom} onChange={e => update('yearFrom', e.target.value)} className="input-field" style={{ fontSize: 14 }}>
            <option value="">Todos</option>
            {YEAR_OPTIONS.slice(0, 30).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-tertiary)',
              marginBottom: 8,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Combustible
          </label>
          <select value={fuel} onChange={e => update('fuel', e.target.value)} className="input-field" style={{ fontSize: 14 }}>
            <option value="">Todos</option>
            {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-tertiary)',
              marginBottom: 8,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Precio máx. (US$)
          </label>
          <input
            type="number"
            placeholder="Ej. 15000"
            value={maxPrice}
            onChange={e => update('maxPrice', e.target.value)}
            className="input-field"
            style={{ fontSize: 14 }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-tertiary)',
              marginBottom: 8,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Provincia
          </label>
          <select value={province} onChange={e => update('province', e.target.value)} className="input-field" style={{ fontSize: 14 }}>
            <option value="">Todas</option>
            {ARGENTINA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="active-filters">
          {activeFilters.map(filter => (
            <span key={`${filter.label}-${filter.value}`} className="active-filter-pill">
              {filter.label}
              <strong>{filter.value}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
