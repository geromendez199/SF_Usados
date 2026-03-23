import { NextRequest, NextResponse } from 'next/server'
import { getAdminCookieName, isAdminSessionValid } from '@/lib/adminAuth'

export async function GET(request: NextRequest) {
  const token = request.cookies.get(getAdminCookieName())?.value
  return NextResponse.json({ ok: isAdminSessionValid(token) })
}
