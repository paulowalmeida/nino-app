import type { StaffDetail } from '@custom_types/team/staff-detail'

export const staffToAdminister: StaffDetail = {
  tenantId: 'tenant-1',
  role: 'STAFF',
  isCurrent: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  user: {
    id: 'user-2',
    name: 'João Pereira',
    phone: '11988887777',
    isActive: true,
    lastLoginAt: '2026-07-01T00:00:00.000Z',
    profileCompletedAt: '2026-01-02T00:00:00.000Z',
    locale: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    credentials: [],
  },
  ordersHandled: 12,
  revenueHandled: 1284.5,
  statusChanges: 130,
  cancellations: 4,
  firstActivityAt: '2026-02-03T12:00:00.000Z',
  lastActivityAt: '2026-07-01T00:00:00.000Z',
  activity: [],
}

export const ownerToAdminister: StaffDetail = {
  ...staffToAdminister,
  role: 'TENANT_OWNER',
}
