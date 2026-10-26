import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const unitPositionsHookUnitIdMock = 'unit-1'

export const unitPositionsHookMock: UnitPosition[] = [
  {
    id: 'position-staff',
    name: 'Atendente',
    level: 10,
    belowPositionId: null,
    permissions: ['orders.operate'],
    isDefault: true,
    isProtected: false,
    memberCount: 3,
  },
]
