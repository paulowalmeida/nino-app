import type { CartItem } from '@custom_types/cart/cart-item'
import type { MenuItem } from '@custom_types/menu/menu-item'
import type { ProductChoices } from '@pages/Storefront/types/ProductChoices.type'
import { primaryImage } from '@utils/menu-image'

const noChoices: ProductChoices = { modifiers: [] }

export const cartItem = (
  item: MenuItem,
  choices: ProductChoices = noChoices
): CartItem => ({
  id: item.id,
  name: item.name,
  price: item.price,
  imageUrl: primaryImage(item),
  ...(choices.modifiers.length > 0 ? { modifiers: choices.modifiers } : {}),
  ...(choices.notes?.trim() ? { notes: choices.notes.trim() } : {}),
})
