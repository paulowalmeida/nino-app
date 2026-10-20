import type { UnitPermission } from '@shared/types/auth/unit-permission.type'

export type PermissionDefinition = {
  key: UnitPermission
  group: 'operation' | 'sales' | 'catalog' | 'delivery' | 'team' | 'store'
  label: string
  description: string
}
