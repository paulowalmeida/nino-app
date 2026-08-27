import type { TenantCustomer } from '@shared/types/customer/tenant-customer'

export const tenantCustomersMock: TenantCustomer[] = [
  {
    id: 'customer-1',
    name: 'Maria Clara Souza',
    phone: '11988887777',
    email: 'maria@example.com',
    loyaltyPoints: 120,
    since: '2024-03-10T12:00:00.000Z',
    orders: 12,
    spent: 890.5,
    lastOrderAt: '2026-02-10T18:30:00.000Z',
  },
  {
    id: 'customer-2',
    name: 'João Pedro Lima',
    phone: '11977776666',
    email: null,
    loyaltyPoints: 0,
    since: '2025-11-02T09:00:00.000Z',
    orders: 1,
    spent: 42,
    lastOrderAt: null,
  },
]
