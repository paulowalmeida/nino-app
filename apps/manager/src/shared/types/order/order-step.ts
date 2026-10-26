import type { OrderStatusKey } from './order-status-key'

export type OrderStep = {
  target: OrderStatusKey
  label: string
}
