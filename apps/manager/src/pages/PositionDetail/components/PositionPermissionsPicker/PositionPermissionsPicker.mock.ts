import type { PermissionDefinition } from '@shared/types/team/permission-definition.type'

export const positionPermissionsPickerCatalogMock: PermissionDefinition[] = [
  {
    key: 'cashbox.operate',
    group: 'operation',
    label: 'Mexer no caixa',
    description: 'Abrir, movimentar e fechar o caixa.',
  },
  {
    key: 'orders.operate',
    group: 'operation',
    label: 'Operar pedidos',
    description: 'Fila e status.',
  },
  {
    key: 'reports.view',
    group: 'sales',
    label: 'Ver relatórios',
    description: 'Relatórios de vendas.',
  },
]
