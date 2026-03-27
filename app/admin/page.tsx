'use client'

import { useState, useEffect, useCallback, useDeferredValue, useMemo, useRef } from 'react'
import type { Listing } from '@/types'
import { CAR_BRANDS, FUEL_TYPES, TRANSMISSION_TYPES, ARGENTINA_PROVINCES, YEAR_OPTIONS } from '@/types'
import BrandMark from '@/components/BrandMark'
import AdminListingsVirtualList from '@/components/AdminListingsVirtualList'
import { MAX_IMAGE_FILE_BYTES } from '@/lib/admin/uploadRules'

const WA_NUMBER = '5493492273442'
const MAX_IMAGE_SIZE_MB = 3
const MAX_IMAGES = 8
const OPTIMIZED_IMAGE_MAX_DIMENSION = 1920
const OPTIMIZED_IMAGE_QUALITY_STEPS = [0.86, 0.8, 0.74, 0.68]
const OPTIMIZED_IMAGE_DIMENSION_STEPS = [1920, 1600, 1280]
const SUPPORTED_INPUT_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
])
const HEIC_EXTENSIONS = ['.heic', '.heif']

const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-body)',
  fontSize: 11, color: '#555', marginBottom: 6,
  textTransform: 'uppercase', letterSpacing: '0.06em',
}
const inputStyle = { fontSize: 13, color: '#f5f5f5' }

function PublishForm({ onSuccess }: { onSuccess: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [optimizingMessage, setOptimizingMessage] = useState('')
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

  const isHeicFile = (file: File) => {
    if (file.type === 'image/heic' || file.type === 'image/heif') return true
    return HEIC_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))
  }

  const loadImageElement = (blob: Blob) => new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('No se pudo leer la imagen seleccionada.'))
    }
    image.src = objectUrl
  })

  const blobToFile = (blob: Blob, originalName: string) => {
    const safeName = originalName.replace(/\.[^.]+$/, '') || 'foto'
    return new File([blob], `${safeName}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    })
  }

  const optimizeImage = async (file: File): Promise<File> => {
    if (!SUPPORTED_INPUT_MIME_TYPES.has(file.type) && !isHeicFile(file)) {
      throw new Error(`"${file.name}" no tiene un formato compatible. Usá JPG, PNG, WEBP o HEIC.`)
    }

    if (isHeicFile(file)) {
      throw new Error(`"${file.name}" está en HEIC/HEIF y no se pudo procesar en este navegador. Convertí la foto a JPG o PNG e intentá de nuevo.`)
    }

    const sourceBlob = file
    const image = await loadImageElement(sourceBlob)

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Tu navegador no permite optimizar imágenes.')

    for (const maxDimension of OPTIMIZED_IMAGE_DIMENSION_STEPS) {
      const sourceMaxDimension = Math.max(image.width, image.height)
      const ratio = sourceMaxDimension > maxDimension ? maxDimension / sourceMaxDimension : 1
      const targetWidth = Math.max(1, Math.round(image.width * ratio))
      const targetHeight = Math.max(1, Math.round(image.height * ratio))

      canvas.width = Math.min(targetWidth, OPTIMIZED_IMAGE_MAX_DIMENSION)
      canvas.height = Math.min(targetHeight, OPTIMIZED_IMAGE_MAX_DIMENSION)
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      for (const quality of OPTIMIZED_IMAGE_QUALITY_STEPS) {
        const optimizedBlob = await new Promise<Blob | null>(resolve =>
          canvas.toBlob(resolve, 'image/jpeg', quality),
        )
        if (!optimizedBlob) continue
        if (optimizedBlob.size <= MAX_IMAGE_FILE_BYTES) {
          return blobToFile(optimizedBlob, file.name)
        }
      }
    }

    throw new Error(`"${file.name}" sigue siendo muy pesada después de optimizarla. Probá con otra imagen.`)
  }

  const handleImages = async (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files).slice(0, MAX_IMAGES - images.length)
    if (newFiles.length === 0) return

    setOptimizing(true)
    setError('')

    const optimizedFiles: File[] = []
    const processingErrors: string[] = []

    for (const [index, file] of newFiles.entries()) {
      setOptimizingMessage(`Optimizando ${index + 1} de ${newFiles.length}: ${file.name}`)
      try {
        const optimized = await optimizeImage(file)
        if (optimized.size > MAX_IMAGE_FILE_BYTES) {
          throw new Error(`"${file.name}" excede el límite de ${MAX_IMAGE_SIZE_MB} MB después de optimizarse.`)
        }
        optimizedFiles.push(optimized)
      } catch (processError) {
        const message = processError instanceof Error ? processError.message : `No se pudo procesar "${file.name}".`
        processingErrors.push(message)
      }
    }

    if (optimizedFiles.length > 0) {
      setImages(p => [...p, ...optimizedFiles])
      setPreviews(p => [...p, ...optimizedFiles.map(f => URL.createObjectURL(f))])
    }

    if (processingErrors.length > 0) {
      setError(processingErrors.join(' '))
    }

    setOptimizing(false)
    setOptimizingMessage('')
  }

  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previews])

  const uploadImages = async (): Promise<string[]> => {
    for (const file of images) {
      if (file.size > MAX_IMAGE_FILE_BYTES) {
        throw new Error(`Cada imagen debe pesar menos de ${MAX_IMAGE_SIZE_MB} MB. "${file.name}" excede el límite.`)
      }
    }

    const urls: string[] = []
    for (const file of images) {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const json = await res.json()
      if (!res.ok || !json?.data?.publicUrl) {
        throw new Error(json?.error || 'No se pudo subir una imagen')
      }
      urls.push(json.data.publicUrl)
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
      const res = await fetch('/api/admin/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: form.brand,
          model: form.model,
          version: form.version,
          year: parseInt(form.year),
          km: parseInt(form.km),
          price: parseFloat(form.price),
          currency: form.currency,
          color: form.color,
          fuel: form.fuel,
          engine: form.engine,
          transmission: form.transmission,
          description: form.description,
          phone: form.phone,
          province: form.province,
          city: form.city,
          images: imageUrls,
          is_featured: form.is_featured,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Error al publicar')
      setForm(p => ({ ...p, brand: '', model: '', version: '', km: '', price: '', color: '', engine: '', description: '', is_featured: false }))
      previews.forEach(url => URL.revokeObjectURL(url))
      setImages([]); setPreviews([])
      onSuccess()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al publicar')
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
              <button onClick={() => {
                URL.revokeObjectURL(previews[i])
                setImages(a => a.filter((_, j) => j !== i))
                setPreviews(a => a.filter((_, j) => j !== i))
              }}
                style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, background: '#cc0000', color: '#fff', border: 'none', borderRadius: '50%', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ×
              </button>
            </div>
          ))}
          {previews.length < MAX_IMAGES && (
            <button onClick={() => fileInputRef.current?.click()} disabled={optimizing || loading}
              style={{
                width: 84, height: 62, borderRadius: 8, border: '1.5px dashed #2a2a2a', background: 'none',
                color: '#444', cursor: optimizing || loading ? 'not-allowed' : 'pointer', fontSize: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s, color 0.2s',
                opacity: optimizing || loading ? 0.5 : 1,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#666'; e.currentTarget.style.color = '#888' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#444' }}>
              +
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
          multiple
          className="hidden"
          onChange={async e => {
            await handleImages(e.target.files)
            e.currentTarget.value = ''
          }}
        />
        <p style={{ marginTop: 8, fontFamily: 'var(--font-body)', fontSize: 12, color: '#555' }}>
          Podés elegir fotos pesadas (incluyendo HEIC): se optimizan automáticamente antes de subirlas.
        </p>
        {optimizing && (
          <p style={{ marginTop: 6, fontFamily: 'var(--font-body)', fontSize: 12, color: '#9A9A9A' }}>
            {optimizingMessage || 'Optimizando imágenes...'}
          </p>
        )}
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

      <button onClick={handleSubmit} disabled={loading || optimizing} className="btn-primary"
        style={{ width: '100%', padding: '16px', fontSize: 15, opacity: loading || optimizing ? 0.6 : 1, cursor: loading || optimizing ? 'not-allowed' : 'pointer' }}>
        {optimizing ? 'Optimizando imágenes...' : loading ? 'Publicando...' : 'Publicar auto'}
      </button>
    </div>
  )
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [tab, setTab] = useState<'listings' | 'publish'>('listings')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'featured'>('all')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ msg: string; kind: 'ok' | 'err' } | null>(null)
  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/session', { cache: 'no-store' })
        const json = await res.json()
        setAuthed(Boolean(json?.ok))
      } catch {
        setAuthed(false)
      } finally {
        setCheckingSession(false)
      }
    }
    checkSession()
  }, [])

  const showToast = useCallback((msg: string, kind: 'ok' | 'err' = 'ok') => {
    setToast({ msg, kind })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const login = async () => {
    setPwError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setPwError('Contraseña incorrecta')
        return
      }
      setAuthed(true)
      setPassword('')
    } catch {
      setPwError('No se pudo iniciar sesión')
    }
  }

  const fetchListings = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)

    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.set('filter', filter)
      const res = await fetch(`/api/admin/listings?${params.toString()}`, { cache: 'no-store' })
      const json = await res.json()

      if (!res.ok) throw new Error(json?.error || 'No se pudieron cargar las publicaciones')

      setListings((json?.data as Listing[]) || [])
    } catch {
      setListings([])
      showToast('No se pudieron cargar las publicaciones', 'err')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [filter, showToast])

  useEffect(() => { if (authed) fetchListings() }, [authed, fetchListings])

  const toggleActive = async (l: Listing) => {
    const next = !l.is_active
    setListings(prev => prev.map(x => (x.id === l.id ? { ...x, is_active: next } : x)))

    const res = await fetch(`/api/admin/listings/${l.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: next }),
    })

    if (!res.ok) {
      setListings(prev => prev.map(x => (x.id === l.id ? { ...x, is_active: l.is_active } : x)))
      showToast('No se pudo actualizar el estado', 'err')
    }
  }

  const toggleFeatured = async (l: Listing) => {
    const next = !l.is_featured
    setListings(prev => prev.map(x => (x.id === l.id ? { ...x, is_featured: next } : x)))

    const res = await fetch(`/api/admin/listings/${l.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_featured: next }),
    })

    if (!res.ok) {
      setListings(prev => prev.map(x => (x.id === l.id ? { ...x, is_featured: l.is_featured } : x)))
      showToast('No se pudo actualizar destacado', 'err')
    }
  }

  const deleteListing = async (id: string) => {
    if (!confirm('¿Eliminar este auto?')) return
    setListings(prev => prev.filter(x => x.id !== id))

    const res = await fetch(`/api/admin/listings/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      showToast('No se pudo eliminar', 'err')
      void fetchListings(true)
    }
  }

  const filtered = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase()
    if (!q) return listings
    return listings.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.brand?.toLowerCase().includes(q) ||
      l.model?.toLowerCase().includes(q)
    )
  }, [listings, deferredSearch])

  const stats = useMemo(() => ({
    total: listings.length,
    active: listings.filter(l => l.is_active).length,
    featured: listings.filter(l => l.is_featured).length,
    views: listings.reduce((a, l) => a + (l.views || 0), 0),
  }), [listings])

  const insights = useMemo(() => {
    const activeListings = listings.filter(l => l.is_active)
    const topViewed = [...listings]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
    const latestListings = [...listings]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
    const brandMap = new Map<string, number>()
    for (const listing of activeListings) {
      brandMap.set(listing.brand, (brandMap.get(listing.brand) || 0) + 1)
    }
    const topBrands = [...brandMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
    const averagePrice = activeListings.length > 0
      ? Math.round(activeListings.reduce((sum, listing) => sum + listing.price, 0) / activeListings.length)
      : 0
    const averageKm = activeListings.length > 0
      ? Math.round(activeListings.reduce((sum, listing) => sum + listing.km, 0) / activeListings.length)
      : 0
    const inactiveCount = listings.filter(l => !l.is_active).length

    return {
      topViewed,
      latestListings,
      topBrands,
      averagePrice,
      averageKm,
      inactiveCount,
    }
  }, [listings])

  if (checkingSession) {
    return (
      <main style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
        Verificando sesión...
      </main>
    )
  }

  // ── LOGIN ──
  if (!authed) {
    return (
      <main style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 20, padding: '44px 36px', width: '100%', maxWidth: 380, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <BrandMark size="lg" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic', fontSize: 28, color: '#8A8A8A', letterSpacing: '-0.03em', marginBottom: 4 }}>
            _Usados · Admin
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
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 100,
          background: toast.kind === 'err' ? '#2a1010' : '#1a1a1a',
          border: `1px solid ${toast.kind === 'err' ? '#4a2020' : '#2a2a2a'}`,
          borderRadius: 10, padding: '12px 20px', fontFamily: 'var(--font-body)', fontSize: 14,
          color: toast.kind === 'err' ? '#ff8a8a' : '#fff',
          boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
        }}>
          {toast.kind === 'err' ? '⚠ ' : '✓ '}{toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: '#0d0d0d', borderBottom: '1px solid #161616', padding: '0 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BrandMark size="md" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic', fontSize: 18, color: '#8A8A8A', letterSpacing: '-0.02em' }}>
              Admin
            </span>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <a href="/" target="_blank" style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#444', textDecoration: 'none' }}>Ver sitio ↗</a>
            <button
              onClick={async () => {
                await fetch('/api/admin/logout', { method: 'POST' })
                setAuthed(false)
              }}
              className="btn-ghost"
              style={{ fontSize: 12, padding: '7px 14px' }}
            >
              Salir
            </button>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 28 }}>
          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, padding: '20px 18px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              Salud del inventario
            </p>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ color: '#555', fontSize: 13 }}>Precio promedio activo</span>
                <strong style={{ color: '#fff', fontSize: 15 }}>US$ {insights.averagePrice.toLocaleString('es-AR')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ color: '#555', fontSize: 13 }}>Kilometraje promedio</span>
                <strong style={{ color: '#fff', fontSize: 15 }}>{insights.averageKm.toLocaleString('es-AR')} km</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ color: '#555', fontSize: 13 }}>Pausados</span>
                <strong style={{ color: '#fff', fontSize: 15 }}>{insights.inactiveCount}</strong>
              </div>
            </div>
          </div>

          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, padding: '20px 18px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              Marcas con más stock
            </p>
            <div style={{ display: 'grid', gap: 10 }}>
              {insights.topBrands.length > 0 ? insights.topBrands.map(([brand, count]) => (
                <div key={brand} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ color: '#ddd', fontSize: 14 }}>{brand}</span>
                  <strong style={{ color: '#fff', fontSize: 14 }}>{count}</strong>
                </div>
              )) : (
                <span style={{ color: '#555', fontSize: 13 }}>Sin datos todavía</span>
              )}
            </div>
          </div>

          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, padding: '20px 18px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              Más vistos
            </p>
            <div style={{ display: 'grid', gap: 10 }}>
              {insights.topViewed.length > 0 ? insights.topViewed.map(listing => (
                <div key={listing.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ color: '#ddd', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {listing.brand} {listing.model}
                  </span>
                  <strong style={{ color: '#fff', fontSize: 14 }}>{listing.views || 0}</strong>
                </div>
              )) : (
                <span style={{ color: '#555', fontSize: 13 }}>Sin visitas todavía</span>
              )}
            </div>
          </div>

          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, padding: '20px 18px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              Últimas publicaciones
            </p>
            <div style={{ display: 'grid', gap: 10 }}>
              {insights.latestListings.length > 0 ? insights.latestListings.map(listing => (
                <div key={listing.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ color: '#ddd', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {listing.brand} {listing.model}
                  </span>
                  <strong style={{ color: '#555', fontSize: 12 }}>
                    {new Date(listing.created_at).toLocaleDateString('es-AR')}
                  </strong>
                </div>
              )) : (
                <span style={{ color: '#555', fontSize: 13 }}>Sin publicaciones todavía</span>
              )}
            </div>
          </div>
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
                <div style={{ padding: 14 }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.5fr 0.65fr 0.85fr 0.5fr 0.45fr 0.95fr 1.15fr',
                      gap: 8,
                      padding: '10px 14px',
                      borderBottom: '1px solid #1a1a1a',
                    }}
                  >
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="skeleton" style={{ height: 12, borderRadius: 4 }} />
                    ))}
                  </div>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.5fr 0.65fr 0.85fr 0.5fr 0.45fr 0.95fr 1.15fr',
                        gap: 8,
                        alignItems: 'center',
                        padding: '14px',
                        borderBottom: '1px solid #161616',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="skeleton" style={{ width: 56, height: 40, borderRadius: 6, flexShrink: 0 }} />
                        <div className="skeleton" style={{ height: 16, flex: 1, borderRadius: 4 }} />
                      </div>
                      <div className="skeleton" style={{ height: 14, borderRadius: 4 }} />
                      <div className="skeleton" style={{ height: 16, borderRadius: 4 }} />
                      <div className="skeleton" style={{ height: 14, borderRadius: 4 }} />
                      <div className="skeleton" style={{ height: 14, borderRadius: 4 }} />
                      <div className="skeleton" style={{ height: 28, width: 72, borderRadius: 6 }} />
                      <div className="skeleton" style={{ height: 14, borderRadius: 4 }} />
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#333', fontFamily: 'var(--font-body)' }}>Sin resultados</div>
              ) : (
                <AdminListingsVirtualList
                  rows={filtered}
                  onToggleActive={toggleActive}
                  onToggleFeatured={toggleFeatured}
                  onDelete={deleteListing}
                  onOpen={id => window.open(`/listing/${id}`, '_blank')}
                />
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
