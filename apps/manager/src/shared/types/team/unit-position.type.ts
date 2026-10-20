import type { UnitPermission } from '@shared/types/auth/unit-permission.type'

export type UnitPosition = {
  id: string
  name: string
  level: number
  permissions: UnitPermission[]
  isDefault: boolean
  isProtected: boolean
  memberCount: number
}
