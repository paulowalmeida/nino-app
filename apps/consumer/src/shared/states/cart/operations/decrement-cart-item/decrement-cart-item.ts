import type { CartLine } from '@custom_types/cart/cart-line'

export const decrementCartItem = (
  lines: Record<string, CartLine>,
  itemId: string
): Record<string, CartLine> => {
  const line = lines[itemId]
  if (!line) return lines
  if (line.quantity <= 1) {
    return Object.fromEntries(
      Object.entries(lines).filter(([id]) => id !== itemId)
    )
  }

  return { ...lines, [itemId]: { ...line, quantity: line.quantity - 1 } }
}
