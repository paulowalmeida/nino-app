import type { CreateOrderItem } from './create-order-item'
import type { OrderChannel } from './order-channel'
import type { PaymentMethod } from './payment-method'

export type CreateOrderRequest = {
  channel: OrderChannel
  paymentMethod: PaymentMethod
  items: CreateOrderItem[]
  deliveryZoneId?: string
  tableNumber?: string
  notes?: string
  changeFor?: number
  guestName?: string
  guestPhone?: string
  guestStreet?: string
  guestNumber?: string
  guestComplement?: string
  guestNeighborhood?: string
}
