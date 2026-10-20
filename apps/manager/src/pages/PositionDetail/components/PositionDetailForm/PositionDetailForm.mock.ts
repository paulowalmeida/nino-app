import type { PermissionDefinition } from '@shared/types/team/permission-definition.type'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const positionDetailFormCatalogMock: PermissionDefinition[] = [
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

export const positionDetailFormCustomMock: UnitPosition = {
  id: 'position-cashier',
  name: 'Caixa',
  level: 30,
  belowPositionId: 'position-manager',
  permissions: ['cashbox.operate'],
  isDefault: false,
  isProtected: false,
  memberCount: 2,
}

export const positionDetailFormDefaultMock: UnitPosition = {
  ...positionDetailFormCustomMock,
  id: 'position-staff',
  name: 'Atendente',
  isDefault: true,
}

export const positionDetailFormPositionsMock: UnitPosition[] = [
  {
    ...positionDetailFormCustomMock,
    id: 'position-owner',
    name: 'Dono',
    level: 100,
    belowPositionId: null,
    isDefault: true,
    isProtected: true,
  },
  {
    ...positionDetailFormCustomMock,
    id: 'position-manager',
    name: 'Gerente',
    level: 50,
    belowPositionId: 'position-owner',
    isDefault: true,
  },
  { ...positionDetailFormCustomMock, belowPositionId: 'position-manager' },
]

export const positionDetailFormOwnerMock: UnitPosition = {
  ...positionDetailFormDefaultMock,
  id: 'position-owner',
  name: 'Dono',
  belowPositionId: null,
  isProtected: true,
}
