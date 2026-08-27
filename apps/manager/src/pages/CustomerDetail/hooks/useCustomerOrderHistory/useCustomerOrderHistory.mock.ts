import type { CustomerHistoryPage } from '@shared/types/customer/customer-history-page'

export const customerOrderHistoryScopeMock = {
  tenantId: 'tenant-1',
  customerId: 'customer-1',
}

export const customerOrderHistoryPageMock: CustomerHistoryPage = {
  data: [
    {
      id: 'order-9f3a2b7c',
      status: 'DELIVERED',
      totalAmount: 89.9,
      createdAt: '2026-02-10T18:30:00.000Z',
    },
  ],
  pagination: { total: 1, page: 1, size: 15 },
}
