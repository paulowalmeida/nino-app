export const membershipMocks = [
  {
    unitId: 'unit-1',
    unitName: 'Centro',
    unitSlug: 'centro',
    companyId: 'company-1',
    companyName: 'Padoca',
    role: 'OWNER' as const,
    isCurrent: true,
  },
  {
    unitId: 'unit-2',
    unitName: 'Norte',
    unitSlug: 'norte',
    companyId: 'company-1',
    companyName: 'Padoca',
    role: 'STAFF' as const,
    isCurrent: false,
  },
]
