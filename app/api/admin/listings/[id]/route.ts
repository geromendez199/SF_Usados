import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/requireAdmin'
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server'
import { getStoragePathFromListingsPublicUrl } from '@/lib/admin/storage'
import { validateListingPatchPayload } from '@/lib/admin/listingValidation'

const isValidUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

const normalizeTitlePart = (value: unknown) => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim().replace(/\s+/g, ' ')
  return trimmed || null
}

const buildTitle = (brand: unknown, model: unknown, version: unknown, year: unknown) => {
  const safeBrand = normalizeTitlePart(brand)
  const safeModel = normalizeTitlePart(model)
  const safeVersion = normalizeTitlePart(version)
  const safeYear = typeof year === 'number' ? year : Number(year)

  if (!safeBrand || !safeModel || !Number.isInteger(safeYear)) return null

  return [safeBrand, safeModel, safeVersion, safeYear]
    .filter(Boolean)
    .join(' ')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireAdmin(request)
  if (unauthorized) return unauthorized

  try {
    const { id } = await params
    if (!isValidUuid(id)) {
      return NextResponse.json({ ok: false, error: 'ID inválido.' }, { status: 400 })
    }

    const body = await request.json()
    const updates = validateListingPatchPayload(body)
    const supabase = createServiceRoleSupabaseClient()

    if (
      updates.brand !== undefined ||
      updates.model !== undefined ||
      updates.version !== undefined ||
      updates.year !== undefined
    ) {
      const { data: existing, error: existingError } = await supabase
        .from('listings')
        .select('brand, model, version, year')
        .eq('id', id)
        .single()

      if (existingError) throw existingError

      const title = buildTitle(
        updates.brand ?? existing?.brand,
        updates.model ?? existing?.model,
        updates.version ?? existing?.version,
        updates.year ?? existing?.year,
      )

      if (title) {
        updates.title = title
      }
    }

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
    if (!isValidUuid(id)) {
      return NextResponse.json({ ok: false, error: 'ID inválido.' }, { status: 400 })
    }

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
      .map(getStoragePathFromListingsPublicUrl)
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
