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

  return (
    <div style={{
      background: '#141414',
      border: '1px solid #222',
      borderRadius: 14,
      padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Filtros
        </span>
        {hasFilters && (
          <button onClick={() => router.push('/')}
            style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Limpiar
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Marca</label>
          <select value={brand} onChange={e => update('brand', e.target.value)} className="input-field" style={{ fontSize: 13 }}>
            <option value="">Todas</option>
            {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Año desde</label>
          <select value={yearFrom} onChange={e => update('yearFrom', e.target.value)} className="input-field" style={{ fontSize: 13 }}>
            <option value="">Todos</option>
            {YEAR_OPTIONS.slice(0, 30).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Combustible</label>
          <select value={fuel} onChange={e => update('fuel', e.target.value)} className="input-field" style={{ fontSize: 13 }}>
            <option value="">Todos</option>
            {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Precio máx (US$)</label>
          <input type="number" placeholder="ej: 15000" value={maxPrice}
            onChange={e => update('maxPrice', e.target.value)} className="input-field" style={{ fontSize: 13 }} />
        </div>

        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Provincia</label>
          <select value={province} onChange={e => update('province', e.target.value)} className="input-field" style={{ fontSize: 13 }}>
            <option value="">Todas</option>
            {ARGENTINA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}
