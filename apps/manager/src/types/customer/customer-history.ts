import type { OrderStatusKey } from '@custom_types/order'

import type { TenantCustomer } from './tenant-customer'

export type CustomerHistoryEntry = {
  id: string
  status: OrderStatusKey
  totalAmount: number
  createdAt: string
}

export type CustomerHistory = TenantCustomer & {
  history: CustomerHistoryEntry[]
}
