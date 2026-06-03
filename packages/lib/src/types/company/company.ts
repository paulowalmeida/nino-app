export type Company = {
  id: string
  cnpj: string
  name: string
  legalName: string | null
  stateRegistration: string | null
  legalNature: string | null
  zipCode: string | null
  street: string | null
  number: string | null
  complement: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  country: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}
