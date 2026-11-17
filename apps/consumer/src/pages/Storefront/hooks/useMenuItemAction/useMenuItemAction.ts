import type { MenuItem } from '@custom_types/menu/menu-item'
import { useOpenProduct } from '@pages/Storefront/hooks/useOpenProduct/useOpenProduct'
import { useStorefrontCart } from '@pages/Storefront/hooks/useStorefrontCart/useStorefrontCart'

export const requiresChoice = (item: MenuItem) =>
  item.modifiers.some(
    (modifier) => modifier.isRequired || (modifier.minSelections ?? 0) > 0
  )

/**
 * WHY: produto com escolha obrigatória não pode entrar na sacola pelo `+` da
 * vitrine — sem o grupo obrigatório respondido a API recusa o pedido, então o
 * atalho vira uma ida à página do produto.
 */
export const useMenuItemAction = (unitId: string | undefined) => {
  const { openProduct } = useOpenProduct()
  const { addToCart } = useStorefrontCart(unitId)

  const addFromMenu = (item: MenuItem) => {
    if (requiresChoice(item)) return openProduct(item)

    addToCart(item)
  }

  return { addFromMenu, openProduct }
}
