import type { AuthUser } from '@custom_types/auth/auth-user'
import type { TenantRole } from '@custom_types/auth/tenant-role'
import type { StaffDetail } from '@custom_types/team/staff-detail'
const user: AuthUser = {
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

export const staffDetail: StaffDetail = {
  tenantId: 'tenant-1',
  role: 'STAFF' as TenantRole,
  isCurrent: false,
  createdAt: '2026-07-01T00:00:00.000Z',
  user,
  revenueHandled: 0,
  statusChanges: 0,
  cancellations: 0,
  firstActivityAt: null,
  ordersHandled: 12,
  lastActivityAt: '2026-08-01T10:00:00.000Z',
  activity: [],
}
