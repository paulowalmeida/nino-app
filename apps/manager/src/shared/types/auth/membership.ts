import type { UnitRole } from './unit-role'

export type Membership = {
  unitId: string
  unitName: string
  unitSlug: string
  companyId: string
  companyName: string
  role: UnitRole
  isCurrent: boolean
}
