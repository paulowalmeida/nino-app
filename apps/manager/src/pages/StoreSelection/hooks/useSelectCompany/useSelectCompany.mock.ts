import type { Membership } from '@shared/types/auth/membership'

export const selectCompanyUnitsMock: Membership[] = [
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
    isCurrent: false,
  },
  {
    unitId: 'unit-2',
    unitName: 'Loja Zona Sul',
    unitSlug: 'loja-zona-sul',
    companyId: 'company-1',
    companyName: 'Lanchonete do Zé',
    role: 'UNIT_OWNER',
    positionId: 'position-owner',
    positionName: 'Dono',
    positionLevel: 100,
    permissions: ['reports.view', 'catalog.manage', 'team.view'],
    isCurrent: true,
  },
]
