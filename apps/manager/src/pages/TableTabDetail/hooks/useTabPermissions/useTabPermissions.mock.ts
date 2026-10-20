import type { Membership } from '@shared/types/auth/membership'

export const tabCancellerMembershipMock: Membership = {
  unitId: 'unit-1',
  unitName: 'Centro',
  unitSlug: 'centro',
  companyId: 'company-1',
  companyName: 'Padoca',
  role: 'MANAGER',
  positionId: 'position-manager',
  positionName: 'Gerente',
  positionLevel: 50,
  permissions: ['tabs.operate', 'tabs.cancel'],
  isCurrent: true,
}

export const tabOperatorMembershipMock: Membership = {
  ...tabCancellerMembershipMock,
  role: 'STAFF',
  positionName: 'Atendente',
  positionLevel: 10,
  permissions: ['tabs.operate'],
}
