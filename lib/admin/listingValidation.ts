import type { Listing } from '@/types'

type ListingPayload = Partial<Omit<Listing, 'id' | 'created_at'>>

const MAX_IMAGES = 8
const MAX_STRING = 160
const MAX_DESCRIPTION = 2000

const normalizeString = (value: unknown, max = MAX_STRING) => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim().replace(/\s+/g, ' ')
  if (!trimmed) return null
  return trimmed.slice(0, max)
}

const parseInteger = (value: unknown, field: string, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const parsed = typeof value === 'number' ? value : Number(value)
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${field} inválido.`)
  }
  return parsed
}

const parseFloatNumber = (value: unknown, field: string, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const parsed = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    throw new Error(`${field} inválido.`)
  }
  return parsed
}

const normalizeImages = (value: unknown) => {
  if (!Array.isArray(value)) return [] as string[]
  const cleaned = value
    .filter((item): item is string => typeof item === 'string')
    .map(item => item.trim())
    .filter(Boolean)
  if (cleaned.length > MAX_IMAGES) {
    throw new Error(`Máximo ${MAX_IMAGES} imágenes.`)
  }
  return cleaned
}

export const validateCreateListingPayload = (value: unknown) => {
  if (!value || typeof value !== 'object') throw new Error('Payload inválido.')

  const payload = value as ListingPayload
  const brand = normalizeString(payload.brand)
  const model = normalizeString(payload.model)
  const year = parseInteger(payload.year, 'Año', 1900, new Date().getFullYear() + 1)
  const km = parseInteger(payload.km, 'Kilometraje', 0)
  const price = parseFloatNumber(payload.price, 'Precio', 0)

  if (!brand || !model) throw new Error('Marca y modelo son requeridos.')

  const version = normalizeString(payload.version)
  const title = [brand, model, version, year].filter(Boolean).join(' ')

  const currency = payload.currency === 'ARS' ? 'ARS' : 'USD'
  const fuel = normalizeString(payload.fuel)
  const engine = normalizeString(payload.engine)
  const transmission = normalizeString(payload.transmission)
  const color = normalizeString(payload.color)
  const description = normalizeString(payload.description, MAX_DESCRIPTION) ?? ''
  const phone = normalizeString(payload.phone)
  const province = normalizeString(payload.province)
  const city = normalizeString(payload.city)
  const images = normalizeImages(payload.images)

  if (!phone || !province) throw new Error('Teléfono y provincia son requeridos.')

  return {
    title,
    brand,
    model,
    version,
    year,
    km,
    price,
    currency,
    color,
    fuel,
    engine,
    transmission,
    description,
    phone,
    province,
    city,
    images,
    is_featured: Boolean(payload.is_featured),
    is_active: payload.is_active !== false,
    views: 0,
  }
}

export const validateListingPatchPayload = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object') throw new Error('Payload inválido.')
  const payload = value as ListingPayload

  const updates: Record<string, unknown> = {}

  if (typeof payload.is_active === 'boolean') updates.is_active = payload.is_active
  if (typeof payload.is_featured === 'boolean') updates.is_featured = payload.is_featured

  if (payload.price !== undefined) updates.price = parseFloatNumber(payload.price, 'Precio', 0)
  if (payload.km !== undefined) updates.km = parseInteger(payload.km, 'Kilometraje', 0)
  if (payload.year !== undefined) updates.year = parseInteger(payload.year, 'Año', 1900, new Date().getFullYear() + 1)

  if (payload.brand !== undefined) updates.brand = normalizeString(payload.brand)
  if (payload.model !== undefined) updates.model = normalizeString(payload.model)
  if (payload.version !== undefined) updates.version = normalizeString(payload.version)
  if (payload.description !== undefined) updates.description = normalizeString(payload.description, MAX_DESCRIPTION) ?? ''
  if (payload.color !== undefined) updates.color = normalizeString(payload.color)
  if (payload.fuel !== undefined) updates.fuel = normalizeString(payload.fuel)
  if (payload.engine !== undefined) updates.engine = normalizeString(payload.engine)
  if (payload.transmission !== undefined) updates.transmission = normalizeString(payload.transmission)
  if (payload.phone !== undefined) updates.phone = normalizeString(payload.phone)
  if (payload.province !== undefined) updates.province = normalizeString(payload.province)
  if (payload.city !== undefined) updates.city = normalizeString(payload.city)
  if (payload.images !== undefined) updates.images = normalizeImages(payload.images)

  if (updates.brand || updates.model || updates.version || updates.year) {
    const year = typeof updates.year === 'number' ? updates.year : payload.year
    const safeYear = year ? parseInteger(year, 'Año', 1900, new Date().getFullYear() + 1) : null
    const baseBrand = typeof updates.brand === 'string' ? updates.brand : normalizeString(payload.brand)
    const baseModel = typeof updates.model === 'string' ? updates.model : normalizeString(payload.model)
    if (baseBrand && baseModel && safeYear) {
      updates.title = [baseBrand, baseModel, updates.version ?? normalizeString(payload.version), safeYear]
        .filter(Boolean)
        .join(' ')
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new Error('No hay campos válidos para actualizar.')
  }

  return updates
}

export const uploadRules = {
  maxFileBytes: 10 * 1024 * 1024,
  allowedMimeTypes: new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']),
}
