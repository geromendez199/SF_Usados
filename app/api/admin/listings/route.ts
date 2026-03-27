import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/requireAdmin'
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server'
import { validateCreateListingPayload } from '@/lib/admin/listingValidation'

export async function GET(request: NextRequest) {
  const unauthorized = requireAdmin(request)
  if (unauthorized) return unauthorized

  try {
    const supabase = createServiceRoleSupabaseClient()
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter')

    let query = supabase.from('listings').select('*').order('created_at', { ascending: false })

    if (filter === 'active') query = query.eq('is_active', true)
    if (filter === 'inactive') query = query.eq('is_active', false)
    if (filter === 'featured') query = query.eq('is_featured', true)

    const { data, error } = await query.limit(200)
    if (error) throw error

    return NextResponse.json({ ok: true, data: data ?? [] })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo obtener publicaciones.'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = requireAdmin(request)
  if (unauthorized) return unauthorized

  try {
    const supabase = createServiceRoleSupabaseClient()
    const body = await request.json()
    const payload = validateCreateListingPayload(body)

    const { data, error } = await supabase
      .from('listings')
      .insert(payload)
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ ok: true, data }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo crear la publicación.'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}
