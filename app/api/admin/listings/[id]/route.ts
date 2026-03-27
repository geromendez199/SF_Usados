import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/requireAdmin'
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server'
import { validateListingPatchPayload } from '@/lib/admin/listingValidation'

const extractStoragePathFromPublicUrl = (url: string) => {
  try {
    const parsed = new URL(url)
    const marker = '/storage/v1/object/public/listings/'
    const index = parsed.pathname.indexOf(marker)
    if (index === -1) return null
    return decodeURIComponent(parsed.pathname.slice(index + marker.length))
  } catch {
    return null
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireAdmin(request)
  if (unauthorized) return unauthorized

  try {
    const { id } = await params
    const body = await request.json()
    const updates = validateListingPatchPayload(body)
    const supabase = createServiceRoleSupabaseClient()

    const { data, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ ok: true, data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo actualizar la publicación.'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireAdmin(request)
  if (unauthorized) return unauthorized

  try {
    const { id } = await params
    const supabase = createServiceRoleSupabaseClient()

    const { data: listing, error: loadError } = await supabase
      .from('listings')
      .select('images')
      .eq('id', id)
      .single()

    if (loadError) throw loadError

    const { error: deleteError } = await supabase.from('listings').delete().eq('id', id)
    if (deleteError) throw deleteError

    const listingImages = Array.isArray(listing?.images)
      ? listing.images.filter((image): image is string => typeof image === 'string')
      : []

    const imagePaths = listingImages
      .map(extractStoragePathFromPublicUrl)
      .filter((path): path is string => Boolean(path))

    if (imagePaths.length > 0) {
      await supabase.storage.from('listings').remove(imagePaths)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo eliminar la publicación.'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}
