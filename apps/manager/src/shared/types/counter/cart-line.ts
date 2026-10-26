import type { CartLineModifier } from './cart-line-modifier'

export type CartLine = {
  lineId?: string
  productId: string
  name: string
  unitPrice: string
  quantity: number
  modifiers?: CartLineModifier[]
}
