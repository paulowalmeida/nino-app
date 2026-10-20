import type { AuthUser } from '@shared/types/auth/auth-user'
import type { Membership } from '@shared/types/auth/membership'

export const permissionGuardUserMock: AuthUser = {
  id: 'user-1',
  name: 'Maria Souza',
}

export const permissionGuardManagerMembershipMock: Membership = {
  unitId: 'unit-manager',
  unitName: 'Loja Centro',
  unitSlug: 'loja-centro',
  companyId: 'company-1',
  companyName: 'Lanchonete do Zé',
  role: 'MANAGER',
  positionId: 'position-manager',
  positionName: 'Gerente',
  positionLevel: 50,
  permissions: ['reports.view', 'catalog.manage'],
  isCurrent: true,
}

export const permissionGuardCounterMembershipMock: Membership = {
  ...permissionGuardManagerMembershipMock,
  unitId: 'unit-counter',
  role: 'STAFF',
  positionName: 'Atendente',
  positionLevel: 10,
  permissions: ['orders.operate'],
}
