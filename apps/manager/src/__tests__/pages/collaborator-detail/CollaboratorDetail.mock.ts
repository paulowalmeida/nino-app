import type { Membership } from '@custom_types/auth/membership'
import type {
  StaffActivityEntry,
} from '@custom_types/team/staff-activity-entry'
import type { StaffDetail } from '@custom_types/team/staff-detail'

export const currentTenant = { tenantId: 'tenant-1' } as Membership

export const counterTicketEntry: StaffActivityEntry = {
  id: 'activity-1',
  orderId: 'order-abcd1234',
  status: 'COMPLETED',
  createdAt: '2026-08-10T14:32:00.000Z',
  channel: 'COUNTER',
  totalAmount: 3000,
  customerName: 'Maria Silva',
}

export const staffDetail: StaffDetail = {
  tenantId: 'tenant-1',
  role: 'STAFF',
  isCurrent: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  user: {
    id: 'user-1',
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
  lastActivityAt: null,
  activity: [],
}
