import type { MenuItem } from '@custom_types/menu/menu-item'
import type { MenuItemModifier } from '@custom_types/menu/menu-item-modifier'
import type { ProductChoiceSelections } from '@pages/Storefront/ProductDetail/types/ProductChoiceSelections.type'

export const missingRequiredGroup = (
  product: MenuItem,
  selections: ProductChoiceSelections
): MenuItemModifier | null =>
  product.modifiers.find(
    (group) => group.isRequired && (selections[group.id] ?? []).length === 0
  ) ?? null
