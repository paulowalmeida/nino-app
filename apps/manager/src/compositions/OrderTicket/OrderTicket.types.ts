import type { Order } from '@custom_types/order'
import type { OrderStatusKey } from '@custom_types/order/order-status-key'

export type OrderTicketProps = {
  order: Order
  /** Runs the single move available on this order right now. */
  onAdvance: (orderId: string, target: OrderStatusKey) => void
  isBusy?: boolean
}
