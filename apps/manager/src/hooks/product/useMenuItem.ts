import type { MenuItem } from '@custom_types/product/menu-item'
import { useMenu } from './useMenu'

type MenuItemQuery = {
  item: MenuItem | null
  categories: { value: string; label: string }[]
  isPending: boolean
  isError: boolean
}

/**
 * Reads the item from the menu already in cache instead of `GET /products/:id`,
 * which is OWNER-only — a MANAGER can list the menu but not read one item.
 * Categories come from the same list for the same reason.
 */
export const useMenuItem = (
  tenantId: string | null,
  productId: string | undefined
): MenuItemQuery => {
  const { data, sections, isPending, isError } = useMenu(tenantId)

  return {
    item: data?.data.find(({ id }) => id === productId) ?? null,
    categories: sections.map(({ id, name }) => ({ value: id, label: name })),
    isPending,
    isError,
  }
}
