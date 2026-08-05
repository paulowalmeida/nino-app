import type { CustomerHistory } from '@custom_types/customer/customer-history'
import type { Membership } from '@custom_types/auth/membership'
export const currentTenant = { tenantId: 'tenant-1' } as Membership

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
