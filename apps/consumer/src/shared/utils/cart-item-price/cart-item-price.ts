import type { CartItem } from '@custom_types/cart/cart-item'

export const cartItemPrice = (item: CartItem): number =>
  (item.modifiers ?? []).reduce(
    (sum, modifier) => sum + Number(modifier.price) * modifier.quantity,
    Number(item.price)
  )
