import type { CreateOrderItemRequest } from './create-order-item-request'
import type { GuestInfo } from './guest-info'
import type { OrderChannel } from './order-channel'
import type { PaymentMethod } from './payment-method'
import type { CreateOrderPackageRequest } from './create-order-package-request'

export type CreateGuestOrderRequest = GuestInfo & {
  unitId: string
  channel: OrderChannel
  deliveryZoneId?: string
  paymentMethod: PaymentMethod
  changeFor?: number
  guestName: string
  guestPhone: string
  notes?: string
  // WHY: a API devolve 409 com o frete novo se a campanha acabou até aqui.
  expectsFreeDelivery?: boolean
  couponCode?: string
  selectedPromotionId?: string
  expectsDiscount?: boolean
  expectsGift?: boolean
  expectsPackage?: boolean
  package?: CreateOrderPackageRequest
  items: CreateOrderItemRequest[]
}
