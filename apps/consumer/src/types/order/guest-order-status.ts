import type { OrderChannel } from './order-channel'
import type { OrderStatus } from './order-status'
import type { OrderTimelineEntry } from './order-timeline-entry'

export type GuestOrderStatus = {
  id: string
  status: OrderStatus
  channel: OrderChannel
  estimatedDeliveryAt: string | null
  createdAt: string
  timeline: OrderTimelineEntry[]
}
