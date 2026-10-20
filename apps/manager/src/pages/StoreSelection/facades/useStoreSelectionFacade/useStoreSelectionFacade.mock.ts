import type { CompanyGroup } from '@shared/types/session/company-group'

export const companyGroupsMock: CompanyGroup[] = [
  {
    companyId: 'company-1',
    companyName: 'Lanchonete do Zé',
    units: [
      {
        unitId: 'unit-1',
        unitName: 'Loja Centro',
        unitSlug: 'loja-centro',
        companyId: 'company-1',
        companyName: 'Lanchonete do Zé',
        role: 'UNIT_OWNER',
        positionId: 'position-owner',
        positionName: 'Dono',
        positionLevel: 100,
        permissions: ['reports.view', 'catalog.manage', 'team.view'],
        isCurrent: true,
      },
    ],
  },
]
