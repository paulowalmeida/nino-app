import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const positionsTableOwnerMock: UnitPosition = {
  id: 'position-owner',
  name: 'Dono',
  level: 100,
  belowPositionId: null,
  permissions: ['reports.view'],
  isDefault: true,
  isProtected: true,
  memberCount: 1,
}

export const positionsTableDefaultMock: UnitPosition = {
  id: 'position-manager',
  name: 'Gerente',
  level: 50,
  belowPositionId: null,
  permissions: ['reports.view', 'catalog.manage'],
  isDefault: true,
  isProtected: false,
  memberCount: 2,
}

export const positionsTableCustomMock: UnitPosition = {
  id: 'position-cashier',
  name: 'Caixa',
  level: 30,
  belowPositionId: null,
  permissions: ['cashbox.operate'],
  isDefault: false,
  isProtected: false,
  memberCount: 1,
}
