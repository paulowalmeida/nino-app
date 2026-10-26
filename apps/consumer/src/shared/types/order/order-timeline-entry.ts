import type { OrderStatus } from './order-status'

export type OrderTimelineEntry = {
  status: OrderStatus
  at: string
}
