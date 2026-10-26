import type { UnitPermission } from '@shared/types/auth/unit-permission.type'

export type PermissionDefinition = {
  key: UnitPermission
  group: 'operation' | 'catalog' | 'business' | 'unit' | 'company'
  label: string
  description: string
}
