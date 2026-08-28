export type UnitDraft = {
  customName: string
  timezone: string
  primaryColor: string
  secondaryColor: string
  tertiaryColor: string
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
}
