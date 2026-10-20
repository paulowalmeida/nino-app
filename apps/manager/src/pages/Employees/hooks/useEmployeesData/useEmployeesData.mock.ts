import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const employeesDataMock = {
  staffEntries: [],
  inactiveStaffEntries: [],
  courierEntries: [],
  isStaffPending: false,
  isInactiveStaffPending: false,
  isCourierPending: false,
  isError: false,
  currentUnit: { unitId: 'unit-1', role: 'UNIT_OWNER', positionLevel: 100 },
}

export const employeesDataPositionsMock: UnitPosition[] = [
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
    id: 'position-manager',
    name: 'Gerente',
    level: 50,
    belowPositionId: null,
    permissions: ['catalog.manage'],
    isDefault: true,
    isProtected: false,
    memberCount: 1,
  },
  {
    id: 'position-staff',
    name: 'Atendente',
    level: 10,
    belowPositionId: null,
    permissions: ['orders.operate'],
    isDefault: true,
    isProtected: false,
    memberCount: 2,
  },
]
