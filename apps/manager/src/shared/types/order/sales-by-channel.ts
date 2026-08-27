import type { OrderChannel } from './order-channel'

export type SalesByChannel = {
  channel: OrderChannel
  revenue: number
  orderCount: number
}
