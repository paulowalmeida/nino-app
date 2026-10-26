import type { UnitPermission } from '@shared/types/auth/unit-permission.type'

export type UnitPosition = {
  id: string
  name: string
  level: number
  /** Cargo logo acima na hierarquia; `null` no topo. */
  belowPositionId: string | null
  permissions: UnitPermission[]
  isDefault: boolean
  isProtected: boolean
  memberCount: number
}
