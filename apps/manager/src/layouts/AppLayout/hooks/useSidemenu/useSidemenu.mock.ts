import type { Membership } from '@shared/types/auth/membership'

export const sidemenuCounterMembershipMock: Membership = {
  unitId: 'unit-1',
  unitName: 'Centro',
  unitSlug: 'centro',
  companyId: 'company-1',
  companyName: 'Padoca',
  role: 'STAFF',
  positionId: 'position-staff',
  positionName: 'Atendente',
  positionLevel: 10,
  permissions: ['orders.operate'],
  isCurrent: true,
}
