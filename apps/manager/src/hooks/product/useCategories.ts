import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { ProductCategory } from '@custom_types/product'
import {
  createCategory,
  listCategories,
} from '@services/product/product.service'

/**
 * Categorias direto da API, não do menu: uma categoria recém-criada ainda
 * não tem item e por isso não apareceria na lista do cardápio.
 */
export const useCategories = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.productCategories.list(tenantId ?? ''),
    queryFn: () => listCategories(tenantId as string),
    enabled: !!tenantId,
  })

  const categories: ProductCategory[] = query.data?.data ?? []

  return { ...query, categories }
}

export const useCreateCategory = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => createCategory(tenantId as string, name),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories.all(tenantId ?? ''),
      })
    },
  })
}
