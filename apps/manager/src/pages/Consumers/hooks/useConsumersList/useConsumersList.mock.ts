import type { ConsumerPage } from '@shared/types/consumer/consumer-page'

export const consumersListScopeMock = {
  tenantId: 'tenant-1',
  search: '  maria  ',
  trimmedSearch: 'maria',
}

export const consumersPageMock: ConsumerPage = {
  data: [
    {
      id: 'consumer-1',
      name: 'Maria Clara Souza',
      phone: '11988887777',
      email: 'maria@example.com',
      loyaltyPoints: 120,
      since: '2024-03-10T12:00:00.000Z',
      orders: 12,
      spent: 890.5,
      lastOrderAt: '2026-02-10T18:30:00.000Z',
    },
  ],
  pagination: { total: 1, page: 1, size: 30 },
}
