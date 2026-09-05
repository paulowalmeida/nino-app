import type { MenuItem } from '@custom_types/menu/menu-item'
import { useOpenProduct } from '@pages/Storefront/hooks/useOpenProduct/useOpenProduct'
import { useStorefrontCart } from '@pages/Storefront/hooks/useStorefrontCart/useStorefrontCart'

/**
 * WHY: produto com escolha configurada não pode entrar na sacola pelo `+` da
 * vitrine — sem o grupo obrigatório respondido a API recusa o pedido, então o
 * atalho vira uma ida à página do produto.
 */
export const useMenuItemAction = (tenantId: string | undefined) => {
  const { openProduct } = useOpenProduct()
  const { addToCart } = useStorefrontCart(tenantId)

  const addFromMenu = (item: MenuItem) => {
    if (item.modifiers.length > 0) return openProduct(item)

    addToCart(item)
  }

  return { addFromMenu, openProduct }
}
