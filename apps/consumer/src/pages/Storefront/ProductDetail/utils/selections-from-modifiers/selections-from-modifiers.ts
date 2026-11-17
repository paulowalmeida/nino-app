import type { CartItemModifier } from '@custom_types/cart/cart-item-modifier'
import type { MenuItem } from '@custom_types/menu/menu-item'
import type { ProductChoiceSelections } from '@pages/Storefront/ProductDetail/types/ProductChoiceSelections.type'

/** Inverso de `chosenModifiers`: devolve as opções da linha ao formato da tela. */
export const selectionsFromModifiers = (
  product: Pick<MenuItem, 'modifiers'>,
  modifiers: CartItemModifier[] = []
): ProductChoiceSelections => {
  const chosen = new Set(modifiers.map((modifier) => modifier.optionId))

  return Object.fromEntries(
    product.modifiers
      .map((group) => [
        group.id,
        group.options
          .filter((option) => chosen.has(option.id))
          .map((option) => option.id),
      ])
      .filter(([, optionIds]) => optionIds.length > 0)
  )
}
