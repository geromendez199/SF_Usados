const SUPABASE_PUBLIC_LISTINGS_MARKER = '/storage/v1/object/public/listings/'

const imageExtensionToMime: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
  heif: 'image/heif',
  avif: 'image/avif',
}

const imageMimeAliases: Record<string, string> = {
  'image/jpg': 'image/jpeg',
  'image/pjpeg': 'image/jpeg',
  'image/x-png': 'image/png',
  'image/heic-sequence': 'image/heic',
  'image/heif-sequence': 'image/heif',
}

const sanitizeStoragePath = (value: string) => {
  const normalized = value.trim().replace(/^\/+/, '')
  if (!normalized || normalized.includes('..')) return null
  return normalized
}

const getSupabaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!baseUrl || !baseUrl.trim()) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }
  return baseUrl.trim()
}

const getSupabaseOrigin = () => new URL(getSupabaseUrl()).origin

export const getAllowedListingsPublicUrlPrefix = () => {
  return `${getSupabaseOrigin()}${SUPABASE_PUBLIC_LISTINGS_MARKER}`
}

export const getStoragePathFromListingsPublicUrl = (url: string) => {
  try {
    const parsed = new URL(url)
    if (parsed.origin !== getSupabaseOrigin()) return null
    if (!parsed.pathname.startsWith(SUPABASE_PUBLIC_LISTINGS_MARKER)) return null

    const rawPath = decodeURIComponent(parsed.pathname.slice(SUPABASE_PUBLIC_LISTINGS_MARKER.length))
    return sanitizeStoragePath(rawPath)
  } catch {
    return null
  }
}

export const isAllowedListingsPublicUrl = (value: string) => {
  return getStoragePathFromListingsPublicUrl(value) !== null
}

export const getFileExtensionFromName = (value: string) => {
  const dotIndex = value.lastIndexOf('.')
  if (dotIndex === -1) return null
  const ext = value.slice(dotIndex + 1).trim().toLowerCase()
  return ext || null
}

export const normalizeImageMimeType = (value: string | null | undefined) => {
  if (!value) return null
  const normalized = value.trim().toLowerCase()
  return imageMimeAliases[normalized] ?? normalized
}

export const getImageMimeTypeForExtension = (extension: string | null | undefined) => {
  if (!extension) return null
  return imageExtensionToMime[extension.trim().toLowerCase()] ?? null
}

export const getImageExtensionForMimeType = (mimeType: string | null | undefined) => {
  const normalizedMime = normalizeImageMimeType(mimeType)
  if (!normalizedMime) return null

  const entry = Object.entries(imageExtensionToMime)
    .find(([, candidateMime]) => candidateMime === normalizedMime)

  return entry?.[0] ?? null
}

export const resolveImageUploadMetadata = (mimeType: string, filename: string) => {
  const normalizedMimeType = normalizeImageMimeType(mimeType)
  const extensionFromMime = getImageExtensionForMimeType(normalizedMimeType)
  const extensionFromName = getFileExtensionFromName(filename)
  const mimeFromExtension = getImageMimeTypeForExtension(extensionFromName)

  const resolvedMimeType = normalizedMimeType ?? mimeFromExtension
  const resolvedExtension = extensionFromMime ?? extensionFromName

  if (!resolvedMimeType || !resolvedExtension) return null

  const normalizedExtension = resolvedExtension.toLowerCase()
  const canonicalMimeForExtension = getImageMimeTypeForExtension(normalizedExtension)
  if (!canonicalMimeForExtension) return null

  if (resolvedMimeType !== canonicalMimeForExtension && !extensionFromMime) return null

  return {
    mimeType: canonicalMimeForExtension,
    extension: normalizedExtension,
  }
}

export const buildListingsPublicUrlFromPath = (storagePath: string) => {
  const normalizedPath = sanitizeStoragePath(storagePath)
  if (!normalizedPath) return null

  const encodedPath = normalizedPath
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/')

  return `${getAllowedListingsPublicUrlPrefix()}${encodedPath}`
}
