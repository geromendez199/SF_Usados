export type Listing = {
  id: string
  created_at: string
  title: string
  brand: string
  model: string
  version: string | null
  year: number
  km: number
  price: number
  currency: 'USD' | 'ARS'
  color: string | null
  fuel: string | null
  engine: string | null
  transmission: string | null
  description: string
  phone: string
  province: string
  city: string | null
  images: string[]
  is_featured: boolean
  is_active: boolean
  views: number
}

export const CAR_BRANDS = [
  'Chevrolet', 'Ford', 'Volkswagen', 'Renault', 'Peugeot',
  'Fiat', 'Toyota', 'Honda', 'Nissan', 'Hyundai',
  'Kia', 'Jeep', 'Dodge', 'RAM', 'Citroën',
  'BMW', 'Mercedes-Benz', 'Audi', 'Volvo', 'Subaru',
  'Mitsubishi', 'Suzuki', 'Mazda', 'Alfa Romeo', 'Ferrari',
  'Lamborghini', 'Porsche', 'Land Rover', 'Isuzu', 'BAIC',
  'BYD', 'Chery', 'Geely', 'JAC', 'MG', 'Otra',
] as const

export const FUEL_TYPES = [
  'Nafta', 'Diesel', 'GNC', 'Nafta/GNC', 'Híbrido', 'Eléctrico',
] as const

export const TRANSMISSION_TYPES = [
  'Manual', 'Automática', 'CVT', 'Secuencial',
] as const

export const ARGENTINA_PROVINCES = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut',
  'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
  'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén',
  'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
  'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
] as const

export const YEAR_OPTIONS = Array.from(
  { length: new Date().getFullYear() - 1979 },
  (_, i) => new Date().getFullYear() - i
)
