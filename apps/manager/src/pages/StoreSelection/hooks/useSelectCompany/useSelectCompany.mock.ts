import type { Membership } from '@shared/types/auth/membership'

export const selectCompanyUnitsMock: Membership[] = [
  {
    tenantId: 'tenant-1',
    tenantName: 'Loja Centro',
    tenantSlug: 'loja-centro',
    companyId: 'company-1',
    companyName: 'Lanchonete do Zé',
    role: 'TENANT_OWNER',
    isCurrent: false,
  },
  {
    tenantId: 'tenant-2',
    tenantName: 'Loja Zona Sul',
    tenantSlug: 'loja-zona-sul',
    companyId: 'company-1',
    companyName: 'Lanchonete do Zé',
    role: 'TENANT_OWNER',
    isCurrent: true,
  },
]
