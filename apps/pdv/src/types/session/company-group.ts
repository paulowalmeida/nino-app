import type { Membership } from '@custom_types/auth'

export type CompanyGroup = {
  companyId: string
  companyName: string
  units: Membership[]
}
