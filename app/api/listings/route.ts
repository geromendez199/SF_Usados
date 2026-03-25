import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase env vars are missing' }, { status: 500 })
  }

  let q = supabase.from('listings').select('*').eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  const brand = searchParams.get('brand')
  const province = searchParams.get('province')
  const maxPrice = searchParams.get('maxPrice')
  const yearFrom = searchParams.get('yearFrom')
  const fuel = searchParams.get('fuel')
  const qText = searchParams.get('q')?.replace(/[,%]/g, ' ').trim()
  const sort = searchParams.get('sort') || 'newest'

  if (brand) q = q.eq('brand', brand)
  if (province) q = q.eq('province', province)
  if (maxPrice) q = q.lte('price', parseFloat(maxPrice))
  if (yearFrom) q = q.gte('year', parseInt(yearFrom))
  if (fuel) q = q.eq('fuel', fuel)
  if (qText) {
    q = q.or(`brand.ilike.%${qText}%,model.ilike.%${qText}%,version.ilike.%${qText}%,title.ilike.%${qText}%`)
  }

  if (sort === 'priceAsc') q = q.order('price', { ascending: true })
  if (sort === 'priceDesc') q = q.order('price', { ascending: false })
  if (sort === 'yearDesc') q = q.order('year', { ascending: false })
  if (sort === 'kmAsc') q = q.order('km', { ascending: true })

  const { data, error } = await q.limit(48)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
