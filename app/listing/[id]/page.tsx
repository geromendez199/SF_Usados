import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Listing } from '@/types'
import CarDetail from './CarDetail'

async function getListing(id: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()
  if (error || !data) return null
  return data as Listing
}

export default async function ListingPage({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id)
  if (!listing) notFound()

  supabase.from('listings').update({ views: (listing.views || 0) + 1 }).eq('id', listing.id).then()

  return <CarDetail listing={listing} />
}
