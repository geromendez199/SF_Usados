import { createHmac, timingSafeEqual } from 'crypto'

const ADMIN_COOKIE_NAME = 'sf_admin_session'
const ADMIN_COOKIE_TTL_SECONDS = 60 * 60 * 12

const toBytes = (value: string) => Buffer.from(value, 'utf8')

const safeCompare = (a: string, b: string) => {
  const aBytes = toBytes(a)
  const bBytes = toBytes(b)
  if (aBytes.length !== bBytes.length) return false
  return timingSafeEqual(aBytes, bBytes)
}

const getSecret = () => process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || ''

export const getAdminCookieName = () => ADMIN_COOKIE_NAME
export const getAdminCookieTtl = () => ADMIN_COOKIE_TTL_SECONDS

export const isAdminPasswordValid = (password: string) => {
  const expected = process.env.ADMIN_PASSWORD || ''
  if (!expected) return false
  return safeCompare(password, expected)
}

export const signAdminSession = () => {
  const secret = getSecret()
  if (!secret) return null

  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_COOKIE_TTL_SECONDS
  const payload = `v1:${expiresAt}`
  const signature = createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}:${signature}`
}

export const isAdminSessionValid = (token: string | undefined) => {
  if (!token) return false
  const secret = getSecret()
  if (!secret) return false

  const parts = token.split(':')
  if (parts.length !== 3) return false
  const [version, expiresAtRaw, sig] = parts
  if (version !== 'v1') return false

  const expiresAt = Number(expiresAtRaw)
  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) return false

  const payload = `${version}:${expiresAt}`
  const expectedSig = createHmac('sha256', secret).update(payload).digest('hex')
  return safeCompare(sig, expectedSig)
}
