import type { Membership } from '@shared/types/auth/membership'

export const companyPickCardMock = {
  companyName: 'Lanchonete do Zé',
  index: 1,
  singleUnit: [
    {
      tenantId: 'tenant-1',
      tenantName: 'Loja Centro',
      tenantSlug: 'loja-centro',
      companyId: 'company-1',
      companyName: 'Lanchonete do Zé',
      role: 'TENANT_OWNER',
      isCurrent: true,
    },
  ] satisfies Membership[],
  multipleUnits: [
    {
      tenantId: 'tenant-1',
      tenantName: 'Loja Centro',
      tenantSlug: 'loja-centro',
      companyId: 'company-1',
      companyName: 'Lanchonete do Zé',
      role: 'TENANT_OWNER',
      isCurrent: true,
    },
    {
      tenantId: 'tenant-2',
      tenantName: 'Loja Zona Sul',
      tenantSlug: 'loja-zona-sul',
      companyId: 'company-1',
      companyName: 'Lanchonete do Zé',
      role: 'TENANT_OWNER',
      isCurrent: false,
    },
  ] satisfies Membership[],
  unitCountLabel: '2 unidades',
}
