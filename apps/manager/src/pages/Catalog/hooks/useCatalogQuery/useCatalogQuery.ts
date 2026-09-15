import { useMemo } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import {
  toCatalogItems,
  toCatalogListParams,
  toCatalogTotal,
} from '@pages/Catalog/adapters/catalog.adapter'
import { CATALOG_PAGE_SIZE } from '@pages/Catalog/constants/catalog.constants'
import { toCatalogViewStatus } from '@pages/Catalog/utils/catalog-view-status/catalog-view-status'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { ProductService } from '@shared/services/product/product.service'

export const useCatalogQuery = (
  unitId: string | null,
  categoryId: string | null,
  search: string
) => {
  const query = useInfiniteQuery({
    queryKey: queryKeys.products.catalog(unitId ?? '', categoryId, search),
    queryFn: ({ pageParam }) =>
      ProductService.listProducts(
        unitId as string,
        toCatalogListParams(
          pageParam,
          CATALOG_PAGE_SIZE,
          categoryId,
          search
        )
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const loadedItems = pages.reduce(
        (total, page) => total + page.data.length,
        0
      )
      return loadedItems < lastPage.pagination.total
        ? pages.length + 1
        : undefined
    },
    enabled: !!unitId,
  })

  const items = useMemo(() => toCatalogItems(query.data), [query.data])
  const total = useMemo(() => toCatalogTotal(query.data), [query.data])

  return {
    items,
    total,
    status: toCatalogViewStatus(unitId !== null, query.status),
    queryStatus: query.status,
    fetchStatus: query.fetchStatus,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
  }
}
