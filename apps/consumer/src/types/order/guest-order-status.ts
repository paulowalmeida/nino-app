import type { OrderChannel } from './order-channel'
import type { OrderStatus } from './order-status'
import type { OrderTimelineEntry } from './order-timeline-entry'

export type GuestOrderStatus = {
  id: string
  status: OrderStatus
  /** Ausente enquanto o endpoint público não expõe o canal do pedido. */
  channel?: OrderChannel
  estimatedDeliveryAt: string | null
  createdAt: string
  timeline: OrderTimelineEntry[]
}
