import type { StaffMember } from '@shared/types/team/staff-member'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const teamRosterAdapterMock = {
  currentUserId: 'user-1',
  staffName: 'Ana Souza',
  courierName: 'Beto Lima',
}

export const teamRosterStaffMembersMock = [
  {
    user: {
      id: 'user-1',
      name: 'Ana Souza',
      credentials: [],
      lastLoginAt: null,
    },
    role: 'UNIT_OWNER',
    position: { id: 'position-owner', name: 'Dono', level: 100 },
  },
  {
    user: {
      id: 'user-2',
      name: 'Caio Dias',
      credentials: [],
      lastLoginAt: null,
    },
    role: 'STAFF',
    position: { id: 'position-staff', name: 'Atendente', level: 10 },
  },
] as unknown as StaffMember[]

export const teamRosterAssignableMock: UnitPosition[] = [
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
