import type { OrderStatusKey } from '@custom_types/order/order-status-key'

export type CustomerHistoryEntry = {
  id: string
  status: OrderStatusKey
  totalAmount: number
  createdAt: string
}
