import { NextRequest, NextResponse } from 'next/server'
import { getAdminCookieName, isAdminSessionValid } from '@/lib/adminAuth'

export const requireAdmin = (request: NextRequest): NextResponse | null => {
  const token = request.cookies.get(getAdminCookieName())?.value
  if (!isAdminSessionValid(token)) {
    return NextResponse.json({ ok: false, error: 'Sesión de admin inválida o expirada.' }, { status: 401 })
  }
  return null
}
