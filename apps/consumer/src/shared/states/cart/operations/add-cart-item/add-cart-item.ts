import type { CartItem } from '@custom_types/cart/cart-item'
import type { CartLine } from '@custom_types/cart/cart-line'
import { cartLineKey } from '@utils/cart-line-key/cart-line-key'

export const addCartItem = (
  lines: Record<string, CartLine>,
  item: CartItem,
  quantity: number
): Record<string, CartLine> => {
  const id = cartLineKey(item)

  return {
    ...lines,
    [id]: { id, item, quantity: (lines[id]?.quantity ?? 0) + quantity },
  }
}
