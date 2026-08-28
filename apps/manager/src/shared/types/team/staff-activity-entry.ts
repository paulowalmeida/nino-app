import type { OrderChannel } from '@shared/types/order/order-channel'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'

export type StaffActivityEntry = {
  id: string
  orderId: string
  orderNumber: number
  customerName: string | null
  channel: OrderChannel
  status: OrderStatusKey
  createdAt: string
  totalAmount: number
}
