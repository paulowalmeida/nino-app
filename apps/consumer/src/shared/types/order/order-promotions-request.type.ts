import type { CreateOrderPackageRequest } from './create-order-package-request'

export type OrderPromotionsRequest = {
  couponCode?: string
  expectsFreeDelivery?: boolean
  expectsDiscount?: boolean
  expectsGift?: boolean
  expectsPackage?: boolean
  package?: CreateOrderPackageRequest
}
