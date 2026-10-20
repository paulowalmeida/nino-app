import type { StaffDetail } from '@shared/types/team/staff-detail'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const collaboratorAccessMock = {
  collaboratorName: 'Ana Souza',
  email: 'ana@example.com',
  role: 'UNIT_MANAGER',
}

export const collaboratorAccessPromotionOptionsMock: UnitPosition[] = [
  {
    id: 'position-manager',
    name: 'Gerente',
    level: 50,
    permissions: ['catalog.manage'],
    isDefault: true,
    isProtected: false,
    memberCount: 1,
  },
]

export const collaboratorAccessMemberOf = (
  profileCompletedAt: string | null,
  isActive: boolean
): StaffDetail =>
  ({
    role: 'STAFF',
    position: { id: 'position-staff', name: 'Atendente', level: 10 },
    user: {
      name: 'Ana Souza',
      isActive,
      profileCompletedAt,
      credentials: [{ email: 'ana@example.com' }],
    },
  }) as StaffDetail
