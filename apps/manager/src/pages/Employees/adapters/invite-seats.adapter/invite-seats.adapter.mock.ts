import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const inviteSeatsAssignableMock: UnitPosition[] = [
  {
    id: 'position-manager',
    name: 'Gerente',
    level: 50,
    permissions: ['catalog.manage'],
    isDefault: true,
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
