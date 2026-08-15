import type { AuthUser } from '@custom_types/auth/auth-user'
import type { Membership } from '@custom_types/auth/membership'

export const sessionUser: Pick<AuthUser, 'name' | 'timezone'> = {
  name: 'Marina Souza',
  timezone: 'America/Sao_Paulo',
}

export const currentTenant: Membership = {
  tenantId: 'tenant-1',
  tenantName: 'Padaria Boa',
  tenantSlug: 'padaria-boa',
  companyId: 'company-1',
  companyName: 'Padaria Boa Ltda',
  role: 'TENANT_OWNER',
  isCurrent: true,
}
