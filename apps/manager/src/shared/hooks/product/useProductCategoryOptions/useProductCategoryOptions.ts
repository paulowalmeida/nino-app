import { useQuery } from '@tanstack/react-query'

import { toProductCategoryOptions } from '@shared/adapters/product-category-options.adapter/product-category-options.adapter'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { CategoryService } from '@shared/services/category/category.service'

/* WHY: as categorias vêm da API, não do cardápio — uma categoria recém-criada
 * ainda não tem item e não apareceria na lista do menu.
 */
export const useProductCategoryOptions = (unitId: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.productCategories.list(unitId ?? ''),
    queryFn: () => CategoryService.listCategories(unitId as string),
    enabled: !!unitId,
  })

  const sorted = [...(query.data?.data ?? [])].sort(
    (one, other) => one.position - other.position
  )

  return {
    categoryOptions: toProductCategoryOptions(sorted),
    isPending: query.isPending,
  }
}
