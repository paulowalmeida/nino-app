import type { OrderStatusKey } from './order-queue-summary'

/** The single move the store can make on an order right now. */
export type OrderStep = {
  target: OrderStatusKey
  label: string
}
