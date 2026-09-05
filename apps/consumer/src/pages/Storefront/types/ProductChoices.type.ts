import type { CartItemModifier } from '@custom_types/cart/cart-item-modifier'

export type ProductChoices = {
  modifiers: CartItemModifier[]
  notes?: string
}
