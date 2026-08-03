import type { OrderChannel } from '@custom_types/order/order-channel'
import type { OrderStatusKey } from '@custom_types/order/order-status-key'

/** Uma mudança de pedido feita por esta pessoa, com o que dá contexto à linha. */
export type StaffActivityEntry = {
  id: string
  orderId: string
  status: OrderStatusKey
  createdAt: string
  channel: OrderChannel
  totalAmount: number
  customerName: string | null
}
