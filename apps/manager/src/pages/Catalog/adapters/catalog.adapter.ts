import type { InfiniteData } from '@tanstack/react-query'

import type { MenuItem } from '@shared/types/product/menu-item'
import type { MenuPage } from '@shared/types/product/menu-page'
import type { ProductCategory } from '@shared/types/product/product-category'

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

export const toCatalogCategories = (data: { data: ProductCategory[] } | undefined) =>
  [...(data?.data ?? [])].sort((a, b) => a.position - b.position)
