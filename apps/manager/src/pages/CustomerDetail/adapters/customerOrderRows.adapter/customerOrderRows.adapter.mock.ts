import type { CustomerHistoryEntry } from '@shared/types/customer/customer-history-entry'

export const customerOrderEntriesMock: CustomerHistoryEntry[] = [
  {
    id: 'order-9f3a2b7c',
    orderNumber: 1042,
    status: 'PENDING',
    totalAmount: 89.9,
    createdAt: '2026-02-10T18:30:00.000Z',
  },
  {
    id: 'order-1122cd34',
    orderNumber: 1043,
    status: 'CANCELLED',
    totalAmount: 42,
    createdAt: '2026-01-02T10:05:00.000Z',
  },
]
