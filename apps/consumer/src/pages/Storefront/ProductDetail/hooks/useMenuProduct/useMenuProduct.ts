import type { MenuItem } from '@custom_types/menu/menu-item'
import { useMenu } from '@pages/Storefront/hooks/useMenu/useMenu'

export const useMenuProduct = (
  unitId: string | undefined,
  productId: string | undefined
) => {
  const menu = useMenu(unitId)
  const product: MenuItem | null =
    menu.sections
      .flatMap((section) => section.items)
      .find((item) => item.id === productId) ?? null

  return {
    product,
    isProductPending: menu.isPending,
    isProductError: menu.isError,
  }
}
