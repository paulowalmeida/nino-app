import type { Membership } from '@custom_types/auth'

export const twoCompaniesMemberships: Membership[] = [
  {
    tenantId: 'tenant-1',
    tenantName: 'Loja Centro',
    tenantSlug: 'loja-centro',
    companyId: 'company-a',
    companyName: 'Padaria Boa',
    role: 'TENANT_OWNER',
    isCurrent: true,
  },
  {
    tenantId: 'tenant-2',
    tenantName: 'Loja Sul',
    tenantSlug: 'loja-sul',
    companyId: 'company-a',
    companyName: 'Padaria Boa',
    role: 'MANAGER',
    isCurrent: false,
  },
  {
    tenantId: 'tenant-3',
    tenantName: 'Loja Norte',
    tenantSlug: 'loja-norte',
    companyId: 'company-b',
    companyName: 'Hamburgueria Top',
    role: 'STAFF',
    isCurrent: false,
  },
]
