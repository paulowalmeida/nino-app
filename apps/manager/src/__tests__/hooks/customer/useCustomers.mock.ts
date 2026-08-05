import type { CustomerHistory } from '@custom_types/customer/customer-history'
import type { CustomerHistoryPage } from '@custom_types/customer/customer-history-page'
import type { CustomerPage } from '@custom_types/customer/customer-page'
export const oneCustomerPage: CustomerPage = {
  data: [
    {
      id: 'customer-1',
      name: 'Ana Souza',
      phone: '11999990000',
      email: 'ana@example.com',
      loyaltyPoints: 10,
      since: '2026-01-01T00:00:00.000Z',
      orders: 3,
      spent: 150,
      lastOrderAt: '2026-07-01T00:00:00.000Z',
    },
  ],
  pagination: { total: 1, page: 1, size: 30 },
}

export const customerHistory: CustomerHistory = {
  id: 'customer-1',
  name: 'Ana Souza',
  phone: '11999990000',
  email: 'ana@example.com',
  loyaltyPoints: 10,
  since: '2026-01-01T00:00:00.000Z',
  orders: 3,
  spent: 150,
  lastOrderAt: '2026-07-01T00:00:00.000Z',
  history: [],
}

export const oneOrderHistoryPage: CustomerHistoryPage = {
  data: [
    { id: 'order-1', status: 'DELIVERED', totalAmount: 50, createdAt: '' },
  ],
  pagination: { total: 1, page: 1, size: 15 },
}
