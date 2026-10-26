import type { CartItemModifier } from '@custom_types/cart/cart-item-modifier'
import type { MenuItem } from '@custom_types/menu/menu-item'
import type { ProductChoiceSelections } from '@pages/Storefront/ProductDetail/types/ProductChoiceSelections.type'

export const chosenModifiers = (
  product: MenuItem,
  selections: ProductChoiceSelections
): CartItemModifier[] =>
  product.modifiers.flatMap((group) =>
    group.options
      .filter((option) => (selections[group.id] ?? []).includes(option.id))
      .map((option) => ({
        optionId: option.id,
        name: option.name,
        price: option.price,
        quantity: 1,
      }))
  )
