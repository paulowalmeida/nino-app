import type { CartItem } from './cart-item'

export type CartLine = {
  item: CartItem
  quantity: number
}
