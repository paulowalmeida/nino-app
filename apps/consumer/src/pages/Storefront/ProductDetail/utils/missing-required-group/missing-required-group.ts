import type { MenuItem } from '@custom_types/menu/menu-item'
import type { MenuItemModifier } from '@custom_types/menu/menu-item-modifier'
import type { ProductChoiceSelections } from '@pages/Storefront/ProductDetail/types/ProductChoiceSelections.type'

export const missingRequiredGroup = (
  product: MenuItem,
  selections: ProductChoiceSelections
): MenuItemModifier | null =>
  product.modifiers.find(
    (group) =>
      (selections[group.id] ?? []).length <
      (group.minSelections ?? (group.isRequired ? 1 : 0))
  ) ?? null
