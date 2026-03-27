import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createServiceRoleSupabaseClient()

    const { data: listing, error: loadError } = await supabase
      .from('listings')
      .select('id, views, is_active')
      .eq('id', id)
      .single()

    if (loadError || !listing || !listing.is_active) {
      return NextResponse.json({ ok: false, error: 'Publicación no encontrada.' }, { status: 404 })
    }

    const { error: updateError } = await supabase
      .from('listings')
      .update({ views: (listing.views || 0) + 1 })
      .eq('id', id)

    if (updateError) throw updateError

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo registrar la visita.'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}
