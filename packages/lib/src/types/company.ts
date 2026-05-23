import { PaginatedResponse } from './common'

export interface Company {
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

export interface CreateCompanyRequest {
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

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {}

export interface CompanyPaginatedResponse extends PaginatedResponse<Company> {}

export interface CompanyResponsible {
  id: string
  name: string
  cpf: string
  phone: string
  email: string
  createdAt: string
  updatedAt: string
  companies: Company[]
}

export interface CreateCompanyResponsibleRequest {
  name: string
  cpf: string
  phone: string
  email: string
}

export interface UpdateCompanyResponsibleRequest extends Partial<CreateCompanyResponsibleRequest> {}
