import type { UnitPermission } from '@shared/types/auth/unit-permission.type'

export type UnitPositionDraft = {
  name: string
  belowPositionId: string
  permissions: UnitPermission[]
}
