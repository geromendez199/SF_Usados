import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const supabase = createServerClient()

  let q = supabase.from('listings').select('*').eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  const brand = searchParams.get('brand')
  const province = searchParams.get('province')
  const maxPrice = searchParams.get('maxPrice')
  const yearFrom = searchParams.get('yearFrom')
  const fuel = searchParams.get('fuel')

  if (brand) q = q.eq('brand', brand)
  if (province) q = q.eq('province', province)
  if (maxPrice) q = q.lte('price', parseFloat(maxPrice))
  if (yearFrom) q = q.gte('year', parseInt(yearFrom))
  if (fuel) q = q.eq('fuel', fuel)

  const { data, error } = await q.limit(48)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
