export type TenantDetail = {
  id: string
  slug: string
  customName?: string
  timezone: string
  primaryColor?: string
  secondaryColor?: string
  tertiaryColor?: string
  logoUrl?: string
  bannerUrl?: string
  loadingType: 'MASCOT' | 'SPINNER' | 'DOTS'
  zipCode: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  isMain: boolean
}
