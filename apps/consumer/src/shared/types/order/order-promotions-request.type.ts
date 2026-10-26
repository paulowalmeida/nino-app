import type { CreateOrderPackageRequest } from './create-order-package-request'

export type OrderPromotionsRequest = {
  couponCode?: string
  /** Desconto sem código escolhido na lista de cupons. */
  selectedPromotionId?: string
  expectsFreeDelivery?: boolean
  expectsDiscount?: boolean
  expectsGift?: boolean
  expectsPackage?: boolean
  package?: CreateOrderPackageRequest
}
