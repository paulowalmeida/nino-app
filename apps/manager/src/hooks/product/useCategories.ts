import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { ProductCategory } from '@custom_types/product/product-category'
import { CategoryService } from '@services/category.service'

/**
 * Categories straight from the API, not from the menu: a freshly created
 * category has no items yet, so it wouldn't show up in the menu list.
 */
export const useCategories = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.productCategories.list(tenantId ?? ''),
    queryFn: () => CategoryService.listCategories(tenantId as string),
    enabled: !!tenantId,
  })

  const categories: ProductCategory[] = query.data?.data ?? []

  return { ...query, categories }
}
