import type { CartItem } from '@custom_types/cart/cart-item'

/**
 * WHY: as opções entram ordenadas porque a ordem do clique não pode criar uma
 * linha nova para o mesmo pedido.
 */
export const cartLineKey = (item: CartItem): string =>
  item.modifiers?.length || item.notes
    ? [
        item.id,
        (item.modifiers ?? [])
          .map((modifier) => `${modifier.optionId}x${modifier.quantity}`)
          .sort()
          .join(','),
        item.notes ?? '',
      ].join('|')
    : item.id
