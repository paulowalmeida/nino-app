import type { CompanyGroup } from '@shared/types/session/company-group'

export const companyGroupsMock: CompanyGroup[] = [
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
]
