import type { CartLine } from '@custom_types/cart/cart-line'
import type { CartItem } from '@custom_types/cart/cart-item'

export const addCartItem = (
  lines: Record<string, CartLine>,
  item: CartItem,
  quantity: number
): Record<string, CartLine> => ({
  ...lines,
  [item.id]: {
    item,
    quantity: (lines[item.id]?.quantity ?? 0) + quantity,
  },
})
