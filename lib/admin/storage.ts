const SUPABASE_PUBLIC_LISTINGS_MARKER = '/storage/v1/object/public/listings/'

export const getAllowedListingsPublicUrlPrefix = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!baseUrl || !baseUrl.trim()) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }

  const normalized = baseUrl.replace(/\/+$/, '')
  return `${normalized}${SUPABASE_PUBLIC_LISTINGS_MARKER}`
}

export const getStoragePathFromListingsPublicUrl = (url: string) => {
  try {
    const allowedPrefix = getAllowedListingsPublicUrlPrefix()
    if (!url.startsWith(allowedPrefix)) return null

    const rawPath = decodeURIComponent(url.slice(allowedPrefix.length)).trim()
    if (!rawPath || rawPath.includes('..')) return null
    return rawPath
  } catch {
    return null
  }
}

export const isAllowedListingsPublicUrl = (value: string) => {
  return getStoragePathFromListingsPublicUrl(value) !== null
}

export const imageMimeToExtension: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
}
