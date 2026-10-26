import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const positionsContentPositionsMock: UnitPosition[] = [
  {
    id: 'position-owner',
    name: 'Dono',
    level: 100,
    belowPositionId: null,
    permissions: ['reports.view'],
    isDefault: true,
    isProtected: true,
    memberCount: 1,
  },
  {
    id: 'position-cashier',
    name: 'Caixa',
    level: 30,
    belowPositionId: null,
    permissions: ['cashbox.operate'],
    isDefault: false,
    isProtected: false,
    memberCount: 0,
  },
]
