import { Company } from './company'

export type CompanyResponsible = {
  id: string
  name: string
  cpf: string
  phone: string
  email: string
  createdAt: string
  updatedAt: string
  companies: Company[]
}
