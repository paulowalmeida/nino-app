import type { Membership } from '@custom_types/auth/membership'
import type { TenantDetail } from '@custom_types/store/tenant-detail'
export const currentTenant: Membership = {
  tenantId: 'tenant-1',
  tenantName: 'Lanchonete do Zé - Centro',
  tenantSlug: 'centro',
  companyId: 'company-1',
  companyName: 'Lanchonete do Zé',
  role: 'TENANT_OWNER',
  isCurrent: true,
}

export const branchUnit: TenantDetail = {
  id: 'tenant-1',
  isMain: false,
  customName: 'Unidade Centro',
  slug: 'padaria-centro',
  logoUrl: null,
  primaryColor: '#FF6B00',
  timezone: 'America/Sao_Paulo',
  zipCode: '01001000',
  street: 'Praça da Sé',
  number: '100',
  complement: null,
  neighborhood: 'Sé',
  city: 'São Paulo',
  state: 'SP',
}
