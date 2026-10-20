import type { Membership } from '@shared/types/auth/membership'

export const permittedMembershipMock: Membership = {
  unitId: 'unit-1',
  unitName: 'Centro',
  unitSlug: 'centro',
  companyId: 'company-1',
  companyName: 'Padoca',
  role: 'MANAGER',
  positionId: 'position-manager',
  positionName: 'Gerente',
  positionLevel: 50,
  permissions: ['catalog.manage'],
  isCurrent: true,
}
