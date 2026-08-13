import type { CompanyGroup } from '@custom_types/session/company-group'

export const singleUnitCompany: CompanyGroup = {
  companyId: 'company-a',
  companyName: 'Padaria Boa',
  units: [
    {
      tenantId: 'tenant-1',
      tenantName: 'Loja Centro',
      tenantSlug: 'loja-centro',
      companyId: 'company-a',
      companyName: 'Padaria Boa',
      role: 'TENANT_OWNER',
      isCurrent: true,
    },
  ],
}

export const multiUnitCompany: CompanyGroup = {
  companyId: 'company-b',
  companyName: 'Hamburgueria Top',
  units: [
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
  ],
}
