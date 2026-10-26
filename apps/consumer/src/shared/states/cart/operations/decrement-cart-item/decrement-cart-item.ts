import type { CartLine } from '@custom_types/cart/cart-line'

export const decrementCartItem = (
  lines: Record<string, CartLine>,
  lineId: string
): Record<string, CartLine> => {
  const line = lines[lineId]
  if (!line) return lines
  if (line.quantity <= 1) {
    return Object.fromEntries(
      Object.entries(lines).filter(([id]) => id !== lineId)
    )
  }

  return { ...lines, [lineId]: { ...line, quantity: line.quantity - 1 } }
}
