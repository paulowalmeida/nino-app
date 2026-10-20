import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const positionDetailHeaderCustomMock: UnitPosition = {
  id: 'position-cashier',
  name: 'Caixa',
  level: 30,
  belowPositionId: null,
  permissions: ['cashbox.operate'],
  isDefault: false,
  isProtected: false,
  memberCount: 0,
}

export const positionDetailHeaderDefaultMock: UnitPosition = {
  ...positionDetailHeaderCustomMock,
  id: 'position-staff',
  name: 'Atendente',
  isDefault: true,
}

export const positionDetailHeaderOwnerMock: UnitPosition = {
  ...positionDetailHeaderDefaultMock,
  id: 'position-owner',
  name: 'Dono',
  isProtected: true,
}
