export type CreateTenantRequest = {
  slug: string
  companyId: string
  statusId: string
  typeId: string
  zipCode: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  customName?: string
  logoUrl?: string
  favicon?: string
  primaryColor?: string
  secondaryColor?: string
  customDomain?: string
  complement?: string
  country?: string
  timezone?: string
}
