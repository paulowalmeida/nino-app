import type { Membership } from '@custom_types/auth'

export const currentMembership: Membership = {
  tenantId: 'tenant-1',
  tenantName: 'Loja Centro',
  tenantSlug: 'loja-centro',
  companyId: 'company-a',
  companyName: 'Padaria Boa',
  role: 'MANAGER',
  isCurrent: true,
}

export const otherMembership: Membership = {
  tenantId: 'tenant-2',
  tenantName: 'Loja Sul',
  tenantSlug: 'loja-sul',
  companyId: 'company-a',
  companyName: 'Padaria Boa',
  role: 'STAFF',
  isCurrent: false,
}
