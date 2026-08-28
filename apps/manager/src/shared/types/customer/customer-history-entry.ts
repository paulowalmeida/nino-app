import type { OrderStatusKey } from '@shared/types/order/order-status-key'

export type CustomerHistoryEntry = {
  id: string
  orderNumber: number
  status: OrderStatusKey
  totalAmount: number
  createdAt: string
}
