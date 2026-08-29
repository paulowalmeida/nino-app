import type { CartLine } from '@custom_types/cart/cart-line'
import type { MenuItem } from '@custom_types/menu/menu-item'

export const addCartItem = (
  lines: Record<string, CartLine>,
  item: MenuItem,
  quantity: number
): Record<string, CartLine> => ({
  ...lines,
  [item.id]: {
    item,
    quantity: (lines[item.id]?.quantity ?? 0) + quantity,
  },
})
