import type { Membership } from '@custom_types/auth/membership'
export type CompanyGroup = {
  companyId: string
  companyName: string
  units: Membership[]
}
