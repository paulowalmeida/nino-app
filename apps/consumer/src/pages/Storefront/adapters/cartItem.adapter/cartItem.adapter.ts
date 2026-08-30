import type { CartItem } from '@custom_types/cart/cart-item'
import type { MenuItem } from '@custom_types/menu/menu-item'
import { primaryImage } from '@utils/menu-image'

export const cartItem = (item: MenuItem): CartItem => ({
  id: item.id,
  name: item.name,
  price: item.price,
  imageUrl: primaryImage(item),
})
