import type { AuthUser } from '@custom_types/auth/auth-user'
import type { TenantRole } from '@custom_types/auth/tenant-role'
import type { StaffMember } from '@custom_types/team/staff-member'
import type { StaffPage } from '@custom_types/team/staff-page'
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
