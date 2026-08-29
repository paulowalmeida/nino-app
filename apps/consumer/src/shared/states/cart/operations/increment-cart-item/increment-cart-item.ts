import type { CartLine } from '@custom_types/cart/cart-line'

export const incrementCartItem = (
  lines: Record<string, CartLine>,
  itemId: string
): Record<string, CartLine> => {
  const line = lines[itemId]
  if (!line) return lines

  return { ...lines, [itemId]: { ...line, quantity: line.quantity + 1 } }
}
