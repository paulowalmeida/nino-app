import { UnitStatus, UnitType } from '../../enums'
import { Company } from '../company/company'

export type Unit = {
  id: string
  slug: string
  customName: string | null
  logoUrl: string | null
  favicon: string | null
  primaryColor: string | null
  secondaryColor: string | null
  customDomain: string | null
  zipCode: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  country: string | null
  timezone: string | null
  createdAt: string
  updatedAt: string
  status: { id: string; name: UnitStatus }
  type: { id: string; name: UnitType }
  company: Company
}
