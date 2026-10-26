import type { UnitPermission } from './unit-permission.type'
import type { UnitRole } from './unit-role'

export type Membership = {
  unitId: string
  unitName: string
  unitSlug: string
  companyId: string
  companyName: string
  role: UnitRole
  positionId: string
  positionName: string
  positionLevel: number
  permissions: UnitPermission[]
  isCurrent: boolean
}
