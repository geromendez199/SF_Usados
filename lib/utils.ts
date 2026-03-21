export function formatPrice(price: number, currency: 'USD' | 'ARS') {
  if (currency === 'USD') return `US$ ${price.toLocaleString('es-AR')}`
  return `$ ${price.toLocaleString('es-AR')}`
}

export function formatKm(km: number) {
  return `${km.toLocaleString('es-AR')} km`
}

export function buildWhatsApp(phone: string, listing: { title: string; price: number; currency: string }) {
  const clean = phone.replace(/\D/g, '')
  const msg = encodeURIComponent(
    `Hola SF_Usados! Vi el ${listing.title} por ${listing.currency === 'USD' ? 'US$' : '$'}${listing.price.toLocaleString('es-AR')} en la web. ¿Sigue disponible?`
  )
  return `https://wa.me/${clean}?text=${msg}`
}

export function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime()
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  const mins = Math.floor(diff / 60000)
  if (days > 0) return `hace ${days}d`
  if (hours > 0) return `hace ${hours}h`
  if (mins > 0) return `hace ${mins}m`
  return 'ahora'
}
