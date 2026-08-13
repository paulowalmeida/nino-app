import type { Membership } from '@custom_types/auth/membership'

export const singleUnit: Membership[] = [
  {
    tenantId: 'tenant-1',
    tenantName: 'Loja Centro',
    tenantSlug: 'loja-centro',
    companyId: 'company-a',
    companyName: 'Padaria Boa',
    role: 'TENANT_OWNER',
    isCurrent: true,
  },
]

export const multipleUnits: Membership[] = [
  {
    tenantId: 'tenant-2',
    tenantName: 'Loja Sul',
    tenantSlug: 'loja-sul',
    companyId: 'company-b',
    companyName: 'Hamburgueria Top',
    role: 'MANAGER',
    isCurrent: false,
  },
  {
    tenantId: 'tenant-3',
    tenantName: 'Loja Norte',
    tenantSlug: 'loja-norte',
    companyId: 'company-b',
    companyName: 'Hamburgueria Top',
    role: 'TENANT_OWNER',
    isCurrent: true,
  },
]
