import type { CompanyGroup } from '@shared/types/session/company-group'

export const companyPickListMock: CompanyGroup[] = [
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
        isCurrent: true,
      },
    ],
  },
  {
    companyId: 'company-2',
    companyName: 'Pizzaria Bella',
    units: [
      {
        unitId: 'unit-3',
        unitName: 'Loja Norte',
        unitSlug: 'loja-norte',
        companyId: 'company-2',
        companyName: 'Pizzaria Bella',
        role: 'UNIT_OWNER',
        isCurrent: false,
      },
    ],
  },
]
