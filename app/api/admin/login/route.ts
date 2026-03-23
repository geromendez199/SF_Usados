import { NextRequest, NextResponse } from 'next/server'
import { getAdminCookieName, getAdminCookieTtl, isAdminPasswordValid, signAdminSession } from '@/lib/adminAuth'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!isAdminPasswordValid(password)) {
    return NextResponse.json({ ok: false, error: 'Credenciales inválidas' }, { status: 401 })
  }

  const token = signAdminSession()
  if (!token) {
    return NextResponse.json({ ok: false, error: 'Falta ADMIN_SESSION_SECRET' }, { status: 500 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: getAdminCookieName(),
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: getAdminCookieTtl(),
  })
  return res
}
