import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const positionRemoveDialogMock: UnitPosition = {
  id: 'position-cashier',
  name: 'Caixa',
  level: 30,
  belowPositionId: null,
  permissions: ['cashbox.operate'],
  isDefault: false,
  isProtected: false,
  memberCount: 0,
}
