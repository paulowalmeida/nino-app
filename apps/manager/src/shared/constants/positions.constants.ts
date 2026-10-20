import type { PermissionDefinition } from '@shared/types/team/permission-definition.type'

export const PERMISSION_GROUP_LABEL: Record<
  PermissionDefinition['group'],
  string
> = {
  operation: 'Operação do dia',
  sales: 'Vendas e clientes',
  catalog: 'Cardápio',
  delivery: 'Entrega',
  team: 'Equipe',
  store: 'Loja',
}

export const POSITION_LEVEL_LIMITS = { min: 1, max: 99, initial: 20 }

export const POSITIONS_GHOST_ROWS = ['first', 'second', 'third']
