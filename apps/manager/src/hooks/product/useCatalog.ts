import { useMemo } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { MenuItem, MenuPage } from '@custom_types/product'
import { ProductService } from '@services/product.service'

/**
 * Twenty at a time: fits a screen and a half on mobile, which is roughly
 * how far someone scrolls before deciding to filter instead. A bigger page
 * only postpones the same problem.
 */
export const CATALOG_PAGE_SIZE = 20

type CatalogFilter = {
  categoryId: string | null
  search: string
}

/**
 * Fetches the catalog page by page instead of loading it whole: with a
 * thousand items, pulling everything up front means a megabyte of JSON
 * just to render twenty rows.
 */
export const useCatalog = (
  tenantId: string | null,
  { categoryId, search }: CatalogFilter
) => {
  const query = useInfiniteQuery({
    queryKey: queryKeys.products.catalog(tenantId ?? '', categoryId, search),
    enabled: !!tenantId,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      ProductService.listProducts(tenantId as string, {
        page: pageParam,
        size: CATALOG_PAGE_SIZE,
        categoryId: categoryId ?? undefined,
        search: search || undefined,
      }),
    getNextPageParam: (lastPage: MenuPage, pages: MenuPage[]) => {
      const loaded = pages.reduce((total, page) => total + page.data.length, 0)
      return loaded < lastPage.pagination.total ? pages.length + 1 : undefined
    },
  })

  const items: MenuItem[] = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data]
  )

  const total = query.data?.pages[0]?.pagination.total ?? 0

  return { ...query, items, total }
}
