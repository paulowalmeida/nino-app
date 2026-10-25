import type { CartItemModifier } from './cart-item-modifier'
import type { CreateOrderPackageRequest } from '../order/create-order-package-request'

export type CartItem = {
  id: string
  name: string
  price: string
  imageUrl: string | null
  modifiers?: CartItemModifier[]
  notes?: string
  package?: CreateOrderPackageRequest & { listPrice: number }
}
