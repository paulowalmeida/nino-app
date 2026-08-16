import type { TopCustomer } from '@custom_types/customer/top-customer'

export const topSpenders: TopCustomer[] = [
  { id: 'customer-1', name: 'Ana', orders: 8, spent: 420 },
  { id: 'customer-2', name: 'Bruno', orders: 3, spent: 90 },
]

export const topFrequent: TopCustomer[] = [
  { id: 'customer-2', name: 'Bruno', orders: 12, spent: 90 },
  { id: 'customer-1', name: 'Ana', orders: 8, spent: 420 },
]
