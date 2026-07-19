import type { Order, OrderStatusKey } from '@custom_types/order'

export type OrderTicketProps = {
  order: Order
  /** Runs the single move available on this order right now. */
  onAdvance: (orderId: string, target: OrderStatusKey) => void
  isBusy?: boolean
}
