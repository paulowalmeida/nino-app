import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const positionRowOwnerMock: UnitPosition = {
  id: 'position-owner',
  name: 'Dono',
  level: 100,
  permissions: ['reports.view'],
  isDefault: true,
  isProtected: true,
  memberCount: 1,
}

export const positionRowDefaultMock: UnitPosition = {
  id: 'position-manager',
  name: 'Gerente',
  level: 50,
  permissions: ['reports.view', 'catalog.manage'],
  isDefault: true,
  isProtected: false,
  memberCount: 2,
}

export const positionRowCustomMock: UnitPosition = {
  id: 'position-cashier',
  name: 'Caixa',
  level: 30,
  permissions: ['cashbox.operate'],
  isDefault: false,
  isProtected: false,
  memberCount: 1,
}
