import type { Membership } from '@custom_types/auth'
import type { CompanyGroup } from '@custom_types/session/company-group'
import type { Subscription } from '@custom_types/account'
import type { TenantDetail } from '@custom_types/store'

export const hereUnit: Membership = {
  tenantId: 'tenant-1',
  tenantName: 'Lanchonete do Zé - Centro',
  tenantSlug: 'centro',
  companyId: 'company-1',
  companyName: 'Lanchonete do Zé',
  role: 'OWNER',
  isCurrent: true,
}

export const otherUnit: Membership = {
  tenantId: 'tenant-2',
  tenantName: 'Lanchonete do Zé - Norte',
  tenantSlug: 'norte',
  companyId: 'company-1',
  companyName: 'Lanchonete do Zé',
  role: 'OWNER',
  isCurrent: false,
}

export const companyGroups: CompanyGroup[] = [
  {
    companyId: 'company-1',
    companyName: 'Lanchonete do Zé',
    units: [hereUnit, otherUnit],
  },
]

export const tenantDetail: TenantDetail = {
  id: 'tenant-1',
  isMain: true,
  customName: null,
  slug: 'centro',
  logoUrl: null,
  primaryColor: null,
  timezone: 'America/Sao_Paulo',
  zipCode: '60110000',
  street: 'Rua das Flores',
  number: '100',
  complement: null,
  neighborhood: 'Centro',
  city: 'Fortaleza',
  state: 'CE',
}

export const activeSubscription: Subscription = {
  id: 'sub-1',
  companyId: 'company-1',
  isActive: true,
  startedAt: '2026-01-01T00:00:00.000Z',
  trialEndsAt: null,
  expiresAt: null,
  plan: {
    id: 'plan-1',
    name: 'Pro',
    slug: 'pro',
    price: '99.00',
    maxTenants: 5,
  },
  subscriptionStatus: { id: 'status-1', name: 'Ativa' },
}
