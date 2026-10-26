import type { CreateOrderItemRequest } from './create-order-item-request'
import type { OrderChannel } from './order-channel'
import type { PaymentMethod } from './payment-method'
import type { CreateOrderPackageRequest } from './create-order-package-request'

export type CreateConsumerOrderRequest = {
  unitId: string
  deliveryAddressId?: string
  channel: OrderChannel
  deliveryZoneId?: string
  paymentMethod: PaymentMethod
  changeFor?: number
  notes?: string
  // WHY: a API devolve 409 com o frete novo se a campanha acabou até aqui.
  expectsFreeDelivery?: boolean
  couponCode?: string
  expectsDiscount?: boolean
  expectsGift?: boolean
  expectsPackage?: boolean
  package?: CreateOrderPackageRequest
  items: CreateOrderItemRequest[]
}
