import type { Order } from '@custom_types/order'
import type { OrderStatusKey } from '@custom_types/order/order-status-key'

export type KitchenCardProps = {
  order: Order
  onAdvance: (orderId: string, target: OrderStatusKey) => void
  isBusy: boolean
}
