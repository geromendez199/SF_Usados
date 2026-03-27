import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { requireAdmin } from '@/lib/admin/requireAdmin'
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server'
import { uploadRules } from '@/lib/admin/listingValidation'
import { imageMimeToExtension } from '@/lib/admin/storage'

type UploadStage =
  | 'formData'
  | 'file'
  | 'validation'
  | 'storagePath'
  | 'conversion'
  | 'upload'
  | 'publicUrl'

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message?: unknown }).message)
  }
  return 'No se pudo subir la imagen.'
}

export async function POST(request: NextRequest) {
  const unauthorized = requireAdmin(request)
  if (unauthorized) return unauthorized

  let stage: UploadStage = 'formData'

  try {
    console.info('[admin/upload] stage=formData: parsing multipart body')
    const formData = await request.formData()

    stage = 'file'
    const rawFile = formData.get('file')
    console.info('[admin/upload] stage=file: extracting file entry', {
      hasFileField: rawFile !== null,
      valueType: rawFile === null ? 'null' : typeof rawFile,
    })

    if (!(rawFile instanceof File)) {
      return NextResponse.json(
        { ok: false, stage, error: 'Archivo inválido.' },
        { status: 400 },
      )
    }

    const file = rawFile

    stage = 'validation'
    console.info('[admin/upload] stage=validation: validating mime and size', {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    if (!uploadRules.allowedMimeTypes.has(file.type)) {
      return NextResponse.json(
        { ok: false, stage, error: 'Tipo de archivo no permitido.' },
        { status: 400 },
      )
    }

    if (file.size > uploadRules.maxFileBytes) {
      return NextResponse.json(
        { ok: false, stage, error: 'La imagen supera el tamaño máximo permitido.' },
        { status: 400 },
      )
    }

    const ext = imageMimeToExtension[file.type]
    if (!ext) {
      return NextResponse.json(
        { ok: false, stage, error: 'Extensión de archivo no permitida.' },
        { status: 400 },
      )
    }

    stage = 'storagePath'
    const datePrefix = new Date().toISOString().slice(0, 10)
    const storagePath = `${datePrefix}/${randomUUID()}.${ext}`
    console.info('[admin/upload] stage=storagePath: generated destination path', {
      storagePath,
      extension: ext,
    })

    stage = 'conversion'
    const bytes = Buffer.from(await file.arrayBuffer())
    console.info('[admin/upload] stage=conversion: converted file to buffer', {
      byteLength: bytes.byteLength,
    })

    const supabase = createServiceRoleSupabaseClient()

    stage = 'upload'
    console.info('[admin/upload] stage=upload: sending object to Supabase Storage', {
      bucket: 'listings',
      storagePath,
      contentType: file.type,
      payloadType: 'Buffer',
    })

    const { error: uploadError } = await supabase
      .storage
      .from('listings')
      .upload(storagePath, bytes, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      throw uploadError
    }

    stage = 'publicUrl'
    console.info('[admin/upload] stage=publicUrl: requesting public URL', {
      bucket: 'listings',
      storagePath,
    })

    const { data } = supabase.storage.from('listings').getPublicUrl(storagePath)

    if (!data?.publicUrl) {
      throw new Error('No se pudo generar la URL pública.')
    }

    return NextResponse.json({
      ok: true,
      data: {
        path: storagePath,
        publicUrl: data.publicUrl,
      },
    })
  } catch (error) {
    const message = getErrorMessage(error)

    console.error('[admin/upload] failed', {
      stage,
      error: message,
    })

    return NextResponse.json(
      {
        ok: false,
        stage,
        error:
          stage === 'upload'
            ? `Error al subir la imagen (${stage}): ${message}`
            : `Error al procesar la imagen (${stage}): ${message}`,
      },
      { status: 400 },
    )
  }
}
