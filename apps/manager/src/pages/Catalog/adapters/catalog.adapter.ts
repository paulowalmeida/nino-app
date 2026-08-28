import type { InfiniteData } from '@tanstack/react-query'

import type { CategoryWithProductCount } from '@shared/types/product/category-with-product-count'
import type { MenuItem } from '@shared/types/product/menu-item'
import type { MenuPage } from '@shared/types/product/menu-page'

export type CatalogListParams = {
  page: number
  size: number
  categoryId?: string
  search?: string
}

export const toCatalogListParams = (
  page: number,
  size: number,
  categoryId: string | null,
  search: string
): CatalogListParams => ({
  page,
  size,
  ...(categoryId ? { categoryId } : {}),
  ...(search ? { search } : {}),
})

export const toCatalogItems = (
  data: InfiniteData<MenuPage> | undefined
): MenuItem[] => data?.pages.flatMap((page) => page.data) ?? []

export const toCatalogTotal = (
  data: InfiniteData<MenuPage> | undefined
): number => data?.pages.at(-1)?.pagination.total ?? 0

/* WHY: chip de filtro é vitrine do que existe pra filtrar — categoria sem
 * produto não tem o que mostrar, então fica fora mesmo que exista. */
export const toCatalogCategories = (
  data: { data: CategoryWithProductCount[] } | undefined
) =>
  (data?.data ?? [])
    .filter(({ productCount }) => productCount > 0)
    .sort((a, b) => a.position - b.position)
