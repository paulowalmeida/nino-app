import type { AuthUser } from '@shared/types/auth/auth-user'
import type { Membership } from '@shared/types/auth/membership'

export const loadSessionUserMock: AuthUser = {
  id: 'user-1',
  name: 'Maria Souza',
}

export const loadSessionMembershipsMock: Membership[] = [
  {
    unitId: 'unit-1',
    unitName: 'Loja Centro',
    unitSlug: 'loja-centro',
    companyId: 'company-1',
    companyName: 'Lanchonete do Zé',
    role: 'UNIT_OWNER',
    positionId: 'position-owner',
    positionName: 'Dono',
    positionLevel: 100,
    permissions: ['reports.view', 'catalog.manage', 'team.view'],
    isCurrent: true,
  },
]
