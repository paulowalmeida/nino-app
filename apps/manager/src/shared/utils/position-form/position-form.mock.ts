import type { PermissionDefinition } from '@shared/types/team/permission-definition.type'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const positionFormCatalogMock: PermissionDefinition[] = [
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
  {
    key: 'orders.operate',
    group: 'operation',
    label: 'Operar pedidos',
    description: 'Fila e status.',
  },
]

export const positionFormPositionMock: UnitPosition = {
  id: 'position-1',
  name: 'Caixa',
  level: 30,
  belowPositionId: 'position-manager',
  permissions: ['cashbox.operate'],
  isDefault: false,
  isProtected: false,
  memberCount: 1,
}

export const positionFormTopMock: UnitPosition = {
  ...positionFormPositionMock,
  id: 'position-owner',
  name: 'Dono',
  level: 100,
  belowPositionId: null,
}

export const positionFormRankedMock: UnitPosition[] = [
  positionFormTopMock,
  {
    ...positionFormPositionMock,
    id: 'position-manager',
    name: 'Gerente',
    level: 50,
    belowPositionId: 'position-owner',
  },
  positionFormPositionMock,
]
