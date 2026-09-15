import type { CreateOrderItemRequest } from './create-order-item-request'
import type { GuestInfo } from './guest-info'
import type { OrderChannel } from './order-channel'
import type { PaymentMethod } from './payment-method'

export type CreateGuestOrderRequest = GuestInfo & {
  unitId: string
  channel: OrderChannel
  deliveryZoneId?: string
  paymentMethod: PaymentMethod
  changeFor?: number
  guestName: string
  guestPhone: string
  notes?: string
  items: CreateOrderItemRequest[]
}
