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

export const POSITIONS_GHOST_ROWS = ['first', 'second', 'third']
