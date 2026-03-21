'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Listing } from '@/types'
import { formatPrice, formatKm, timeAgo } from '@/lib/utils'
import { CAR_BRANDS, FUEL_TYPES, TRANSMISSION_TYPES, ARGENTINA_PROVINCES, YEAR_OPTIONS } from '@/types'
import SFLogo from '@/components/SFLogo'

const ADMIN_KEY = 'sf_admin_authed'
const WA_NUMBER = '5493492273442'

const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-body)',
  fontSize: 11, color: '#555', marginBottom: 6,
  textTransform: 'uppercase', letterSpacing: '0.06em',
}
const inputStyle = { fontSize: 13, color: '#f5f5f5' }

function PublishForm({ onSuccess }: { onSuccess: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [form, setForm] = useState({
    brand: '', model: '', version: '',
    year: String(new Date().getFullYear()),
    km: '', price: '', currency: 'USD' as 'USD' | 'ARS',
    color: '', fuel: 'Nafta', engine: '',
    transmission: 'Manual', description: '',
    phone: WA_NUMBER, province: 'Santa Fe', city: 'Rafaela',
    is_featured: false,
  })
  const set = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }))

  const handleImages = (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files).slice(0, 8 - images.length)
    setImages(p => [...p, ...newFiles])
    setPreviews(p => [...p, ...newFiles.map(f => URL.createObjectURL(f))])
  }

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = []
    for (const file of images) {
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage.from('listings').upload(filename, file, { contentType: file.type })
      if (error) throw error
      const { data: urlData } = supabase.storage.from('listings').getPublicUrl(data.path)
      urls.push(urlData.publicUrl)
    }
    return urls
  }

  const handleSubmit = async () => {
    if (!form.brand || !form.model || !form.year || !form.km || !form.price) {
      setError('Completá marca, modelo, año, km y precio'); return
    }
    setLoading(true); setError('')
    try {
      const imageUrls = images.length > 0 ? await uploadImages() : []
      const title = [form.brand, form.model, form.version, form.year].filter(Boolean).join(' ')
      const { error: e } = await supabase.from('listings').insert({
        title, brand: form.brand, model: form.model,
        version: form.version || null,
        year: parseInt(form.year), km: parseInt(form.km),
        price: parseFloat(form.price), currency: form.currency,
        color: form.color || null, fuel: form.fuel || null,
        engine: form.engine || null,
        transmission: form.transmission || null,
        description: form.description.trim(),
        phone: form.phone.trim(), province: form.province,
        city: form.city.trim() || null,
        images: imageUrls, is_featured: form.is_featured,
        is_active: true, views: 0,
      })
      if (e) throw e
      setForm(p => ({ ...p, brand: '', model: '', version: '', km: '', price: '', color: '', engine: '', description: '', is_featured: false }))
      setImages([]); setPreviews([])
      onSuccess()
    } catch (e: any) {
      setError(e.message || 'Error al publicar')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 16, padding: '28px 24px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic', fontSize: 24, color: '#fff', marginBottom: 24, letterSpacing: '-0.02em' }}>
        Publicar auto
      </h2>

      {/* Row 1: Brand / Model / Version */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Marca *</label>
          <select value={form.brand} onChange={e => set('brand', e.target.value)} className="input-field" style={inputStyle}>
            <option value="">Seleccioná</option>
            {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Modelo *</label>
          <input type="text" placeholder="ej: Focus, Gol, Corsa..." value={form.model}
            onChange={e => set('model', e.target.value)} className="input-field" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Versión</label>
          <input type="text" placeholder="ej: Titanium, Trendline, SE..." value={form.version}
            onChange={e => set('version', e.target.value)} className="input-field" style={inputStyle} />
        </div>
      </div>

      {/* Row 2: Year / Km / Price / Currency */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Año *</label>
          <select value={form.year} onChange={e => set('year', e.target.value)} className="input-field" style={inputStyle}>
            {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Odómetro (km) *</label>
          <input type="number" placeholder="ej: 85000" value={form.km}
            onChange={e => set('km', e.target.value)} className="input-field" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Precio *</label>
          <input type="number" placeholder="ej: 12000" value={form.price}
            onChange={e => set('price', e.target.value)} className="input-field" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Moneda</label>
          <select value={form.currency} onChange={e => set('currency', e.target.value)} className="input-field" style={inputStyle}>
            <option value="USD">US$</option>
            <option value="ARS">ARS $</option>
          </select>
        </div>
      </div>

      {/* Row 3: Fuel / Engine / Transmission / Color */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Combustible</label>
          <select value={form.fuel} onChange={e => set('fuel', e.target.value)} className="input-field" style={inputStyle}>
            {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Motor</label>
          <input type="text" placeholder="ej: 1.6, 2.0 TDI, V8..." value={form.engine}
            onChange={e => set('engine', e.target.value)} className="input-field" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Caja</label>
          <select value={form.transmission} onChange={e => set('transmission', e.target.value)} className="input-field" style={inputStyle}>
            {TRANSMISSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Color</label>
          <input type="text" placeholder="ej: Blanco, Negro..." value={form.color}
            onChange={e => set('color', e.target.value)} className="input-field" style={inputStyle} />
        </div>
      </div>

      {/* Row 4: Province / City */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Provincia</label>
          <select value={form.province} onChange={e => set('province', e.target.value)} className="input-field" style={inputStyle}>
            {ARGENTINA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Ciudad</label>
          <input type="text" value={form.city} onChange={e => set('city', e.target.value)} className="input-field" style={inputStyle} />
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Info / Descripción</label>
        <textarea rows={4} placeholder="Estado general, service al día, único dueño, extras, observaciones..."
          value={form.description} onChange={e => set('description', e.target.value)}
          className="input-field" style={{ ...inputStyle, resize: 'none' }} maxLength={2000} />
      </div>

      {/* Images */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Fotos (hasta 8)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {previews.map((p, i) => (
            <div key={i} style={{ position: 'relative', width: 84, height: 62, borderRadius: 8, overflow: 'hidden', border: '1px solid #2a2a2a' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => { setImages(a => a.filter((_, j) => j !== i)); setPreviews(a => a.filter((_, j) => j !== i)) }}
                style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, background: '#cc0000', color: '#fff', border: 'none', borderRadius: '50%', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ×
              </button>
            </div>
          ))}
          {previews.length < 8 && (
            <button onClick={() => fileInputRef.current?.click()}
              style={{ width: 84, height: 62, borderRadius: 8, border: '1.5px dashed #2a2a2a', background: 'none', color: '#444', cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s, color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#666'; e.currentTarget.style.color = '#888' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#444' }}>
              +
            </button>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleImages(e.target.files)} />
      </div>

      {/* Featured */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '14px 16px', background: '#111', border: '1px solid #222', borderRadius: 10, marginBottom: 20 }}>
        <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} style={{ width: 18, height: 18, accentColor: '#fff' }} />
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontStyle: 'italic', fontSize: 15, color: '#fff' }}>★ Marcar como Destacado</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#444' }}>Aparece primero en el listado</p>
        </div>
      </label>

      {error && (
        <div style={{ background: '#1a0000', border: '1px solid #2a0000', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontFamily: 'var(--font-body)', fontSize: 13, color: '#ff6b6b' }}>
          ⚠ {error}
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading} className="btn-primary"
        style={{ width: '100%', padding: '16px', fontSize: 15, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? 'Publicando...' : 'Publicar auto'}
      </button>
    </div>
  )
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [tab, setTab] = useState<'listings' | 'publish'>('listings')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'featured'>('all')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => { if (sessionStorage.getItem(ADMIN_KEY) === '1') setAuthed(true) }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500) }

  const login = () => {
    if (password === 'sf2024' || password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true); sessionStorage.setItem(ADMIN_KEY, '1')
    } else { setPwError('Contraseña incorrecta') }
  }

  const fetchListings = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('listings').select('*').order('created_at', { ascending: false })
    if (filter === 'active') q = q.eq('is_active', true)
    if (filter === 'inactive') q = q.eq('is_active', false)
    if (filter === 'featured') q = q.eq('is_featured', true)
    const { data } = await q.limit(200)
    setListings((data as Listing[]) || [])
    setLoading(false)
  }, [filter])

  useEffect(() => { if (authed) fetchListings() }, [authed, fetchListings])

  const toggleActive = async (l: Listing) => { await supabase.from('listings').update({ is_active: !l.is_active }).eq('id', l.id); fetchListings() }
  const toggleFeatured = async (l: Listing) => { await supabase.from('listings').update({ is_featured: !l.is_featured }).eq('id', l.id); fetchListings() }
  const deleteListing = async (id: string) => {
    if (!confirm('¿Eliminar este auto?')) return
    await supabase.from('listings').delete().eq('id', id); fetchListings()
  }

  const filtered = listings.filter(l =>
    !search || l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.brand?.toLowerCase().includes(search.toLowerCase()) ||
    l.model?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: listings.length,
    active: listings.filter(l => l.is_active).length,
    featured: listings.filter(l => l.is_featured).length,
    views: listings.reduce((a, l) => a + (l.views || 0), 0),
  }

  // ── LOGIN ──
  if (!authed) {
    return (
      <main style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 20, padding: '44px 36px', width: '100%', maxWidth: 380, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <SFLogo size={40} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic', fontSize: 28, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>
            SF_Usados
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#444', marginBottom: 28 }}>Panel de administración</p>
          <input type="password" placeholder="Contraseña" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="input-field" style={{ marginBottom: 10, fontSize: 14, textAlign: 'center' }} />
          {pwError && <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#ff5555', marginBottom: 10 }}>⚠ {pwError}</p>}
          <button onClick={login} className="btn-primary" style={{ width: '100%', padding: '14px' }}>Entrar</button>
        </div>
      </main>
    )
  }

  // ── PANEL ──
  return (
    <main style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 100, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '12px 20px', fontFamily: 'var(--font-body)', fontSize: 14, color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.8)' }}>
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ background: '#0d0d0d', borderBottom: '1px solid #161616', padding: '0 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <SFLogo size={24} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic', fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>
              Admin
            </span>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <a href="/" target="_blank" style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#444', textDecoration: 'none' }}>Ver sitio ↗</a>
            <button onClick={() => { sessionStorage.removeItem(ADMIN_KEY); setAuthed(false) }}
              className="btn-ghost" style={{ fontSize: 12, padding: '7px 14px' }}>Salir</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 80px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 28 }}>
          {[
            { label: 'Total', value: stats.total, icon: '🚗' },
            { label: 'Activos', value: stats.active, icon: '✓' },
            { label: 'Destacados', value: stats.featured, icon: '★' },
            { label: 'Visitas', value: stats.views.toLocaleString('es-AR'), icon: '👁' },
          ].map(s => (
            <div key={s.label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '14px 16px' }}>
              <p style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic', fontSize: 26, color: '#fff', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#444', marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['listings', 'publish'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontStyle: 'italic', fontSize: 14,
              letterSpacing: '0.02em', textTransform: 'uppercase', padding: '10px 20px',
              borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? '#0A0A0A' : '#555',
              border: tab === t ? '1px solid #fff' : '1px solid #1e1e1e',
            }}>
              {t === 'listings' ? '▤ Publicaciones' : '+ Publicar auto'}
            </button>
          ))}
        </div>

        {tab === 'publish' ? (
          <PublishForm onSuccess={() => { showToast('Auto publicado'); setTab('listings'); fetchListings() }} />
        ) : (
          <>
            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <input type="text" placeholder="Buscar..." value={search}
                  onChange={e => setSearch(e.target.value)} className="input-field"
                  style={{ flex: 1, minWidth: 180, fontSize: 13 }} />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(['all', 'active', 'inactive', 'featured'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11,
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                      padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                      background: filter === f ? '#fff' : 'transparent',
                      color: filter === f ? '#0A0A0A' : '#444',
                      border: filter === f ? '1px solid #fff' : '1px solid #1e1e1e',
                      transition: 'all 0.15s',
                    }}>
                      {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : f === 'inactive' ? 'Pausados' : 'Destacados'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, overflow: 'hidden' }}>
              {loading ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#444', fontFamily: 'var(--font-body)' }}>Cargando...</div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#333', fontFamily: 'var(--font-body)' }}>Sin resultados</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                        {['Auto', 'Versión', 'Precio', 'Km', 'Año', 'Estado', 'Acciones'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '12px 14px', color: '#333', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(l => (
                        <tr key={l.id} style={{ borderBottom: '1px solid #161616', opacity: l.is_active ? 1 : 0.35 }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#161616')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              {l.images?.[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={l.images[0]} alt="" style={{ width: 56, height: 40, borderRadius: 6, objectFit: 'cover', border: '1px solid #222' }} />
                              ) : (
                                <div style={{ width: 56, height: 40, borderRadius: 6, background: '#1a1a1a', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🚗</div>
                              )}
                              <div>
                                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontStyle: 'italic', fontSize: 14, color: '#ddd', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {l.brand} {l.model}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', color: '#555', fontSize: 12 }}>{l.version || '—'}</td>
                          <td style={{ padding: '12px 14px', fontFamily: 'var(--font-display)', fontWeight: 800, fontStyle: 'italic', fontSize: 14, color: '#ccc' }}>
                            {formatPrice(l.price, l.currency)}
                          </td>
                          <td style={{ padding: '12px 14px', color: '#555', fontSize: 12 }}>{formatKm(l.km)}</td>
                          <td style={{ padding: '12px 14px', color: '#555', fontSize: 12 }}>{l.year}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <span style={{ display: 'inline-flex', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, width: 'fit-content', background: l.is_active ? 'rgba(34,197,94,0.08)' : '#181818', color: l.is_active ? '#22c55e' : '#444', border: `1px solid ${l.is_active ? 'rgba(34,197,94,0.15)' : '#222'}` }}>
                                {l.is_active ? '✓ Activo' : '⏸ Pausado'}
                              </span>
                              {l.is_featured && (
                                <span style={{ display: 'inline-flex', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, width: 'fit-content', background: 'rgba(255,255,255,0.04)', color: '#666', border: '1px solid #222' }}>
                                  ★ Destacado
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                              {[
                                { label: 'Ver', color: '#555', action: () => window.open(`/listing/${l.id}`, '_blank') },
                                { label: l.is_active ? 'Pausar' : 'Activar', color: '#555', action: () => toggleActive(l) },
                                { label: l.is_featured ? 'Quitar ★' : 'Destacar', color: '#666', action: () => toggleFeatured(l) },
                                { label: 'Eliminar', color: '#3a3a3a', hoverColor: '#ff4444', action: () => deleteListing(l.id) },
                              ].map(btn => (
                                <button key={btn.label} onClick={btn.action}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: btn.color, fontSize: 12, fontWeight: 600, padding: 0, transition: 'color 0.15s' }}
                                  onMouseEnter={e => (e.currentTarget.style.color = btn.hoverColor || '#fff')}
                                  onMouseLeave={e => (e.currentTarget.style.color = btn.color)}>
                                  {btn.label}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#333', textAlign: 'center', marginTop: 12 }}>
              {filtered.length} autos
            </p>
          </>
        )}
      </div>
    </main>
  )
}
