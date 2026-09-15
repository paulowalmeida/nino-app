import type { ConsumerHistoryPage } from '@shared/types/consumer/consumer-history-page'

export const consumerOrderHistoryScopeMock = {
  unitId: 'unit-1',
  consumerId: 'consumer-1',
}

export const consumerOrderHistoryPageMock: ConsumerHistoryPage = {
  data: [
    {
      id: 'order-9f3a2b7c',
      orderNumber: 1042,
      status: 'DELIVERED',
      totalAmount: 89.9,
      createdAt: '2026-02-10T18:30:00.000Z',
    },
  ],
  pagination: { total: 1, page: 1, size: 15 },
}
