import type { Membership } from '@custom_types/auth/membership'

export const currentTenant: Membership = {
  tenantId: 'tenant-1',
  tenantName: 'Padaria Boa',
  tenantSlug: 'padaria-boa',
  companyId: 'company-1',
  companyName: 'Padaria Boa Ltda',
  role: 'TENANT_OWNER',
  isCurrent: true,
}
