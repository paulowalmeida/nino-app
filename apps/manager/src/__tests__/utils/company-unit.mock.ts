import type { Membership } from '@custom_types/auth/membership'

export const currentUnit: Membership = {
  tenantId: 'tenant-2',
  tenantName: 'Loja Sul',
  tenantSlug: 'loja-sul',
  companyId: 'company-a',
  companyName: 'Padaria Boa',
  role: 'TENANT_OWNER',
  isCurrent: true,
}

export const nonCurrentUnit: Membership = {
  tenantId: 'tenant-1',
  tenantName: 'Loja Centro',
  tenantSlug: 'loja-centro',
  companyId: 'company-a',
  companyName: 'Padaria Boa',
  role: 'MANAGER',
  isCurrent: false,
}

export const otherNonCurrentUnit: Membership = {
  tenantId: 'tenant-3',
  tenantName: 'Loja Norte',
  tenantSlug: 'loja-norte',
  companyId: 'company-a',
  companyName: 'Padaria Boa',
  role: 'MANAGER',
  isCurrent: false,
}
