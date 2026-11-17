import type { CartItem } from '@custom_types/cart/cart-item'
import type { CartLine } from '@custom_types/cart/cart-line'
import { cartLineKey } from '@utils/cart-line-key/cart-line-key'

/**
 * WHY: editar uma linha troca a identidade dela — a chave nasce das opções.
 * Se a nova chave já existe na sacola, as quantidades se somam em vez de
 * duplicar; quantidade zero remove a linha.
 */
export const updateCartLine = (
  lines: Record<string, CartLine>,
  lineId: string,
  item: CartItem,
  quantity: number
): Record<string, CartLine> => {
  if (!lines[lineId]) return lines

  const others = Object.fromEntries(
    Object.entries(lines).filter(([id]) => id !== lineId)
  )
  if (quantity <= 0) return others

  const id = cartLineKey(item)
  const merged = (others[id]?.quantity ?? 0) + quantity

  return { ...others, [id]: { id, item, quantity: merged } }
}
