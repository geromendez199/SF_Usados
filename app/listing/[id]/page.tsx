import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import type { Listing } from '@/types'
import CarDetail from './CarDetail'

async function getListing(id: string): Promise<Listing | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()
  if (error || !data) return null
  return data as Listing
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const listing = await getListing(id)

  if (!listing) {
    return {
      title: 'Publicación no encontrada | SF_Usados',
    }
  }

  const title = `${listing.brand} ${listing.model}${listing.version ? ` ${listing.version}` : ''} | SF_Usados`
  const description = `${formatPrice(listing.price, listing.currency)} · ${listing.year} · ${listing.km.toLocaleString('es-AR')} km${listing.city ? ` · ${listing.city}` : ''}. Consultá directo por WhatsApp.`

  return {
    title,
    description,
    alternates: {
      canonical: `/listing/${listing.id}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      images: listing.images?.[0] ? [{ url: listing.images[0], alt: listing.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: listing.images?.[0] ? [listing.images[0]] : undefined,
    },
  }
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const listing = await getListing(id)
  if (!listing) notFound()

  const supabase = getSupabaseClient()
  if (supabase) {
    supabase.from('listings').update({ views: (listing.views || 0) + 1 }).eq('id', listing.id).then()
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    image: listing.images,
    description: listing.description || `${listing.brand} ${listing.model} ${listing.year}`,
    brand: {
      '@type': 'Brand',
      name: listing.brand,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: listing.currency,
      price: listing.price,
      availability: 'https://schema.org/InStock',
      url: `https://sf-usados.vercel.app/listing/${listing.id}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <CarDetail listing={listing} />
    </>
  )
}
