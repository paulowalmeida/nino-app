import type { CartItemModifier } from './cart-item-modifier'

export type CartItem = {
  id: string
  name: string
  price: string
  imageUrl: string | null
  modifiers?: CartItemModifier[]
  notes?: string
}
