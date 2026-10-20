import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const positionDetailQueryPositionsMock: UnitPosition[] = [
  {
    id: 'position-cashier',
    name: 'Caixa',
    level: 30,
    permissions: ['cashbox.operate'],
    isDefault: false,
    isProtected: false,
    memberCount: 1,
  },
  {
    id: 'position-staff',
    name: 'Atendente',
    level: 10,
    permissions: ['orders.operate'],
    isDefault: true,
    isProtected: false,
    memberCount: 2,
  },
]
