import type { CartLine } from '@custom_types/cart/cart-line'

export const quantityByProduct = (
  lines: CartLine[]
): Record<string, number> => {
  const totals: Record<string, number> = {}
  for (const line of lines) {
    totals[line.item.id] = (totals[line.item.id] ?? 0) + line.quantity
  }
  return totals
}
