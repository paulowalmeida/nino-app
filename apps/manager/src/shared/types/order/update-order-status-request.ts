import type { OrderStatusKey } from './order-status-key'

export type UpdateOrderStatusRequest = {
  status: OrderStatusKey
  cancelReason?: string
  pickupCode?: string
}
