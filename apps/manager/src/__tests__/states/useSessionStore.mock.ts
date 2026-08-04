import type { AuthUser, Membership } from '@custom_types/auth'

export const authUser: AuthUser = {
  id: 'user-1',
  name: 'Fulano',
  phone: null,
  isActive: true,
  lastLoginAt: null,
  profileCompletedAt: null,
  locale: null,
  timezone: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  credentials: [],
}

export const memberships: Membership[] = [
  {
    tenantId: 'tenant-1',
    tenantName: 'Padaria Boa',
    tenantSlug: 'padaria-boa',
    companyId: 'company-1',
    companyName: 'Boa Alimentos',
    role: 'TENANT_OWNER',
    isCurrent: true,
  },
]
