import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import {
  toCatalogCategories,
  toCategoryRows,
} from '@pages/CatalogCategories/adapters/catalog-categories.adapter/catalog-categories.adapter'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { CategoryService } from '@shared/services/category/category.service'

export const useCatalogCategoriesQuery = (unitId: string | null) => {
  const categoriesQuery = useQuery({
    queryKey: queryKeys.productCategories.list(unitId ?? ''),
    queryFn: () => CategoryService.listCategories(unitId as string),
    enabled: !!unitId,
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
