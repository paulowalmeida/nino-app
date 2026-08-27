import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import {
  toCatalogCategories,
  toCategoryRows,
} from '@pages/CatalogCategories/adapters/catalog-categories.adapter/catalog-categories.adapter'
import { queryKeys } from '@shared/lib/query-keys'
import { CategoryService } from '@shared/services/category/category.service'

export const useCatalogCategoriesQuery = (tenantId: string | null) => {
  const categoriesQuery = useQuery({
    queryKey: queryKeys.productCategories.list(tenantId ?? ''),
    queryFn: () => CategoryService.listCategories(tenantId as string),
    enabled: !!tenantId,
  })
  const categories = useMemo(
    () => toCatalogCategories(categoriesQuery.data),
    [categoriesQuery.data]
  )
  const rows = useMemo(() => toCategoryRows(categories), [categories])

  return {
    categories,
    rows,
    isPending: categoriesQuery.isPending,
    isError: categoriesQuery.isError,
  }
}
