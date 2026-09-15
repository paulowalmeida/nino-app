import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { toCatalogCategories } from '@pages/Catalog/adapters/catalog.adapter'
import { toCatalogViewStatus } from '@pages/Catalog/utils/catalog-view-status/catalog-view-status'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { CategoryService } from '@shared/services/category/category.service'

export const useCatalogCategoriesQuery = (
  unitId: string | null
) => {
  const query = useQuery({
    queryKey: queryKeys.productCategories.list(unitId ?? ''),
    queryFn: () => CategoryService.listCategories(unitId as string),
    enabled: !!unitId,
  })

  const categories = useMemo(
    () => toCatalogCategories(query.data),
    [query.data]
  )

  return {
    categories,
    status: toCatalogViewStatus(unitId !== null, query.status),
    queryStatus: query.status,
    fetchStatus: query.fetchStatus,
  }
}
