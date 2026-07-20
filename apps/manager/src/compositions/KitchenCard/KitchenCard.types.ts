import type { Order, OrderStatusKey } from '@custom_types/order'

export type KitchenCardProps = {
  order: Order
  onAdvance: (orderId: string, target: OrderStatusKey) => void
  isBusy: boolean
}
