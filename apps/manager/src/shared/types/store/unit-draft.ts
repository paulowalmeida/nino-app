import type {
  BannerCrops,
  BannerVariantFiles,
  BannerVariants,
} from '@pages/Units/types/BannerCrop.type'

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
  bannerCrops?: BannerCrops
  bannerVariants?: BannerVariants
  logoFile?: File
  bannerFile?: File
  bannerVariantFiles?: BannerVariantFiles
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
