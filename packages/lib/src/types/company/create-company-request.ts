export type CreateCompanyRequest = {
  cnpj: string
  name: string
  ownerId: string
  responsibleId: string
  legalName?: string
  stateRegistration?: string
  legalNature?: string
  zipCode?: string
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  country?: string
}
