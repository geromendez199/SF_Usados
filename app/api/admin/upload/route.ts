import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { requireAdmin } from '@/lib/admin/requireAdmin'
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server'
import { uploadRules } from '@/lib/admin/listingValidation'
import { buildListingsPublicUrlFromPath, resolveImageUploadMetadata } from '@/lib/admin/storage'

const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }

  if (typeof error === 'object' && error !== null) {
    return error
  }

  return { message: String(error) }
}

export async function POST(request: NextRequest) {
  const unauthorized = requireAdmin(request)
  if (unauthorized) return unauthorized

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: 'Archivo inválido.' }, { status: 400 })
    }

    if (file.size > uploadRules.maxFileBytes) {
      return NextResponse.json({ ok: false, error: 'La imagen supera el tamaño máximo permitido.' }, { status: 400 })
    }

    const imageMetadata = resolveImageUploadMetadata(file.type, file.name)
    if (!imageMetadata) {
      return NextResponse.json({
        ok: false,
        error: 'No se pudo validar el tipo de imagen. Probá con JPG, PNG, WEBP, HEIC, HEIF o AVIF.',
      }, { status: 400 })
    }

    if (!uploadRules.allowedMimeTypes.has(imageMetadata.mimeType)) {
      return NextResponse.json({ ok: false, error: 'Tipo de archivo no permitido.' }, { status: 400 })
    }

    const storagePath = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${imageMetadata.extension}`
    const bytes = await file.arrayBuffer()

    const supabase = createServiceRoleSupabaseClient()
    const { error: uploadError } = await supabase
      .storage
      .from('listings')
      .upload(storagePath, bytes, {
        contentType: imageMetadata.mimeType,
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('listings').getPublicUrl(storagePath)
    const fallbackPublicUrl = buildListingsPublicUrlFromPath(storagePath)
    const publicUrl = data?.publicUrl || fallbackPublicUrl
    if (!publicUrl) {
      throw new Error('No se pudo construir la URL pública de la imagen.')
    }

    return NextResponse.json({
      ok: true,
      data: {
        path: storagePath,
        publicUrl,
      },
    })
  } catch (error) {
    const errorData = serializeError(error)
    console.error('POST /api/admin/upload failed', {
      error: errorData,
      requestId: randomUUID(),
    })

    const message = error instanceof Error ? error.message : 'No se pudo subir la imagen.'
    return NextResponse.json(
      {
        ok: false,
        error: message || 'No se pudo subir la imagen.',
      },
      { status: 400 },
    )
  }
}
