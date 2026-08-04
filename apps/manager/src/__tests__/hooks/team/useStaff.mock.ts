import type { AuthUser, TenantRole } from '@custom_types/auth'
import type { StaffMember, StaffPage } from '@custom_types/team'

const owner: AuthUser = {
  id: 'user-1',
  name: 'Ana Souza',
  phone: '85999990000',
  isActive: true,
  lastLoginAt: null,
  profileCompletedAt: null,
  locale: null,
  timezone: null,
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
  credentials: [],
}

export const ownerMember: StaffMember = {
  tenantId: 'tenant-1',
  role: 'TENANT_OWNER' as TenantRole,
  isCurrent: true,
  createdAt: '2026-07-01T00:00:00.000Z',
  user: owner,
}

export const staffPage: StaffPage = {
  data: [ownerMember],
  pagination: { total: 1 },
}
