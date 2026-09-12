import type { CreateOrderItemRequest } from './create-order-item-request'
import type { OrderChannel } from './order-channel'
import type { PaymentMethod } from './payment-method'

export type CreateConsumerOrderRequest = {
  tenantId: string
  deliveryAddressId?: string
  channel: OrderChannel
  deliveryZoneId?: string
  paymentMethod: PaymentMethod
  changeFor?: number
  notes?: string
  items: CreateOrderItemRequest[]
}
