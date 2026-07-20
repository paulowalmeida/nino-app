import type { Company, UpdateCompanyRequest } from '@custom_types/company'

export type CompanyCardProps = {
  company: Company | undefined
  isPending: boolean
  isSaving: boolean
  onSave: (data: UpdateCompanyRequest) => void
}

export type CompanyDraft = {
  name: string
  legalName: string
  stateRegistration: string
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}
