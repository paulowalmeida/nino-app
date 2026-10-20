import type { PermissionDefinition } from '@shared/types/team/permission-definition.type'

export const PERMISSION_GROUP_LABEL: Record<
  PermissionDefinition['group'],
  string
> = {
  operation: 'Operação',
  catalog: 'Cardápio',
  business: 'Negócio',
  unit: 'Unidade',
  company: 'Empresa',
}

export const POSITIONS_GHOST_ROWS = ['first', 'second', 'third']
