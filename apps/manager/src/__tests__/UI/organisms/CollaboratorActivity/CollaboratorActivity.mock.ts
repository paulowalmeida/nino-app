import type {
  StaffActivityEntry,
} from '@custom_types/team/staff-activity-entry'

export const counterTicketEntry: StaffActivityEntry = {
  id: 'activity-1',
  orderId: 'order-abcd1234',
  status: 'COMPLETED',
  createdAt: '2026-08-10T14:32:00.000Z',
  channel: 'COUNTER',
  totalAmount: 3000,
  customerName: 'Maria Silva',
}

export const guestOrderEntry: StaffActivityEntry = {
  id: 'activity-2',
  orderId: 'order-efgh5678',
  status: 'DELIVERED',
  createdAt: '2026-08-11T09:15:00.000Z',
  channel: 'DELIVERY',
  totalAmount: 4550,
  customerName: null,
}
