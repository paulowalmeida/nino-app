import { TenantStatus, TenantType } from '../../enums'
import { Company } from '../company/company'

export type Tenant = {
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
  status: { id: string; name: TenantStatus }
  type: { id: string; name: TenantType }
  company: Company
}
