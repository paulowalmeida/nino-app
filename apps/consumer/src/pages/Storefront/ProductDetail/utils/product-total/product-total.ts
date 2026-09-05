import type { MenuItem } from '@custom_types/menu/menu-item'
import type { ProductChoiceSelections } from '@pages/Storefront/ProductDetail/types/ProductChoiceSelections.type'
import { chosenModifiers } from '@pages/Storefront/ProductDetail/utils/chosen-modifiers/chosen-modifiers'

export const productTotal = (
  product: MenuItem,
  selections: ProductChoiceSelections,
  quantity: number
): number =>
  chosenModifiers(product, selections).reduce(
    (sum, modifier) => sum + Number(modifier.price) * modifier.quantity,
    Number(product.price)
  ) * quantity
