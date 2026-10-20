import type { StaffDetail } from '@shared/types/team/staff-detail'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const collaboratorDetailAdminMock = {
  memberId: 'user-1',
  ownerRole: 'UNIT_OWNER',
}

export const ownerPositionLevelMock = 100

export const unitPositionsMock: UnitPosition[] = [
  {
    id: 'position-owner',
    name: 'Dono',
    level: 100,
    permissions: ['reports.view'],
    isDefault: true,
    isProtected: true,
    memberCount: 1,
  },
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

export const staffMemberDetailMock = {
  role: 'STAFF',
  position: { id: 'position-staff', name: 'Atendente', level: 10 },
  user: { id: 'user-1' },
} as StaffDetail

export const managerMemberDetailMock = {
  role: 'MANAGER',
  position: { id: 'position-manager', name: 'Gerente', level: 50 },
  user: { id: 'user-2' },
} as StaffDetail

export const ownerMemberDetailMock = {
  role: 'UNIT_OWNER',
  position: { id: 'position-owner', name: 'Dono', level: 100 },
  user: { id: 'owner-2' },
} as StaffDetail
