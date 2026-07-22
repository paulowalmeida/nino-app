import type { OrderStatus } from './order-status'
import type { OrderTimelineEntry } from './order-timeline-entry'

export type GuestOrderStatus = {
  id: string
  status: OrderStatus
  estimatedDeliveryAt: string | null
  createdAt: string
  timeline: OrderTimelineEntry[]
}
