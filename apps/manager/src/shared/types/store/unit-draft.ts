export type UnitDraft = {
  customName: string
  timezone: string
  primaryColor: string
  secondaryColor: string
  tertiaryColor: string
  backgroundColor: string
  textColor: string
  cardColor: string
  borderColor: string
  mutedTextColor: string
  logoUrl?: string | null
  bannerUrl?: string | null
  logoFile?: File
  bannerFile?: File
  loadingType: 'MASCOT' | 'SPINNER' | 'DOTS'
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  deliveryCities: DeliveryCity[]
}
import type { DeliveryCity } from './delivery-city'
