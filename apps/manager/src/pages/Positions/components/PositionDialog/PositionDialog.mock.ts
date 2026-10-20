import type { PermissionDefinition } from '@shared/types/team/permission-definition.type'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const positionDialogCatalogMock: PermissionDefinition[] = [
  {
    key: 'cashbox.operate',
    group: 'operation',
    label: 'Mexer no caixa',
    description: 'Abrir, movimentar e fechar o caixa.',
  },
  {
    key: 'reports.view',
    group: 'sales',
    label: 'Ver relatórios',
    description: 'Relatórios de vendas.',
  },
]

export const positionDialogEditingMock: UnitPosition = {
  id: 'position-cashier',
  name: 'Caixa',
  level: 30,
  permissions: ['cashbox.operate'],
  isDefault: false,
  isProtected: false,
  memberCount: 1,
}
