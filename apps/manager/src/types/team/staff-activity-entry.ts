import type { OrderStatusKey } from '@custom_types/order/order-status-key'

/** Uma mudança de pedido feita por esta pessoa. */
export type StaffActivityEntry = {
  id: string
  orderId: string
  status: OrderStatusKey
  createdAt: string
}
