export type UpdateUnitRequest = {
  customName?: string
  timezone: string
  primaryColor?: string
  secondaryColor?: string
  tertiaryColor?: string
  logoUrl?: string | null
  bannerUrl?: string | null
  loadingType?: 'MASCOT' | 'SPINNER' | 'DOTS'
  zipCode: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  deliveryCities: DeliveryCity[]
}
import type { DeliveryCity } from './delivery-city'
