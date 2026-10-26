import type { CartLine } from '@custom_types/cart/cart-line'

export const incrementCartItem = (
  lines: Record<string, CartLine>,
  lineId: string
): Record<string, CartLine> => {
  const line = lines[lineId]
  if (!line) return lines

  return { ...lines, [lineId]: { ...line, quantity: line.quantity + 1 } }
}
