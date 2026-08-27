import type { CompanyGroup } from '@shared/types/session/company-group'

export const companyPickListMock: CompanyGroup[] = [
  {
    companyId: 'company-1',
    companyName: 'Lanchonete do Zé',
    units: [
      {
        tenantId: 'tenant-1',
        tenantName: 'Loja Centro',
        tenantSlug: 'loja-centro',
        companyId: 'company-1',
        companyName: 'Lanchonete do Zé',
        role: 'TENANT_OWNER',
        isCurrent: true,
      },
    ],
  },
  {
    companyId: 'company-2',
    companyName: 'Pizzaria Bella',
    units: [
      {
        tenantId: 'tenant-3',
        tenantName: 'Loja Norte',
        tenantSlug: 'loja-norte',
        companyId: 'company-2',
        companyName: 'Pizzaria Bella',
        role: 'TENANT_OWNER',
        isCurrent: false,
      },
    ],
  },
]
