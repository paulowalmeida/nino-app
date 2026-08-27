import type { AuthUser } from '@shared/types/auth/auth-user'
import type { Membership } from '@shared/types/auth/membership'

export const sessionStateUserMock: AuthUser = {
  id: 'user-1',
  name: 'Maria Souza',
}

export const sessionStateMembershipsMock: Membership[] = [
  {
    tenantId: 'tenant-1',
    tenantName: 'Loja Centro',
    tenantSlug: 'loja-centro',
    companyId: 'company-1',
    companyName: 'Lanchonete do Zé',
    role: 'TENANT_OWNER',
    isCurrent: true,
  },
]
