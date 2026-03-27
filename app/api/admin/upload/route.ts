import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { requireAdmin } from '@/lib/admin/requireAdmin'
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server'
import { uploadRules } from '@/lib/admin/listingValidation'

export async function POST(request: NextRequest) {
  const unauthorized = requireAdmin(request)
  if (unauthorized) return unauthorized

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: 'Archivo inválido.' }, { status: 400 })
    }

    if (!uploadRules.allowedMimeTypes.has(file.type)) {
      return NextResponse.json({ ok: false, error: 'Tipo de archivo no permitido.' }, { status: 400 })
    }

    if (file.size > uploadRules.maxFileBytes) {
      return NextResponse.json({ ok: false, error: 'La imagen supera el tamaño máximo permitido.' }, { status: 400 })
    }

    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
    const storagePath = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${ext}`
    const bytes = await file.arrayBuffer()

    const supabase = createServiceRoleSupabaseClient()
    const { error: uploadError } = await supabase
      .storage
      .from('listings')
      .upload(storagePath, bytes, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('listings').getPublicUrl(storagePath)

    return NextResponse.json({
      ok: true,
      data: {
        path: storagePath,
        publicUrl: data.publicUrl,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo subir la imagen.'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}
