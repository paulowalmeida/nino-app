export const commandPaletteMock = {
  currentUnit: {
    unitId: 'unit-1',
    unitName: 'Loja Centro',
    unitSlug: 'loja-centro',
    companyId: 'company-1',
    companyName: 'Padoca',
    role: 'STAFF' as const,
    positionId: 'position-staff',
    positionName: 'Atendente',
    positionLevel: 10,
    permissions: ['orders.operate' as const],
    isCurrent: true,
  },
  query: 'pedidos',
}
