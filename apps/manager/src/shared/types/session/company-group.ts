import type { Membership } from '@shared/types/auth/membership'
export type CompanyGroup = {
  companyId: string
  companyName: string
  units: Membership[]
}
