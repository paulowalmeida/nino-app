import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const ownerPositionMock: UnitPosition = {
  id: 'position-owner',
  name: 'Dono',
  level: 100,
  belowPositionId: null,
  permissions: ['reports.view'],
  isDefault: true,
  isProtected: true,
  memberCount: 1,
}

export const managerPositionMock: UnitPosition = {
  id: 'position-manager',
  name: 'Gerente',
  level: 50,
  belowPositionId: null,
  permissions: ['reports.view', 'catalog.manage'],
  isDefault: true,
  isProtected: false,
  memberCount: 1,
}

export const cashierPositionMock: UnitPosition = {
  id: 'position-cashier',
  name: 'Caixa',
  level: 30,
  belowPositionId: null,
  permissions: ['cashbox.operate'],
  isDefault: false,
  isProtected: false,
  memberCount: 0,
}

export const staffPositionMock: UnitPosition = {
  id: 'position-staff',
  name: 'Atendente',
  level: 10,
  belowPositionId: null,
  permissions: ['orders.operate'],
  isDefault: true,
  isProtected: false,
  memberCount: 2,
}

export const allPositionsMock: UnitPosition[] = [
  ownerPositionMock,
  managerPositionMock,
  cashierPositionMock,
  staffPositionMock,
]
