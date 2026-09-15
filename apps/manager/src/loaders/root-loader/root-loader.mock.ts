import type { AuthUser } from '@shared/types/auth/auth-user'
import type { Membership } from '@shared/types/auth/membership'

export const rootLoaderUserMock: AuthUser = {
  id: 'user-1',
  name: 'Maria Souza',
}

export const rootLoaderSingleCompanyMembershipsMock: Membership[] = [
  {
    unitId: 'unit-1',
    unitName: 'Loja Centro',
    unitSlug: 'loja-centro',
    companyId: 'company-1',
    companyName: 'Lanchonete do Zé',
    role: 'UNIT_OWNER',
    isCurrent: true,
  },
]

export const rootLoaderMultiCompanyMembershipsMock: Membership[] = [
  rootLoaderSingleCompanyMembershipsMock[0],
  {
    unitId: 'unit-2',
    unitName: 'Loja Norte',
    unitSlug: 'loja-norte',
    companyId: 'company-2',
    companyName: 'Café da Praça',
    role: 'MANAGER',
    isCurrent: false,
  },
]

export const rootLoaderUnsafeUnitMembershipsMock: Membership[] = [
  {
    ...rootLoaderSingleCompanyMembershipsMock[0],
    unitId: '//external.example',
  },
]

export const rootLoaderStaffMembershipsMock: Membership[] = [
  {
    ...rootLoaderSingleCompanyMembershipsMock[0],
    role: 'STAFF',
  },
]
